// store/channelSlice.js
import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
  name: "channels",
  initialState: [],
  reducers: {
    setChannels(state, action) {
      return action.payload;
    },
    removeChannel(state, action) {
      const index = state.findIndex((channel) => channel.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    addChannel(state, action) {
      state.push(action.payload);
    },
    updateChannelDetails(state, action) {
      const index = state.findIndex((channel) => channel.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { setChannels, removeChannel, addChannel, updateChannelDetails } = channelSlice.actions;
export default channelSlice.reducer;
