import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null
};

export const userSlice = createSlice({
    name: "user",
    initialState: initialState, // Use the whole object
    reducers: {
        addUser: (state, action) => {
            state.currentUser = action.payload;
        },
        deleteUser: (state) => {
            state.currentUser = null;
        }
    }
});

export const { addUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;