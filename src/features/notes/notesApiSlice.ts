import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { RootState } from '../../app/store';
import { INotesResponse } from '../../interface/response.interface';

const notesAdapter = createEntityAdapter<INotesResponse>({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<EntityState<INotesResponse>, any>({
      query: () => ({
        url: '/notes',
        method: 'GET',
        validateStatus(response) {
          return response.status === 200;
        },
      }),
      keepUnusedDataFor: 10,
      transformResponse: (responseData: INotesResponse[]) => {
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
  }),
});

export const { useGetNotesQuery } = notesApiSlice;

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
