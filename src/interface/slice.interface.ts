import { Roles } from './request.interface';

export interface IAuthInitialState {
  token: string;
}

export interface IAuthPayload {
  accessToken: string;
}

export interface ITokenDecode {
  UserInfo: {
    username: string;
    roles: Roles[];
  };
}

export interface IUseAuth {
  username: string;
  roles: Roles[];
  status: Roles;
  isManager: boolean;
  isAdmin: boolean;
}
