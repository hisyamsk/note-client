import { INotesResponse, IUsersResponse } from './response.interface';

type Roles = 'Employee' | 'Admin' | 'Manager';

export interface IUserCreate {
  username: string;
  password: string;
  roles: Roles[];
}

export interface IUserUpdate {
  id: IUsersResponse['id'];
  username: string;
  password?: string;
  roles: Roles[];
}

export interface IUserDelete {
  id: IUsersResponse['id'];
}

export interface INoteCreate {
  user: IUsersResponse['_id'];
  title: string;
  text: string;
  completed?: boolean;
}

export interface INoteUpdate extends INoteCreate {
  id: INotesResponse['id'];
}

export interface INoteDeleted {
  id: INotesResponse['id'];
}
