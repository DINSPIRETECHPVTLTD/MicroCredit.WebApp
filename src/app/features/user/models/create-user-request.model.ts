import { UpdateUserRequest } from './update-user-request.model';

/** Request payload for creating a user (POST). Extends update payload with password. */
export interface CreateUserRequest extends UpdateUserRequest {
  password: string;
}
