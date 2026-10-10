export type FacebookWebhookVerificationRequestDto = {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string;
};
