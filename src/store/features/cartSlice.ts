// src/store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: any[];
  totalPrice: string;
};

const initialState: CartState = {
  items: [],
  totalPrice: "0.00",
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<any>) {
      console.log(action.payload); // Debugging payload
      state.items.push(action.payload);
    
      const total = state.items.reduce((total, item) => {
        const price = Number(item.price) || 0; // Handle invalid/missing prices
        console.log(price); // Debugging price
        return total + price;
      }, 0);
    
      state.totalPrice = total.toFixed(2);
      console.log(state.totalPrice); // Debugging totalPrice
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      const total = state.items.reduce((total, item)=>{return total + Number(item.price)}, 0);
      state.totalPrice = total.toFixed(2);
    },
    clearCart(state) {
      state.items = [];
      state.totalPrice = "0.00";
    },
  }
});

export const selectCart = (state) => state.cart;
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
