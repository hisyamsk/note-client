type Roles = 'Employee' | 'Admin' | 'Manager';

export interface IUserCreate {
  username: string;
  password: string;
  roles: Roles[];
}

export interface IUserUpdate {
  id: string;
  username: string;
  password?: string;
  roles: Roles[];
}

export interface IUserDelete {
  id: string;
}
