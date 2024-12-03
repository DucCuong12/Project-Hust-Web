import { ElectronHandler } from '../main/preload';
import { IpcRendererEvent } from 'electron';
import {
  LoginPayload,
  SignupPayload,
  IpcResponse,
  User,
  Resident,
  DashboardData,
  RequiredFee,
  ContributeFee,
} from '../interface/interface';
import { deleteRequiredFee } from '../db/HandleData';

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
      fetchUser: (id?: number) => User[];
      editUserAccount: (formData: SignupPayload, userId: number) => void;
      deleteUserAccount: (userId: number) => void;
      fetchRequiredFee: () => RequiredFee[];
      addRequiredFee: (feeData: RequiredFee) => void;
      editRequiredFee: (feeData: RequiredFee, editId: number) => void;
      deleteRequiredFee: (feeId: number) => void;
      queryRequiredFee: (query: string) => RequiredFee[];
      addSubmittedFee: (
        room_number: number,
        amount_money: number,
        representator: string,
      ) => number;
      editFee: (
        room_number: number,
        amount_money: number,
        representator: string,
      ) => number;

      fetchContributeFee: () => ContributeFee[];
      addContributeFee: (feeData: ContributeFee) => void;
      editContributeFee: (feeData: ContributeFee, editId: number) => void;
      deleteContributeFee: (feeId: number) => void;
      queryContributeFee: (query: string) => ContributeFee[];
      fetchResidentsData: () => DashboardData;
    };
  }
}

export {};
