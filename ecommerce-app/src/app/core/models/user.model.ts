// src/app/core/models/user.model.ts
export interface User {
  name: string;
  email: string;
  password?: string;
  role: string;
  phone?: string;
  birthDate?: string;
  corporate?: boolean;
}
