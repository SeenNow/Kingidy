/// <reference types="react" />
import React, { useEffect, useState } from 'react';
import { ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';
import '../styles/chat.css';
import client from '../apolloClient';
import ChatHeader from '../components/ChatHeader';

const formatTime = (iso?: string) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString(); } catch (e) { return iso; }
};

const GET_CHATS = gql`
  query GetChats($userId: ID!) {
    getChats(userId: $userId) { id title ownerId participants { id name } }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($title: String, $ownerId: ID!) {
    createChat(title: $title, ownerId: $ownerId) { id title ownerId }
  }
`;

const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: ID!) {
    deleteChat(chatId: $chatId)
  }
`;

const GET_MESSAGES = gql`
  query GetMessages($chatId: ID!, $limit: Int, $offset: Int) {
    getMessages(chatId: $chatId, limit: $limit, offset: $offset) { id chatId userId role content promptTokens responseTokens tokens createdAt }
  }
`;

const GET_TOKEN_SUMMARY = gql`
  query GetTokenSummary($userId: ID!) {
    getTokenSummary(userId: $userId) { tokensUsed }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) { message { id content } reply { id content } tokenSummary { tokensUsed } }
  }
`;

const ChatList: React.FC<{ userId: string; onSelect: (chatId: string) => void }> = ({ userId, onSelect }) => {
  const { data, loading, error } = useQuery(GET_CHATS, { variables: { userId } });
  const [createChat] = useMutation(CREATE_CHAT);
  const [title, setTitle] = React.useState('');

  if (loading) return <div>Loading chats...</div>;
  if (error) return <div>Error loading chats: {String(error.message)}</div>;

  

  return (
    <div className="chat-list">
      <div className="create-chat">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New chat title" />
        <button onClick={async () => {
          const result = await createChat({ variables: { title, ownerId: userId } });
          if (result?.data?.createChat) {
            onSelect(result.data.createChat.id);
            setTitle('');
          }
        }}>Create</button>
      </div>
      {data.getChats.map((chat: any) => (
        <div key={chat.id} className="chat-list-item" onClick={() => onSelect(chat.id)}>
          {chat.title || 'Untitled Chat'}
        </div>
      ))}
    </div>
  );
};

const MessageList: React.FC<{ chatId: string | null }> = ({ chatId }) => {
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, { variables: { chatId, limit: 200, offset: 0 }, skip: !chatId });
  useEffect(() => { if (chatId) refetch(); }, [chatId]);

  if (!chatId) return <div>Select a chat to see messages</div>;
  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error loading messages</div>;

  return (
    <div className="messages">
      {data.getMessages.map((m: any) => (
        <div key={m.id} className={`message ${m.role.toLowerCase()}`}>
          <div className="message-role">{m.role} <span className="message-time">{formatTime(m.createdAt)}</span></div>
          <div className="message-content">{m.content}</div>
          <div className="message-tokens">Tokens: {m.tokens ?? 0} (prompt {m.promptTokens ?? 0} / resp {m.responseTokens ?? 0})</div>
        </div>
      ))}
    </div>
  );
};

const MessageInput: React.FC<{ chatId: string | null; userId: string; model: string }> = ({ chatId, userId, model }) => {
  const [text, setText] = useState('');
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

  const onSend = async () => {
    if (!chatId || !text) return;
    try {
      await sendMessage({ variables: { input: { chatId, content: text, role: 'USER', userId, model } } });
      setText('');
    } catch (err) {
      console.error('send message error', err);
    }
  };

  return (
    <div className="message-input">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
      <button onClick={onSend} disabled={loading || !text}>Send</button>
    </div>
  );
};

const ChatPageInner: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  // TODO: replace with actual authenticated user id
  const userId = '00000000-0000-0000-0000-000000000000';
  const { data: tokenData } = useQuery(GET_TOKEN_SUMMARY, { variables: { userId } });
  const [themeDark, setThemeDark] = useState(true);
  // Use Vite environment if available (import.meta.env) or fallback to global `window.__env` for runtime env injection
    /* import.meta.env is typed in Vite; to avoid compile errors in our raw TS, we safely access the env via window.__env or fallback.
      Vite will replace import.meta.env variables at build time; for dev safety we handle both. */
    const defaultModel = ((window as any).__env && (window as any).__env.VITE_DEFAULT_MODEL) || 'gpt-3.5-turbo';
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel);
  const [deleteChat] = useMutation(DELETE_CHAT);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chat_theme_dark');
      if (saved !== null) setThemeDark(saved === 'true');
    } catch (e) {}
  }, []);
  useEffect(() => { try { localStorage.setItem('chat_theme_dark', String(themeDark)); } catch (e) {} }, [themeDark]);

  return (
    <div className={`chat-page ${themeDark ? 'dark' : ''}`}>
      <div className="sidebar">
        <ChatList userId={userId} onSelect={(id) => setSelectedChat(id)} />
      </div>
      <div className="chat-main">
        <ChatHeader model={selectedModel} onModelChange={setSelectedModel} themeDark={themeDark} toggleTheme={() => setThemeDark((t) => !t)} onClear={async () => {
          if (!selectedChat) return;
          try {
            await deleteChat({ variables: { chatId: selectedChat } });
            setSelectedChat(null);
          } catch (err) { console.error('Clear chat', err); }
        }} />
        
        <div className="token-summary">Tokens used: {tokenData?.getTokenSummary?.tokensUsed ?? 0}</div>
        <div className="chat-messages">
          <MessageList chatId={selectedChat} />
        </div>
        <div className="chat-input">
          <MessageInput chatId={selectedChat} userId={userId} model={selectedModel} />
        </div>
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => (
  <ApolloProvider client={client}>
    <ChatPageInner />
  </ApolloProvider>
);

export default ChatPage;
