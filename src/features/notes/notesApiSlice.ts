import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { RootState } from '../../app/store';
import {
  INoteCreate,
  INoteDeleted,
  INoteUpdate,
} from '../../interface/request.interface';
import {
  IDocumentDeleted,
  INotesResponse,
} from '../../interface/response.interface';

const notesAdapter = createEntityAdapter<INotesResponse>({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<EntityState<INotesResponse>, any>({
      query: () => ({
        url: '/api/notes',
        method: 'GET',
        validateStatus(response) {
          return response.status === 200;
        },
      }),
      transformResponse: (responseData: INotesResponse[]) => {
        console.log(responseData, 'RESPONSE DATA');
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });

        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'Notes', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Notes' as const, id })),
          ];
        }
        return [{ type: 'Notes', id: 'LIST' }];
      },
    }),
    addNewNote: builder.mutation<INotesResponse, INoteCreate>({
      query: (arg) => ({
        url: '/api/notes',
        method: 'POST',
        body: { ...arg },
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateNote: builder.mutation<INotesResponse, INoteUpdate>({
      query: (arg) => ({
        url: '/api/notes',
        method: 'PATCH',
        body: { ...arg },
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    deleteNote: builder.mutation<IDocumentDeleted, INoteDeleted>({
      query: ({ id }) => ({
        url: '/api/notes',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

export const selectNotesResult = notesApiSlice.endpoints.getNotes.select({});

const selectNotesResponseData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data
);

export const {
  selectAll: selectAllNotes,
  selectIds: selectNotesIds,
  selectById: selectNoteById,
} = notesAdapter.getSelectors<RootState>(
  (state) => selectNotesResponseData(state) ?? initialState
);
