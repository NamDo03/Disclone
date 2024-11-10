import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filter",
    initialState: {
        filterBadWords: localStorage.getItem("filterBadWords") === "true" ? true : true,
    },
    reducers: {
        toggleFilterBadWords: (state) => {
            state.filterBadWords = !state.filterBadWords;
            localStorage.setItem("filterBadWords", state.filterBadWords);
        },
    },
});

export const { toggleFilterBadWords } = filterSlice.actions;
export default filterSlice.reducer;
