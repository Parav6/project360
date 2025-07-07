import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentProducts: null
};

export const productSlice = createSlice({
    name: "products",
    initialState: initialState, // Use the whole object
    reducers: {
        addProducts: (state, action) => {
            state.currentProducts = action.payload;
        },
        deleteProducts: (state) => {
            state.currentProducts = null;
        },
        getSpecificProduct: (state, action) => {
            const productId = action.payload;
            if (state.currentProducts) {
                const product = state.currentProducts.find((product) => product._id === productId);
                return product ? product : null; 
            }
    }
}});

export const { addProducts,deleteProducts,getSpecificProduct} = productSlice.actions;

export default productSlice.reducer;