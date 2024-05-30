import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userInterface } from "../types/types";

const initialState: userInterface = {
  darkLightToggle: "dark",
  menuIndex: -1,
  searchModalTrigger: false,
  loadingStatus: {
    newsLoading: false,
    youtubeLoading: false,
    instaLoading: false,
    xLoading: false,
  },
};

const userInterfaceSlice = createSlice({
  name: "interface",
  initialState,
  reducers: {
    setDarkLight(state, action: PayloadAction<string>) {
      state.darkLightToggle = action.payload;
    },
    setMenuIndex(state, action: PayloadAction<number>) {
      state.menuIndex = action.payload;
    },
    setSearchModalTrigger(state, action: PayloadAction<boolean>) {
      state.searchModalTrigger = action.payload;
    },
    setNewsLoading(state, action: PayloadAction<boolean>) {
      state.loadingStatus.newsLoading = action.payload;
    },
    setYoutubeLoading(state, action: PayloadAction<boolean>) {
      state.loadingStatus.youtubeLoading = action.payload;
    },
    setInstaLoading(state, action: PayloadAction<boolean>) {
      state.loadingStatus.instaLoading = action.payload;
    },
    setXLoading(state, action: PayloadAction<boolean>) {
      state.loadingStatus.xLoading = action.payload;
    },
  },
});

export const {
  setDarkLight,
  setMenuIndex,
  setSearchModalTrigger,
  setNewsLoading,
  setYoutubeLoading,
  setInstaLoading,
  setXLoading,
} = userInterfaceSlice.actions;
export default userInterfaceSlice.reducer;
