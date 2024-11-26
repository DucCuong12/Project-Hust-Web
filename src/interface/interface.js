export interface IpcResponse {
  success: boolean;
  message: string;
}

export interface UserPayload {
  username: string;
  password: string;
}

export type UnitOptions =  'month' | 'item' | 'time' | 'person' | 'kWh' | 'number';

export interface RequiredFee {
  id: number;
  name: String;
  unit_price: number;
  unit: UnitOptions
}

export interface ContributeFee { 
  id: number;
  name: String;
  total: number;
}

export interface Fee = RequiredFee | ContributeFee;

export interface TransferFee {
  room_number: number;
  money: number;
  fee_name: String;
  transferer: String;
  fee_type: String;
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
  handleDelete: (id: number) => void;
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