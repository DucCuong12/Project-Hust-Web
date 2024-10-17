import db from './config';
import { LoginPayload, SignupPayload } from '../interface/interface';
import { IpcMainInvokeEvent } from 'electron';
import { compare, genSalt, hash } from 'bcrypt-ts';
import { FieldPacket, QueryResult } from 'mysql2';

const saltRounds = 15;

export const loginRequest = async (
  event: IpcMainInvokeEvent,
  { username, password, admin }: LoginPayload,
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
};

export const signupRequest = async (
  event: IpcMainInvokeEvent,
  userData: SignupPayload,
) => {
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
};

export const fetchUserRequest = async (
  event: IpcMainInvokeEvent,
  id?: number,
) => {
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
};

export const fetchResidents = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM residents');
    console.log(rows);
    return rows;
  } catch (err) {
    console.error('Error fetching residents:', err);
    throw err;
  }
};

export const editAccount = async (
  event: IpcMainInvokeEvent,
  formData: SignupPayload,
  userId: number,
) => {
  if (formData.password === '') {
    try {
      const query =
        'UPDATE users SET username = ?, name = ?, email = ? WHERE id = ?';
      const values = [formData.username, formData.name, formData.email, userId];
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
};

export const deleteAccount = (event: IpcMainInvokeEvent, userId: number) => {
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
};

export const getTotalResidents = () => {
  // try {
  //   const query = 'SELECT * FROM db.residents';
  //   db.query(query).then((value) => {
  //     console.log(value);
  //   });
  // } catch {
  //   console.log('Cannot connect to database!');
  // }
  return 'Completed!';
};
