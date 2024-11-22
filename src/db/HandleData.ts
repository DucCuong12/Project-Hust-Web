import db from './config';
import { IpcMainInvokeEvent } from 'electron';
import { compare, genSalt, hash } from 'bcrypt-ts';
import { FieldPacket, QueryResult } from 'mysql2';
import { LoginPayload, SignupPayload } from '../interface/interface';
import { ChartData } from '../interface/class';

const saltRounds = 15;

export const queryUserByField = (field: string, value: string) => {
  const query = `SELECT * FROM users WHERE ${field} = ?`;
  return db.query(query, [value]);
};

export const insertUser = (userData: SignupPayload) => {
  const query =
    'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)';
  return genSalt(saltRounds)
    .then((salt) => hash(userData.password, salt))
    .then((hashedPassword) =>
      db.query(query, [
        userData.username,
        hashedPassword,
        userData.email,
        userData.name,
      ]),
    );
};

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
  // try {
  //   const query = 'SELECT * FROM users WHERE username = ?';
  //   db.query(query, [userData.username]).then((value: [QueryResult, FieldPacket[]]) => {
  //     if (!value[0][0]) {
  //       event.sender.send('signup-response', {
  //         success: false,
  //         message: 'Username already exists',
  //       });
  //     } else {
  //       const query = 'SELECT * FROM users WHERE email = ?';
  //       db
  //     }
  //   }
  //

  // try {
  //   const query =
  //     'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)';
  //   genSalt(saltRounds)
  //     .then((salt) => hash(userData.password, salt))
  //     .then((hashedPassword) => {
  //       db.query(query, [
  //         userData.username,
  //         hashedPassword,
  //         userData.email,
  //         userData.name,
  //       ])
  //         .then((value: [QueryResult, FieldPacket[]]) => {
  //           event.sender.send('signup-response', {
  //             success: true,
  //             message: 'Signup successful',
  //           });
  //         })
  //         .catch((value: [QueryResult, FieldPacket[]]) => {
  //           event.sender.send('signup-response', {
  //             success: false,
  //             message: value[0],
  //           });
  //         });
  //     });
  // } catch (error) {
  //   event.sender.send('signup-response', {
  //     success: false,
  //     message: 'Server error',
  //   });
  // }

  queryUserByField('username', userData.username)
    .then(([rows]) => {
      if (rows[0]) {
        throw new Error('Username already exists');
      }
      return queryUserByField('email', userData.email);
    })
    .then(([rows]) => {
      if (rows[0]) {
        throw new Error('Email already exists');
      }
      return insertUser(userData);
    })
    .then(() => {
      event.sender.send('signup-response', {
        success: true,
        message: 'Signup successful',
      });
    })
    .catch((error) => {
      const errorMessage = error.message || 'Server error';
      event.sender.send('signup-response', {
        success: false,
        message: errorMessage,
      });
    });
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

export const getResidentsData = async () => {
  const todayYear = new Date().getFullYear();
  try {
    const [result] = await db.query(
      'select	count(*) as totalResidents, count(case when birth_year > ? then 1 else null end) as totalChildren, count(case when (birth_year <= ? and birth_year > ?) then 1 else null end) as totalAdults, count(case when birth_year <= ? then 1 else null end) as totalElders, count(case when gender = ? then 1 else null end) as totalMale, count(case when gender = ? then 1 else null end) as totalFemale from db.residents',
      [
        todayYear - 18,
        todayYear - 18,
        todayYear - 50,
        todayYear - 50,
        'Nam',
        'Nữ',
      ],
    );
    const childrenData = new ChartData('0 - 18', result[0].totalChildren);
    const adultsData = new ChartData(
      '18 - 50',
      result[0].totalResidents - result[0].totalChildren,
    );
    const elderData = new ChartData('Trên 50', result[0].totalElders);
    const maleData = new ChartData('Nam', result[0].totalMale);
    const femaleData = new ChartData(
      'Nữ',
      result[0].totalResidents - result[0].totalMale,
    );
    return {
      ageCount: [childrenData, adultsData, elderData],
      genderCount: [maleData, femaleData],
    };
  } catch (err) {
    console.log(err);
  }
};
