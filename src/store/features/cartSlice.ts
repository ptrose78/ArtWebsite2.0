// src/store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: any[];
  totalPrice: number;
};

const initialState: CartState = {
  items: [],
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<any>) {
      state.items.push(action.payload);    
      state.totalPrice = state.items.reduce((total, item)=>{return total + Number(item.price)}, 0);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalPrice = state.items.reduce((total, item)=>{return total + Number(item.price)}, 0)
    },
    clearCart(state) {
      state.items = [];
    },
  }
});

export const selectCart = (state) => state.cart;
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
