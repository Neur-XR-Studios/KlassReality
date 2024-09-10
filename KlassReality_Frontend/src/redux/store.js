import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/counter/authSlice";
import applicationReducer from "./features/counter/applicationSlice";
import adminSlice from "./features/counter/adminSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    application: applicationReducer,
    admin: adminSlice,
  },
});
