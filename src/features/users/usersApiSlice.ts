import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { RootState } from '../../app/store';
import {
  IUserCreate,
  IUserUpdate,
  IUserDelete,
} from '../../interface/request.interface';
import {
  IDocumentDeleted,
  IUsersResponse,
} from '../../interface/response.interface';

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
    addNewUser: builder.mutation<IUsersResponse, IUserCreate>({
      query: (arg) => ({
        url: '/notes',
        method: 'POST',
        body: { ...arg },
      }),
      invalidatesTags: [{ type: 'Users', id: 'List' }],
    }),
    updateUser: builder.mutation<IUsersResponse, IUserUpdate>({
      query: (arg) => ({
        url: '/notes',
        method: 'PATCH',
        body: { ...arg },
      }),
      invalidatesTags: (_, __, arg) => [{ type: 'Users', id: arg.id }],
    }),
    deleteUser: builder.mutation<IDocumentDeleted, IUserDelete>({
      query: ({ id }) => ({
        url: '/notes',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (_, __, arg) => [{ type: 'Users', id: arg.id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

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
