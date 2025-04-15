"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AgentState {
  totalAgents: number;
  subscribedAgents: number;
  loading: boolean;
  error: string | null;
}

const initialState: AgentState = {
  totalAgents: 0,
  subscribedAgents: 0,
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    fetchAgentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAgentsSuccess(
      state,
      action: PayloadAction<{ totalAgents: number; subscribedAgents: number }>
    ) {
      state.loading = false;
      state.totalAgents = action.payload.totalAgents;
      state.subscribedAgents = action.payload.subscribedAgents;
    },
    fetchAgentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAgentsStart, fetchAgentsSuccess, fetchAgentsFailure } =
  agentSlice.actions;
export default agentSlice.reducer;
