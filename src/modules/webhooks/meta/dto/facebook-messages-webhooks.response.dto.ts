type FacebookMessageWebhookResponse = {
  object: string;
  entry: [
    {
      time: number;
      id: string;
      messaging: {
        sender: {
          id: string;
        };
        recipient: {
          id: string;
        };
        timestamp: number;
        message: {
          mid: string;
          text?: MessageString;
          attachments?: MessagesAttachment[];
        };
      }[];
    },
  ];
};

type MessageString = string;

type MessagesAttachment = {
  type: 'image';
  payload: {
    url: string;
  };
};

export type { FacebookMessageWebhookResponse };
