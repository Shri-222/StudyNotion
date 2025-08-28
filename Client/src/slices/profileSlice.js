import {createSlice} from "@reduxjs/toolkit"

    let user = null;
    try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
        user = JSON.parse(storedUser);
    }
    } catch (e) {
    console.error("Failed to parse user from localStorage:", e);
    }

const initialState = {
    user: user, // Use the parsed user or null if parsing fails
    // user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
};

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
          },
    },
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;