import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/ShoppingLists";

export interface Product {
  id: number;
  name: string;
  quantity: number;
  image?: string; // optional image URL
}

export interface ShoppingList {
  id: string;
  name: string;
  userId: string;
  products: Product[];
}

export interface ShoppingListState {
  items: ShoppingList[];
  status: "idle" | "pending" | "error" | "succeed";
  error: string | null;
}

const initialState: ShoppingListState = {
  items: [],
  status: "idle",
  error: null,
};

// Fetch lists by userId
export const fetchLists = createAsyncThunk<ShoppingList[], string>(
  "ShoppingLists/fetch",
  async (userId) => {
    const res = await axios.get<ShoppingList[]>(`${API_URL}?userId=${userId}`);
    return res.data;
  }
);

// Add a new shopping list
export const addShoppingList = createAsyncThunk<ShoppingList, ShoppingList>(
  "ShoppingLists/add",
  async (newList) => {
    const res = await axios.post(API_URL, newList);
    return res.data;
  }
);

// Delete a shopping list
export const deleteList = createAsyncThunk<string, string>(
  "ShoppingLists/delete",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

// Delete a product from a shopping list
export const deleteProduct = createAsyncThunk<
  { listId: string; productId: number },
  { listId: string; productId: number }
>("ShoppingLists/deleteProduct", async ({ listId, productId }) => {
  const res = await axios.get<ShoppingList>(`${API_URL}/${listId}`);
  const list = res.data;
  const updatedProducts = list.products.filter((p) => p.id !== productId);
  await axios.put(`${API_URL}/${listId}`, { ...list, products: updatedProducts });
  return { listId, productId };
});

// Update a product inside a shopping list
export const updateProduct = createAsyncThunk<
  { listId: string; product: Product },
  { listId: string; product: Product }
>("ShoppingLists/updateProduct", async ({ listId, product }) => {
  const res = await axios.get<ShoppingList>(`${API_URL}/${listId}`);
  const list = res.data;
  const updatedProducts = list.products.map((p) =>
    p.id === product.id ? product : p
  );
  await axios.put(`${API_URL}/${listId}`, { ...list, products: updatedProducts });
  return { listId, product };
});

const ShoppingListSlice = createSlice({
  name: "ShoppingLists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action: PayloadAction<ShoppingList[]>) => {
        state.status = "succeed";
        state.items = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "Failed to fetch lists";
      })

      .addCase(addShoppingList.fulfilled, (state, action: PayloadAction<ShoppingList>) => {
        state.items.push(action.payload);
      })

      .addCase(deleteList.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((list) => list.id !== action.payload);
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        const { listId, productId } = action.payload;
        const list = state.items.find((l) => l.id === listId);
        if (list) list.products = list.products.filter((p) => p.id !== productId);
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const { listId, product } = action.payload;
        const list = state.items.find((l) => l.id === listId);
        if (list) {
          const index = list.products.findIndex((p) => p.id === product.id);
          if (index !== -1) list.products[index] = product;
        }
      });
  },
});

export default ShoppingListSlice.reducer;
