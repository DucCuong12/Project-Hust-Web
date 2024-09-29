export interface IpcResponse {
  success: boolean;
  message: string;
}

export interface UserPayload {
  username: string;
  password: string;
}

export interface LoginPayload extends UserPayload {
  admin: boolean;
}

export interface SignupPayload extends UserPayload {
  email: string;
  name: String;
}

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type ViewAccountProps = {
  users: User[];
  onAccountModified: () => void;
};

export type CreateAccountProps = {
  onAccountCreated: () => void;
};

export type EditUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};
