import { ElectronHandler } from '../main/preload';
import { IpcRendererEvent } from 'electron';
import {
  LoginPayload,
  SignupPayload,
  IpcResponse,
  User,
  Resident,
  Fee,
} from '../interface/interface';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    electronAPI: {
      signup: (userData: SignupPayload) => Promise<IpcResponse>;
      login: (userData: LoginPayload) => Promise<IpcResponse>;
      onMessage: (
        channel: String,
        callback: (event: IpcRendererEvent, data: IpcResponse) => void,
      ) => void;
      fetchResidentsList: () => Resident[];
      fetchRequiredFee: () => Fee[];
      fetchUser: (id?: number) => User[];
      editUserAccount: (formData: SignupPayload, userId: number) => void;
      deleteUserAccount: (userId: number) => void;
      deleteCompulsoryFee: (room_number: number) => number;
      addSubmittedFee: (room_number: number, amount_money: number, representator: string) => number;
      editFee: (room_number: number, amount_money: number, representator: string) => number;

      fetchContributeFee: () => Fee[];
      deleteContributeFee: (room_number: number) => number;
      addContributeFee: (room_number: number, amount_money: number, representator: string) => number;
      editContributeFee: (room_number: number, amount_money: number, representator: string) => number;
    };
  }
}

export {};
