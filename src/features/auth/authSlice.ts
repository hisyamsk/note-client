import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  IAuthInitialState,
  IAuthPayload,
} from '../../interface/slice.interface';

const initialState: IAuthInitialState = { token: '' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IAuthPayload>) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logOut: (state) => {
      state.token = '';
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
