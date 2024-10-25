import { createSlice } from '@reduxjs/toolkit'

const serverSlice = createSlice({
    name: "servers",
    initialState: [],
    reducers: {
        setServers(state, action) {
            return action.payload;
        },
        removeServer(state, action) {
            const index = state.findIndex((server) => server.id === action.payload.id);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        addServer(state, action) {
            const exists = state.some((server) => server.id === action.payload.id);
            if (!exists) {
                state.push(action.payload);
            }
        },
        updateServerDetails: (state, action) => {
            const index = state.findIndex((channel) => channel.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
    },
});

export const { setServers, removeServer, addServer, updateServerDetails } = serverSlice.actions;
export default serverSlice.reducer;