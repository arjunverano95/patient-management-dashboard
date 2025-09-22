'use client';

import React, {createContext, useContext} from 'react';
import {message as antdMessage} from 'antd';
import {setGlobalMessageApi} from '@/lib/message';

type MessageContextType = ReturnType<typeof antdMessage.useMessage>;

const MessageContext = createContext<MessageContextType | null>(null);

/**
 * Hook to access message API
 * @throws Error if used outside MessageProvider
 */
export const useMessageApi = () => {
  const ctx = useContext(MessageContext);
  if (!ctx)
    throw new Error('useMessageApi must be used within MessageProvider');
  return ctx[0];
};

const MessageProvider = ({children}: {children: React.ReactNode}) => {
  const messageInstance = antdMessage.useMessage();

  setGlobalMessageApi(messageInstance[0]);

  return (
    <MessageContext.Provider value={messageInstance}>
      {messageInstance[1] /* contextHolder */}
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
