import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'

const saveduser = localStorage.getItem("user")

interface User {
    id?: string;
    name: string;
    email: string;
    phone: string;
    password: string;
}

interface AUthstate {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AUthstate = {
    user: saveduser ? JSON.parse(saveduser) : null,
    loading: false,
    error: null,
}

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async ({ id, name, email, phone }: { id: string; name: string; email: string; phone: string }) => {
        const res = await axios.patch(`http://localhost:5000/users/${id}`, {
            name,
            email,
            phone,
        });
        return res.data;
    }
);


export const updatePassword = createAsyncThunk(
    "auth/updatePassword",
    async ({ id, newPassword }: { id: string; currentPassword: string; newPassword: string }) => {
        const res = await axios.patch(`http://localhost:5000/users/${id}`, {
            password: newPassword,
        });
        return res.data;
    }
);


export const loginuser = createAsyncThunk(
    "auth/loginuser",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5000/users?email=${credentials.email}&&password=${credentials.password}`);

            if (res.data.length === 0) {
                return rejectWithValue("User not found");
            }
            const user = res.data[0];
            if (user.password !== credentials.password) {
                console.log(user.email)
                console.log(user.password)
                return rejectWithValue("Invalid password");

            }
            return user;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);



export const RegisterUser = createAsyncThunk(
    "auth/RegisterUser",
    async (userData: User, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:5000/users", userData);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Server error")
        }
    }
)



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            localStorage.removeItem("user");
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(RegisterUser.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(RegisterUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false
                state.user = action.payload
                localStorage.removeItem("user");
            })

            .addCase(RegisterUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.error = action.payload
            })

        builder
            .addCase(loginuser.pending, (state) => {
                state.loading = true
            })

            .addCase(loginuser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                localStorage.setItem("user", JSON.stringify(action.payload));
            })

            .addCase(loginuser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer