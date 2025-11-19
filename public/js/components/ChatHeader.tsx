/// <reference types="react" />
import React from 'react';

export const ChatHeader: React.FC<{ model: string; onModelChange: (m: string) => void; themeDark: boolean; toggleTheme: () => void; onClear?: () => void }> = ({ model, onModelChange, themeDark, toggleTheme, onClear }) => {
  return (
    <div className="chat-header">
      <div className="left"><strong>AI Chat</strong></div>
      <div className="actions">
        <select className="model-selector" value={model} onChange={(e) => onModelChange(e.target.value)}>
          <option value="gpt-3.5-turbo">gpt-3.5 (OpenAI)</option>
          <option value="gemini-pro">Gemini Pro (Google)</option>
          <option value="gemini-ultra">Gemini Ultra (Google)</option>
        </select>
        <div className="model-desc">Model: {model}</div>
        <button className="theme-toggle" onClick={() => toggleTheme()}>{themeDark ? '🌙 Dark' : '☀️ Light'}</button>
        {onClear && <button className="theme-toggle" onClick={() => onClear()} title="Clear this chat">Clear</button>}
      </div>
    </div>
  );
};

export default ChatHeader;
