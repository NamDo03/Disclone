import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload
        },
        loginFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        logout: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        updateUsername: (state, action) => {
            if (state.currentUser) {
                state.currentUser.username = action.payload;
            }
        },
        updateAvatarUrl: (state, action) => {
            if (state.currentUser) {
                state.currentUser.avatar_url = action.payload;
            }
        }
    },
})

export const { loginStart, loginSuccess, loginFailure, logout, updateUsername, updateAvatarUrl } = userSlice.actions

export default userSlice.reducer