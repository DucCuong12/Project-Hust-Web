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
  ipcRenderer,
  IpcMainEvent,
  IpcMainInvokeEvent,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import bcrypt from 'bcrypt';
// import 'dotenv/config';
// import mysql from 'mysql2/promise';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import db from '../db/config';
import { FieldPacket, QueryResult } from 'mysql2';

const saltRounds = 15;

interface UserPayload {
  username: string;
  password: string;
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

db.connect();

ipcMain.handle(
  'login',
  async (event: IpcMainInvokeEvent, { username, password }: UserPayload) => {
    const query = 'SELECT password FROM users WHERE username = ?';
    const values = [username];
    // db.query('select * from users', (err: Error, res: any, fields: any) => {
    //   if (err) throw err;
    //   else console.log('Success!');
    // });

    try {
      db.query(query, values).then((value: [QueryResult, FieldPacket[]]) => {
        if (!value[0])
          event.sender.send('login-response', {
            success: false,
            message: 'User not found',
          });
        else {
          if (value[0][0][0] == password) {
            event.sender.send('login-response', {
              success: true,
              message: 'Login successful',
            });
          } else {
            event.sender.send('login-response', {
              success: false,
              message: 'Invalid credentials',
            });
          }

          bcrypt.compare(password, value[0][0][0], (err, isMatch) => {
            if (err) {
              event.sender.send('login-response', {
                success: false,
                message: 'Server error',
              });
            } else if (!isMatch) {
              event.sender.send('login-response', {
                success: false,
                message: 'Invalid credentials',
              });
            } else {
              event.sender.send('login-response', {
                success: true,
                message: 'Login successful',
              });
            }
          });
        }
      });
    } catch (err: any) {
      console.log(err);
    }
  },
);

ipcMain.handle(
  'signup',
  async (event: IpcMainInvokeEvent, userData: UserPayload) => {
    bcrypt.hash(userData.password, saltRounds).then((hash) => {
      try {
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        const values = [userData.username, hash];
        // db.query(query, [userData.username, hashedPassword], (err) => {
        //   if (err) {
        //     return { success: false, message: 'User already exists' };
        //   }
        //   return { success: true, message: 'User registered' };
        // });
        db.query(query, values)
          .then((value: [QueryResult, FieldPacket[]]) => {
            event.sender.send('signup-response', {
              success: true,
              message: 'Signup successful',
            });
          })
          .catch(() => {
            event.sender.send('signup-response', {
              success: false,
              message: 'User already exists!',
            });
          });
      } catch (error) {
        event.sender.send('signup-response', {
          success: false,
          message: 'Server error',
        });
      }
    });
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

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

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
