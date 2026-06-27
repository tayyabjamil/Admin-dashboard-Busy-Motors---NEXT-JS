"use client";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ReportIssue = {
  _id: string;
  name: string;
  email: string;
  description: string;
  created_at: string;
  __v: number;
};

interface ReportIssuesState {
  allIssues: ReportIssue[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportIssuesState = {
  allIssues: [],
  loading: false,
  error: null,
};

const reportIssuesSlice = createSlice({
  name: "reportIssues",
  initialState,
  reducers: {
    fetchIssuesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchIssuesSuccess(state, action: PayloadAction<ReportIssue[]>) {
      state.loading = false;
      state.allIssues = action.payload;
    },
    fetchIssuesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchIssuesStart, fetchIssuesSuccess, fetchIssuesFailure } =
  reportIssuesSlice.actions;

export default reportIssuesSlice.reducer;
