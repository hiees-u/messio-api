import { Request } from 'express';

import { PayloadTokenInput } from './payload.token.dto';

export interface RequestWithUser extends Request {
  user: PayloadTokenInput;
}
