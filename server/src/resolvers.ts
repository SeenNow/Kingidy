import prisma from './prismaClient';
import { estimateMessageTokens } from './utils/tokenizer';
import { callLLM, LLMResponse } from './services/llm';

export const resolvers = {
  Query: {
    async getChats(_: any, { userId }: any) {
      return prisma.chat.findMany({
        where: { participants: { some: { id: userId } } },
        include: { participants: true }
      });
    },
    async getChat(_: any, { chatId }: any) {
      return prisma.chat.findUnique({
        where: { id: chatId },
        include: { participants: true }
      });
    },
    async getMessages(_: any, { chatId, limit = 50, offset = 0 }: any) {
      return prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'asc' },
        skip: offset,
        take: limit
      });
    },
    async getTokenSummary(_: any, { userId }: any) {
      const usage = await prisma.tokenUsage.aggregate({
        where: { userId },
        _sum: { tokens: true }
      });
      const tokensUsed = usage._sum.tokens || 0;
      return { tokensUsed, promptTokens: null, responseTokens: null };
    }
  },
  Mutation: {
    async createChat(_: any, { title, ownerId }: any) {
      const chat = await prisma.chat.create({
        data: {
          title,
          owner: { connect: { id: ownerId } },
          participants: { connect: { id: ownerId } }
        },
        include: { participants: true }
      });
      return chat;
    },

    async deleteChat(_: any, { chatId }: any) {
      // delete messages first to avoid cascade constraints if necessary
      await prisma.message.deleteMany({ where: { chatId } });
      await prisma.tokenUsage.deleteMany({ where: { chatId } });
      await prisma.chat.delete({ where: { id: chatId } });
      return true;
    },

    async sendMessage(_: any, { input }: any) {
      const { chatId, content, role = 'USER', model, userId } = input;
      // store user message
      const promptTokens = estimateMessageTokens(content, role);

      const userMessage = await prisma.message.create({
        data: {
          chatId,
          userId: userId || null,
          role,
          content,
          model,
          promptTokens,
          tokens: promptTokens
        }
      });

      // record token usage
      await prisma.tokenUsage.create({
        data: {
          userId: userId || null,
          chatId,
          messageId: userMessage.id,
          model: model || 'unknown',
          tokens: promptTokens
        }
      });

      // produce assistant reply (LLM if available, otherwise fallback)
      const llmResult: LLMResponse = await callLLM(content, model || 'gpt-3.5-turbo');
      const replyContent = llmResult.reply;
      const responseTokens = llmResult.responseTokens ?? estimateMessageTokens(replyContent, 'ASSISTANT');
      const totalTokens = (llmResult.totalTokens ?? (promptTokens + responseTokens));

      const assistantMessage = await prisma.message.create({
        data: {
          chatId,
          role: 'ASSISTANT',
          content: replyContent,
          model: model || 'demo-model',
          tokens: totalTokens,
          promptTokens,
          responseTokens
        }
      });

      await prisma.tokenUsage.create({
        data: {
          userId: userId || null,
          chatId,
          messageId: assistantMessage.id,
          model: model || 'demo-model',
          tokens: totalTokens
        }
      });

      // subscriptions and realtime publishing can be added here (websocket / pubsub)

      return {
        message: userMessage,
        reply: assistantMessage,
        tokenSummary: { tokensUsed: totalTokens, promptTokens, responseTokens }
      };
    }
  },
  // Subscriptions can be added later (e.g., with graphql-ws and a PubSub implementation)
};
