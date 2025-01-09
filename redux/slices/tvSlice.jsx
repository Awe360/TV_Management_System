import { createSlice } from "@reduxjs/toolkit";

const initialState={
    totTV:0,
}
const tvSlice=createSlice({
name:'tvSlice',
initialState,
reducers:{
    setTvCount:(state,action)=>{
        state.totTV=action.payload;
    },
}
})
export const {setTvCount}=tvSlice.actions;
export default  tvSlice.reducer;