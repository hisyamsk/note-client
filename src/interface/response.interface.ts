type Roles = 'Employee' | 'Admin' | 'Manager';

export interface IUsersResponse {
  id?: string;
  _id: string;
  username: string;
  roles: Roles[];
  active: boolean;
}

export interface INotesResponse {
  id?: string;
  _id: string;
  user: {
    _id: IUsersResponse['_id'];
    username: IUsersResponse['username'];
  };
  text: string;
  title: string;
  completed: boolean;
}