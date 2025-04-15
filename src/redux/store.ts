"use client";
import { configureStore } from "@reduxjs/toolkit";
import agentReducer from "./features/agentSlice";

export const store = configureStore({
  reducer: {
    agents: agentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
