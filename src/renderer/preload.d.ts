import { ElectronHandler } from '../main/preload';
import { IpcRendererEvent } from 'electron';
import { LoginPayload, SignupPayload } from '../interface/interface';

interface IpcResponse {
  success: boolean;
  message: string;
}

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
    };
  }
}

export {};
