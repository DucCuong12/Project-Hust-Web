/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  globalShortcut,
  IpcMainInvokeEvent,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { genSalt, hash, compare } from 'bcrypt-ts';
import { resolveHtmlPath } from './util';
import db from '../db/config';
import { FieldPacket, QueryResult } from 'mysql2';
import { LoginPayload, SignupPayload, Fee } from '../interface/interface';

const saltRounds = 15;
import {
  loginRequest,
  signupRequest,
  fetchUserRequest,
  fetchResidents,
  editAccount,
  deleteAccount,
  getResidentsData,
  fetchRequiredFee,
  fetchContributeFee,
  editFee,
  addSubmittedFee,
  deleteCompulsoryFee,
  editContributeFee,
  addContributeFee,
  deleteContributeFee,
} from '../db/HandleData';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('login', loginRequest);

ipcMain.handle('signup', signupRequest);

ipcMain.handle('fetch-user', fetchUserRequest);

ipcMain.handle('fetch-residents-list', fetchResidents);

ipcMain.handle('edit-account', editAccount);

ipcMain.handle('delete-account', deleteAccount);

ipcMain.handle('fetch-number-residents', getResidentsData);

ipcMain.handle('fetch-required-fee', fetchRequiredFee);

ipcMain.handle('fetch-contribute-fee', fetchContributeFee);

ipcMain.handle('edit-fee', editFee);

ipcMain.handle('add-submitted-fee', addSubmittedFee);

ipcMain.handle('delete-compulsory-fee', deleteCompulsoryFee);

ipcMain.handle('edit-contribute-fee', editContributeFee);

ipcMain.handle('add-contribute-fee', addContributeFee);

ipcMain.handle('delete-contribute-fee', deleteContributeFee);

ipcMain.handle('fetch-transfer-fee', async () => {
  try {
    const [rows] = await db.query('SELECT * FROM transfer_fee');
    return rows;
  } catch (err) {
    console.error('Error fetching transfer_fee:', err);
    throw err;
  }
});

ipcMain.handle(
  'add-transfer-fee',
  (
    event: IpcMainInvokeEvent,
    room_number: number,
    money: number,
    fee_name: string,
    transferer: string,
    fee_type: string,
  ) => {
    const query = 'insert into transfer_fee values (?, ?, ?, ?, ?);';
    const values = [room_number, money, fee_name, transferer, fee_type];

    try {
      db.query(query, values)
        .then((value: [QueryResult, FieldPacket[]]) => {
          event.sender.send('add-response', {
            success: true,
            message: 'add successful',
          });
        })
        .catch(() => {
          event.sender.send('add-response', {
            success: false,
            message: 'add failed!',
          });
        });
      return 1;
    } catch (err) {
      console.log('Server error!');
      return 0;
    }
  },
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
    },
    fullscreenable: true,
  });

  mainWindow.removeMenu();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
app.on('browser-window-focus', function () {
  globalShortcut.register('CommandOrControl+R', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled');
  });
  globalShortcut.register('F5', () => {
    console.log('F5 is pressed: Shortcut Disabled');
  });
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
