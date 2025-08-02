import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SetUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    SetLoading(state, action) {
      state.loading = action.payload;
    },
    SetError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    ClearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    }
  }
});

export const {SetUser, SetLoading, SetError, ClearUser} = userSlice.actions;
export default userSlice.reducer;