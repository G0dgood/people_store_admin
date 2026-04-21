import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../services/roleApi';

export interface UserPrivileges {
  userId: string;
  roleId: string;
  role: UserRole | null;
}

interface PrivilegeState {
  userPrivileges: UserPrivileges | null;
  isLoading: boolean;
}

const initialState: PrivilegeState = {
  userPrivileges: null,
  isLoading: false,
};

const privilegeSlice = createSlice({
  name: 'privilege',
  initialState,
  reducers: {
    setPrivileges: (state, action: PayloadAction<UserPrivileges>) => {
      state.userPrivileges = action.payload;
      // Persist to localStorage for consistency on hydration
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPrivileges', JSON.stringify(action.payload));
      }
    },
    clearPrivileges: (state) => {
      state.userPrivileges = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userPrivileges');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setPrivileges, clearPrivileges, setLoading } = privilegeSlice.actions;

export default privilegeSlice.reducer;

export const selectUserPrivileges = (state: any) => state.privilege?.userPrivileges;
export const selectIsPrivilegeLoading = (state: any) => state.privilege?.isLoading;
export const selectIsSuperAdmin = (state: any) => 
  state.privilege?.userPrivileges?.role?.roleName === 'SUPER_ADMIN';
export const selectIsAdmin = (state: any) => 
  ['SUPER_ADMIN', 'ADMIN'].includes(state.privilege?.userPrivileges?.role?.roleName || '');
