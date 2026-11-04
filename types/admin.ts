export type Admin = {
  id: string;
  name: string;
  email: string;
  subject: string;
  verified: boolean;
};

export type AdminAuthResponse = {
  success: boolean;
  message?: string;
  token: string;
  admin: Admin;
};
