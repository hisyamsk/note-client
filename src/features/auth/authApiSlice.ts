import { apiSlice } from '../../app/api/apiSlice';
import { IAuthLoginReponse } from '../../interface/response.interface';
import { IAuthLoginRequest } from '../../interface/request.interface';
import { logOut, setCredentials } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthLoginReponse, IAuthLoginRequest>({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(apiSlice.util.resetApiState());
          localStorage.setItem('persist', 'false');
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation<IAuthLoginReponse, {}>({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
      async onQueryStarted(_, api) {
        try {
          const { data } = await api.queryFulfilled;
          const { accessToken } = data;
          api.dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useSendLogoutMutation } =
  authApiSlice;
