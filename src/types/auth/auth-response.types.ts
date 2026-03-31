import type { User } from "../user/user.types";

export interface AuthResponse {
  user: User;
  accessToken: string;
}
