export type Role = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SELLER';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: Role;
  userStatus?: 'ACTIVE' | 'BANNED';
  corporate?: string;
  createdAt?: string;
  updatedAt?: string;
}
