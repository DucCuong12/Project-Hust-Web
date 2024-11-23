// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  UserPayload,
  IpcResponse,
  SignupPayload,
} from '../interface/interface';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

contextBridge.exposeInMainWorld('electronAPI', {
  // Register user
  signup: (userData: UserPayload): Promise<IpcResponse> => {
    return ipcRenderer.invoke('signup', userData);
  },

  // Login user
  login: (userData: UserPayload): Promise<IpcResponse> => {
    return ipcRenderer.invoke('login', userData);
  },

  onMessage: (
    channel: string,
    callback: (event: IpcRendererEvent, data: IpcResponse) => void,
  ) => {
    const validChannels = [
      'signup-response',
      'login-response',
      'edit-response',
      'delete-user-response',
    ]; // Add valid channels
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, callback);
    }
  },

  fetchUser: (id?: number) => {
    return ipcRenderer.invoke('fetch-user', id);
  },

  editUserAccount: (formData: SignupPayload, userId: number) => {
    return ipcRenderer.invoke('edit-account', formData, userId);
  },

  deleteUserAccount: (userId: number) => {
    return ipcRenderer.invoke('delete-account', userId);
  },

  fetchResidentsList: () => {
    return ipcRenderer.invoke('fetch-residents-list');
  },

  fetchRequiredFee: () => {
    return ipcRenderer.invoke('fetch-required-fee');
  },

  deleteCompulsoryFee: (room_number: number) => {
    return ipcRenderer.invoke('delete-compulsory-fee', room_number);
  },

  addSubmittedFee: (
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    return ipcRenderer.invoke(
      'add-submitted-fee',
      room_number,
      amount_money,
      representator,
    );
  },

  editFee: (
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    return ipcRenderer.invoke(
      'edit-fee',
      room_number,
      amount_money,
      representator,
    );
  },

  fetchContributeFee: () => {
    return ipcRenderer.invoke('fetch-contribute-fee');
  },

  deleteContributeFee: (room_number: number) => {
    return ipcRenderer.invoke('delete-contribute-fee', room_number);
  },

  addContributeFee: (
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    return ipcRenderer.invoke(
      'add-contribute-fee',
      room_number,
      amount_money,
      representator,
    );
  },

  editContributeFee: (
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    return ipcRenderer.invoke(
      'edit-contribute-fee',
      room_number,
      amount_money,
      representator,
    );
  },

  fetchResidentsData: () => {
    return ipcRenderer.invoke('fetch-number-residents');
  },
});

export type ElectronHandler = typeof electronHandler;
