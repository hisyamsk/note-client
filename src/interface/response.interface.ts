type Roles = 'Employee' | 'Admin' | 'Manager';

export interface IUsersResponse {
  id?: string;
  _id: string;
  username: string;
  roles: Roles[];
  active: boolean;
}
