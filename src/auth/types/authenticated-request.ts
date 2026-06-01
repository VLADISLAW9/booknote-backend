import type { Request } from 'express';
import type { PublicUser } from '../../users/user.entity';

export interface AuthenticatedRequest extends Request {
  user?: PublicUser;
}
