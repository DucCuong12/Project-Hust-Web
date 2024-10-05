import { ElectronHandler } from '../main/preload';
import { IpcRendererEvent } from 'electron';
import {
  LoginPayload,
  SignupPayload,
  IpcResponse,
  User,
  Resident,
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
<<<<<<< HEAD
      fetchUser: () => User[];
      fetchResidentsList: () => Resident[];
=======
      fetchUser: (id?: number) => User[];
      editUserAccount: (formData: SignupPayload, userId: number) => void;
      deleteUserAccount: (userId: number) => void;
>>>>>>> 2e10c902d660fa456b8dfaa569827c6f0f8771f8
    };
  }
}

export {};
