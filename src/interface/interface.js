export interface IpcResponse {
  success: boolean;
  message: string;
}

export interface UserPayload {
  username: string;
  password: string;
}

export interface Transaction {
  room_number: number;
  amount_money: number;
  transferrer: string;
  phone_number: string;
}

export interface Resident {
  id: number;
  room_number: number;
  full_name: string;
  birth_year: number;
  occupation: string;
  phone_number: string;
  email: string;
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
export type HandleLoginState = {
  onAction: import("react").Dispatch<import("react").SetStateAction<boolean>>;
}
export interface ChartData {
  name: String;
  value: Number;
}
export interface DashboardData {
  ageCount: ChartData[];
  genderCount: ChartData[];
}