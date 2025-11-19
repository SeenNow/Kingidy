import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum MessageRole { USER ASSISTANT SYSTEM TOOL }

  type User {
    id: ID!
    name: String
    email: String
    createdAt: String
    updatedAt: String
  }

  type Chat {
    id: ID!
    title: String
    ownerId: ID!
    participants: [User!]
    createdAt: String
    updatedAt: String
  }

  type Message {
    id: ID!
    chatId: ID!
    userId: ID
    role: MessageRole!
    content: String!
    model: String
    tokens: Int
    promptTokens: Int
    responseTokens: Int
    createdAt: String
  }

  type TokenSummary {
    tokensUsed: Int!
    promptTokens: Int
    responseTokens: Int
  }

  input SendMessageInput {
    chatId: ID!
    content: String!
    role: MessageRole = USER
    model: String
    userId: ID
  }

  type SendMessagePayload {
    message: Message!
    reply: Message
    tokenSummary: TokenSummary
  }

  type Query {
    getChats(userId: ID!): [Chat!]!
    getChat(chatId: ID!): Chat
    getMessages(chatId: ID!, limit: Int = 50, offset: Int = 0): [Message!]!
    getTokenSummary(userId: ID!): TokenSummary
  }

  type Mutation {
    createChat(title: String, ownerId: ID!): Chat!
    sendMessage(input: SendMessageInput!): SendMessagePayload!
    deleteChat(chatId: ID!): Boolean!
  }

  type Subscription {
    messageAdded(chatId: ID!): Message
  }
`;
