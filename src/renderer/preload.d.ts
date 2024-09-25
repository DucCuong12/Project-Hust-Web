import { ElectronHandler } from '../main/preload';
import { IpcRendererEvent } from 'electron';

interface UserPayload {
  username: string;
  password: string;
}

interface IpcResponse {
  success: boolean;
  message: string;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    electronAPI: {
      signup: (userData: UserPayload) => Promise<IpcResponse>;
      login: (userData: UserPayload) => Promise<IpcResponse>;
      onMessage: (
        channel: String,
        callback: (event: IpcRendererEvent, data: IpcResponse) => void,
      ) => void;
    };
  }
}

export {};
