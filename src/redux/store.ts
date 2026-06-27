"use client";
import { configureStore } from "@reduxjs/toolkit";
import agentReducer from "./features/agentSlice";
import reportIssuesReducer from "./features/reportIssuesSlice";

export const store = configureStore({
  reducer: {
    agents: agentReducer,
    reportIssues: reportIssuesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
