import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { IErrorResponse } from '../interface/response.interface';

const ErrorMessage = ({
  isError,
  error,
}: {
  isError: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}): JSX.Element => {
  let message = '';
  if (isError && error) {
    if ('status' in error) {
      const errorData = error.data as IErrorResponse;
      const errMsg = 'error' in error ? error.error : errorData.message;

      message = errMsg;
    } else {
      message = error.message || '';
    }
  }

  const errClass = isError ? 'errmsg' : 'offscreen';
  return <p className={errClass}>{message}</p>;
};

export default ErrorMessage;
