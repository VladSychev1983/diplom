import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    isAuthenticated: false,
}

export const userReducer = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userData = action.payload;
            state.isAuthenticated = true;
        },
        logoutUser: (state) => {
            state.userData = null;
            state.isAuthenticated = null;
        },
    },
});

export const { setUser, logoutUser} = userReducer.actions;
export default userReducer.reducer