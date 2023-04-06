import { Roles } from '../interface/request.interface';

interface IRoles {
  Employee: Roles;
  Admin: Roles;
  Manager: Roles;
}

export const ROLES: IRoles = {
  Employee: 'Employee',
  Admin: 'Admin',
  Manager: 'Manager',
};
export const USER_REGEX = /^[A-z]{3,20}$/;
export const PW_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
