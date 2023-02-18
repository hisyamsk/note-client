import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { RootState } from '../../app/store';
import { IUsersResponse } from '../../interface/response.interface';

const usersAdapter = createEntityAdapter<IUsersResponse>();

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<IUsersResponse>, any>({
      query: () => ({
        url: '/users',
        method: 'GET',
        validateStatus(response) {
          return response.status === 200;
        },
      }),
      keepUnusedDataFor: 10,
      transformResponse: (responseData: IUsersResponse[]) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });

        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'Users', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Users' as const, id })),
          ];
        }
        return [{ type: 'Users', id: 'LIST' }];
      },
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select({});

// creates memoized selector
const selectUsersResponseData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors<RootState>(
  (state) => selectUsersResponseData(state) ?? initialState
);
