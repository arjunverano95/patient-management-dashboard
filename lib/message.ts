import {message as messageAntd} from 'antd';

type MessageApiType = ReturnType<typeof messageAntd.useMessage>[0];

let messageApi: MessageApiType | null = null;

/**
 * Sets the global message API instance
 */
export const setGlobalMessageApi = (api: MessageApiType) => {
  messageApi = api;
};

/**
 * Global message utility for showing notifications
 */
export const message = {
  success: (content: string) => messageApi?.success({content}),
  error: (content: string) => messageApi?.error({content}),
  info: (content: string) => messageApi?.info({content}),
  warning: (content: string) => messageApi?.warning({content}),
  loading: (content: string) => messageApi?.loading({content}),
  open: (args: Parameters<MessageApiType['open']>[0]) => messageApi?.open(args),
};
