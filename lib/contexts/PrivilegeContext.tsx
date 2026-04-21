"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  UserPrivileges,
  setPrivileges as setReduxPrivileges,
  clearPrivileges as clearReduxPrivileges,
  setLoading as setReduxLoading,
  selectUserPrivileges,
  selectIsPrivilegeLoading,
  selectIsAdmin,
  selectIsSuperAdmin,
} from "@/lib/redux/features/privilegeSlice";
import { 
  useGetRolePrivilegesQuery, 
  RoleModulePermission, 
  UserRole 
} from "@/lib/redux/services/roleApi";
import { selectCurrentUser } from "@/lib/redux/features/authSlice";
import { toast } from "sonner";
import { Role } from "@/lib/redux/services/roleApi";
import { useGetRolesQuery } from "@/lib/redux/services/roleApi";

export type PermissionAction = "view" | "create" | "edit" | "delete";

export type ModuleId = 
  | "dashboard" | "support" | "faq" | "notifications" | "settings"
  | "orders" | "transactions" | "refunds" | "products" | "media"
  | "categories" | "brands" | "reviews" | "marketing" | "deals"
  | "advert" | "customers" | "users" | "roles" | "permissions" | "profile";

interface PrivilegeContextType {
  userPrivileges: UserPrivileges | null;
  isLoading: boolean;
  hasPermission: (moduleId: ModuleId) => boolean;
  hasAnyPermission: (moduleIds: ModuleId[]) => boolean;
  hasAllPermissions: (moduleIds: ModuleId[]) => boolean;
  canAccess: (moduleId: ModuleId, action?: PermissionAction) => boolean;
  setUserPrivileges: (privileges: UserPrivileges) => void;
  clearPrivileges: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const PrivilegeContext = createContext<PrivilegeContextType | undefined>(undefined);

export const PrivilegeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const userPrivileges = useSelector(selectUserPrivileges);
  const isLoadingRedux = useSelector(selectIsPrivilegeLoading);
  const isAdmin = useSelector(selectIsAdmin);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  // 1. Fetch all roles to find the ID for the current user's role name
  const { data: allRoles = [] } = useGetRolesQuery();
  
  // 2. Find the roleId for the user's current role string (e.g. "SUPER_ADMIN")
  const currentRole = allRoles.find(r => r.name === user?.role);
  const roleId = currentRole?._id;

  // 3. Fetch structured privileges for this role
  const { data: rolePrivileges, isLoading: isQueryLoading } = useGetRolePrivilegesQuery(roleId!, {
    skip: !roleId
  });

  // 4. Update Redux when role privileges are fetched
  useEffect(() => {
    if (rolePrivileges && user) {
      const privileges: UserPrivileges = {
        userId: user._id,
        roleId: roleId!,
        role: rolePrivileges
      };
      dispatch(setReduxPrivileges(privileges));
    }
  }, [rolePrivileges, user, roleId, dispatch]);

  // 5. Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("userPrivileges");
    if (stored) {
      try {
        dispatch(setReduxPrivileges(JSON.parse(stored)));
      } catch (e) {
        console.error("Failed to parse stored privileges");
      }
    }
  }, [dispatch]);

  const findModulePermission = (moduleId: string): RoleModulePermission | undefined => {
    if (!userPrivileges?.role?.permissions) return undefined;
    return userPrivileges.role.permissions.find((p: RoleModulePermission) => p.id === moduleId);
  };

  const hasPermission = (moduleId: ModuleId): boolean => {
    if (isAdmin) return true;
    const modulePermission = findModulePermission(moduleId);
    return modulePermission ? modulePermission.access : false;
  };

  const hasAnyPermission = (moduleIds: ModuleId[]): boolean => {
    return moduleIds.some(id => hasPermission(id));
  };

  const hasAllPermissions = (moduleIds: ModuleId[]): boolean => {
    return moduleIds.every(id => hasPermission(id));
  };

  const canAccess = (moduleId: ModuleId, action?: PermissionAction): boolean => {
    if (isAdmin) return true;
    const modulePermission = findModulePermission(moduleId);
    if (modulePermission) {
      if (!modulePermission.access) return false;
      if (!action) return true;
      return modulePermission.permissions[action];
    }
    return false;
  };

  const setUserPrivileges = (privileges: UserPrivileges) => {
    dispatch(setReduxPrivileges(privileges));
  };

  const clearPrivileges = () => {
    dispatch(clearReduxPrivileges());
  };

  const value: PrivilegeContextType = {
    userPrivileges,
    isLoading: isLoadingRedux || isQueryLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    setUserPrivileges,
    clearPrivileges,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <PrivilegeContext.Provider value={value}>
      {children}
    </PrivilegeContext.Provider>
  );
};

export const usePrivilege = () => {
  const context = useContext(PrivilegeContext);
  if (context === undefined) {
    throw new Error("usePrivilege must be used within a PrivilegeProvider");
  }
  return context;
};

export default PrivilegeContext;
