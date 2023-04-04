import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';
import { IAuthPayload } from '../../interface/slice.interface';
import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  credentials: 'include',
  prepareHeaders(headers, api) {
    const token = (api.getState() as RootState).auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 403) {
    console.log('sending refresh token..');
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    const refreshResultData = refreshResult.data as IAuthPayload;

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResultData));

      result = await baseQuery(args, api, extraOptions);
      return result;
    }

    if (refreshResult.error?.status === 403) {
      refreshResult.error.data = {
        message: 'expired access and refresh token',
      };
    } else if (refreshResult.error?.status === 401) {
      refreshResult.error.data = {
        message: 'No refresh token sent',
      };
    }

    return refreshResult;
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Notes', 'Users'],
  endpoints: (builder) => ({}),
});
