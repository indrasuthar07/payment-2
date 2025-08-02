import { configureStore } from '@reduxjs/toolkit';
import userSlice from './UserSlice';

const store = configureStore({
  reducer: {
    auth: userSlice,
  },
});

export default store;