type UpsertFacebookUserInput = {
  facebookId: string;
  name: string;
  email?: string;

  token: string;
  expiresAt: Date;

  url: string;
  height: number;
  width: number;
  isSilhouette: boolean;
};

export { type UpsertFacebookUserInput };
