"use client";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  _id: string;
  profile_image: string;
  favorites: string[];
  active_devices: string[];
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  is_subscribed: string;
  is_blocked: boolean;
  date_created: string;
  date_updated: string;
  login_attempts: Array<{
    timestamp: string;
    deviceId: string;
    _id: string;
  }>;
  __v: number;
};

interface AgentState {
  totalAgents: number;
  subscribedAgents: number;
  allUsers: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  subscriptionFilter: string;
  selectedMonth: string;
  selectedDay: string;
}

const initialState: AgentState = {
  totalAgents: 0,
  subscribedAgents: 0,
  allUsers: [],
  filteredUsers: [],
  loading: false,
  error: null,
  subscriptionFilter: "all",
  selectedMonth: "JAN",
  selectedDay: "MON",
};

interface FetchAgentsSuccessPayload {
  totalAgents: number;
  subscribedAgents: number;
  allUsers: User[];
}

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
      action: PayloadAction<FetchAgentsSuccessPayload>
    ) {
      state.loading = false;
      state.totalAgents = action.payload.totalAgents;
      state.subscribedAgents = action.payload.subscribedAgents;
      state.allUsers = action.payload.allUsers;

      // Apply current filter to the new data
      if (state.subscriptionFilter === "all") {
        state.filteredUsers = action.payload.allUsers;
      } else {
        state.filteredUsers = action.payload.allUsers.filter(
          (user) => user.is_subscribed === state.subscriptionFilter
        );
      }
    },
    fetchAgentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setSubscriptionFilter(state, action: PayloadAction<string>) {
      state.subscriptionFilter = action.payload;

      // Apply the filter
      if (action.payload === "all") {
        state.filteredUsers = state.allUsers;
      } else {
        state.filteredUsers = state.allUsers.filter(
          (user) => user.is_subscribed === action.payload
        );
      }

      // Recalculate subscribed agents based on filter
      if (action.payload === "all") {
        state.subscribedAgents = state.allUsers.filter(
          (user) => user.is_subscribed !== "None"
        ).length;
      } else {
        state.subscribedAgents = state.filteredUsers.length;
      }
    },
    setSelectedMonth(state, action: PayloadAction<string>) {
      state.selectedMonth = action.payload;
    },
    setSelectedDay(state, action: PayloadAction<string>) {
      state.selectedDay = action.payload;
    },
  },
});

export const {
  fetchAgentsStart,
  fetchAgentsSuccess,
  fetchAgentsFailure,
  setSubscriptionFilter,
  setSelectedMonth,
  setSelectedDay,
} = agentSlice.actions;

export default agentSlice.reducer;
