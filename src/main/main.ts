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
  getRequiredFeeData,
  getContributoryFeeData,
  addRequiredFee,
  editRequiredFee,
  deleteRequiredFee,
} from '../db/HandleData';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle(
  'login',
  async (
    event: IpcMainInvokeEvent,
    { username, password, admin }: LoginPayload,
    onAction,
  ) => {
    let query = admin
      ? 'SELECT password FROM admin WHERE username = ?'
      : 'SELECT password FROM users WHERE username = ?';
    const values = [username];
    try {
      db.query(query, values).then((value: [QueryResult, FieldPacket[]]) => {
        if (!value[0][0])
          event.sender.send('login-response', {
            success: false,
            message: 'User not found',
          });
        else {
          compare(password, value[0][0].password).then((result) => {
            if (result) {
              if (!admin) {
                event.sender.send('login-response', {
                  success: true,
                  message: 'Login successful',
                });
              } else {
                event.sender.send('login-response', {
                  success: true,
                  message: 'Admin successful',
                });
              }
            } else {
              event.sender.send('login-response', {
                success: false,
                message: 'Invalid credentials',
              });
            }
          });
        }
      });
    } catch (err: any) {
      console.log(err);
      event.sender.send('login-response', {
        success: false,
        message: 'Error occured!',
      });
    }
  },
);

ipcMain.handle(
  'signup',
  async (event: IpcMainInvokeEvent, userData: SignupPayload) => {
    try {
      const query =
        'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)';
      genSalt(saltRounds)
        .then((salt) => hash(userData.password, salt))
        .then((hashedPassword) => {
          db.query(query, [
            userData.username,
            hashedPassword,
            userData.email,
            userData.name,
          ])
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
        });
    } catch (error) {
      event.sender.send('signup-response', {
        success: false,
        message: 'Server error',
      });
    }
  },
);

ipcMain.handle('fetch-user', async (event: IpcMainInvokeEvent, id?: number) => {
  if (id) {
    try {
      const [rows] = await db.query(
        'SELECT name, username, email FROM users WHERE id = ?',
        [id],
      );
      return rows;
    } catch (error) {
      console.error('Error fetching users from database:', error);
      throw error;
    }
  } else {
    try {
      const [rows] = await db.query(
        'SELECT id, name, username, email FROM users',
      );
      return rows;
    } catch (error) {
      console.error('Error fetching users from database:', error);
      throw error;
    }
  }
});

ipcMain.handle('fetch-residents-list', async () => {
  try {
    const [rows] = await db.query('SELECT * FROM residents');
    return rows;
  } catch (err) {
    console.error('Error fetching residents:', err);
    throw err;
  }
});

// ipcMain.handle('fetch-required-fee', async () => {
//   try {
//     const [rows] = await db.query('SELECT * FROM fee');
//     return rows;
//   } catch (err) {
//     console.error('Error fetching residents:', err);
//     throw err;
//   }
// });

// ipcMain.handle('fetch-contribute-fee', async () => {
//   try {
//     const [rows] = await db.query('SELECT * FROM contribute_fee');
//     return rows;
//   } catch (err) {
//     console.error('Error fetching residents:', err);
//     throw err;
//   }
// });

ipcMain.handle(
  'edit-account',
  async (
    event: IpcMainInvokeEvent,
    formData: SignupPayload,
    userId: number,
  ) => {
    if (formData.password === '') {
      try {
        const query =
          'UPDATE users SET username = ?, name = ?, email = ? WHERE id = ?';
        const values = [
          formData.username,
          formData.name,
          formData.email,
          userId,
        ];
        db.query(query, values)
          .then((value: [QueryResult, FieldPacket[]]) => {
            event.sender.send('edit-response', {
              success: true,
              message: 'Edit successful',
            });
          })
          .catch(() => {
            event.sender.send('signup-response', {
              success: false,
              message: 'Edit failed!',
            });
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const query =
          'UPDATE users SET username = ?, password = ?, name = ?, email = ? WHERE id = ?';
        genSalt(saltRounds)
          .then((salt) => hash(formData.password, salt))
          .then((hashedPassword) => {
            const values = [
              formData.username,
              hashedPassword,
              formData.name,
              formData.email,
              userId,
            ];
            db.query(query, values)
              .then((value: [QueryResult, FieldPacket[]]) => {
                event.sender.send('edit-response', {
                  success: true,
                  message: 'Edit successful',
                });
              })
              .catch(() => {
                event.sender.send('signup-response', {
                  success: false,
                  message: 'Edit failed!',
                });
              });
          });
      } catch (err) {
        console.log(err);
      }
    }
  },
);

ipcMain.handle(
  'edit-fee',
  (
    event: IpcMainInvokeEvent,
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    const query =
      'UPDATE fee SET amount_money = ?, representator = ? WHERE room_number = ?;';
    const values = [amount_money, representator, room_number];

    try {
      db.query(query, values)
        .then((value: [QueryResult, FieldPacket[]]) => {
          event.sender.send('edit-response', {
            success: true,
            message: 'edit successful',
          });
        })
        .catch(() => {
          event.sender.send('add-response', {
            success: false,
            message: 'edit failed!',
          });
        });
      return 1;
    } catch (err) {
      console.log('Server error!');
      return 0;
    }
  },
);

ipcMain.handle(
  'add-submitted-fee',
  (
    event: IpcMainInvokeEvent,
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    const query =
      'UPDATE fee SET amount_money = ?, representator = ? WHERE room_number = ?;';
    const values = [amount_money, representator, room_number];

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

ipcMain.handle(
  'delete-compulsory-fee',
  (event: IpcMainInvokeEvent, room_number: number) => {
    const query = 'UPDATE fee SET amount_money = ? WHERE room_number = ?;';
    const values = [0, room_number];

    try {
      db.query(query, values)
        .then((value: [QueryResult, FieldPacket[]]) => {
          event.sender.send('delete-response', {
            success: true,
            message: 'Delete successful',
          });
        })
        .catch(() => {
          event.sender.send('delete-response', {
            success: false,
            message: 'Room number does not exist!',
          });
        });
      return 1;
    } catch (err) {
      console.log('Server error!');
      return 0;
    }
  },
);

ipcMain.handle(
  'edit-contribute-fee',
  (
    event: IpcMainInvokeEvent,
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    const query =
      'UPDATE contribute_fee SET amount_money = ?, representator = ? WHERE room_number = ?;';
    const values = [amount_money, representator, room_number];

    try {
      db.query(query, values)
        .then((value: [QueryResult, FieldPacket[]]) => {
          event.sender.send('edit-response', {
            success: true,
            message: 'edit successful',
          });
        })
        .catch(() => {
          event.sender.send('add-response', {
            success: false,
            message: 'edit failed!',
          });
        });
      return 1;
    } catch (err) {
      console.log('Server error!');
      return 0;
    }
  },
);

ipcMain.handle(
  'add-contribute-fee',
  (
    event: IpcMainInvokeEvent,
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    const query =
      'UPDATE contribute_fee SET amount_money = ?, representator = ? WHERE room_number = ?;';
    const values = [amount_money, representator, room_number];

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

ipcMain.handle(
  'delete-contribute-fee',
  (event: IpcMainInvokeEvent, room_number: number) => {
    const query =
      'UPDATE contribute_fee SET amount_money = ? WHERE room_number = ?;';
    const values = [0, room_number];

    try {
      db.query(query, values)
        .then((value: [QueryResult, FieldPacket[]]) => {
          event.sender.send('delete-response', {
            success: true,
            message: 'Delete successful',
          });
        })
        .catch(() => {
          event.sender.send('delete-response', {
            success: false,
            message: 'Room number does not exist!',
          });
        });
      return 1;
    } catch (err) {
      console.log('Server error!');
      return 0;
    }
  },
);

ipcMain.handle(
  'delete-account',
  (event: IpcMainInvokeEvent, userId: number) => {
    const query = 'DELETE FROM users WHERE id = ?';
    const values = [userId];
    try {
      db.query(query, values)
        .then((value: [QueryResult, FieldPacket[]]) => {
          event.sender.send('delete-response', {
            success: true,
            message: 'Delete successful',
          });
        })
        .catch(() => {
          event.sender.send('delete-response', {
            success: false,
            message: 'User not exists!',
          });
        });
    } catch (err) {
      console.log('Server error!');
    }
  },
);
// ipcMain.handle('login', loginRequest);
// ipcMain.handle('signup', signupRequest);
// ipcMain.handle('fetch-user', fetchUserRequest);
// ipcMain.handle('fetch-residents-list', fetchResidents);
// ipcMain.handle('edit-account', editAccount);
// ipcMain.handle('delete-account', deleteAccount);
ipcMain.handle('fetch-number-residents', getResidentsData);
ipcMain.handle('fetch-required-fee', getRequiredFeeData);
ipcMain.handle('add-required-fee', addRequiredFee);
ipcMain.handle('edit-required-fee', editRequiredFee);
ipcMain.handle('delete-required-fee', deleteRequiredFee);
ipcMain.handle('fetch-contribute-fee', getContributoryFeeData);

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
