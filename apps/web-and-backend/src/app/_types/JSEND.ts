export type JSENDSuccess<T> = {
  status: 'success';
  data: T;
};

export type JSENDFailure = {
  status: 'fail';
  data: {
    [key: string]: string;
  };
};

export type JSENDError = {
  status: 'error';
  message: string;
  code?: number;
  data?: {
    [key: string]: string;
  };
};

export type JSENDResponse<T> = JSENDSuccess<T> | JSENDFailure | JSENDError;
