import { notification as antdNotification } from 'antd';

export const notification = {
  error: (description: string) => {
    antdNotification.error({
      message: 'Error',
      description: description,
      showProgress: true,
      pauseOnHover: true,
    });
  },
  warning: (description: string) => {
    antdNotification.warning({
      message: 'Warning',
      description: description,
      showProgress: true,
      pauseOnHover: true,
    });
  },
  success: (description: string) => {
    antdNotification.success({
      message: 'Success',
      description: description,
      showProgress: true,
      pauseOnHover: true,
    });
  },
  info: (description: string) => {
    antdNotification.info({
      message: 'Info',
      description: description,
      showProgress: true,
      pauseOnHover: true,
    });
  },
};
