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
import { useSocket } from "@/app/context/SocketContext";
import { useRouter } from "next/navigation";
import { logOut as logOutAuth } from "@/lib/redux/features/authSlice";

export type PermissionAction = "view" | "create" | "edit" | "delete";

export type ModuleId =
  | "dashboard" | "support" | "faq" | "notifications" | "settings"
  | "orders" | "transactions" | "refunds" | "products" | "media" | "products/media"
  | "categories" | "brands" | "reviews" | "marketing" | "deals"
  | "advert" | "customers" | "users" | "roles" | "permissions" | "profile"
  | "gift-cards" | "gift-boxes" | "offices" | "drivers" | "deliveries";

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
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const userPrivileges = useSelector(selectUserPrivileges);
  const isLoadingRedux = useSelector(selectIsPrivilegeLoading);
  const isAdmin = useSelector(selectIsAdmin);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  // 1. Fetch all roles to find the ID for the current user's role name
  const { data: rolesResponse, isLoading: isRolesLoading } = useGetRolesQuery();
  const allRoles = rolesResponse?.roles || [];

  // 2. Find the roleId for the user's current role string
  // Smart matching: lowercase, remove spaces and underscores
  const normalize = (s: string) => s?.toLowerCase().replace(/[\s_]/g, "") || "";

  const currentRole = allRoles.find((r: Role) => normalize(r.name) === normalize(user?.role));
  const roleId = currentRole?._id;

  // 3. Fetch structured privileges for this role
  const { data: rolePrivileges, isLoading: isQueryLoading, refetch: refetchPrivileges } = useGetRolePrivilegesQuery(roleId!, {
    skip: !roleId
  });

  const isLoading = isRolesLoading || (!!roleId && isQueryLoading);

  const { refetch: refetchRoles } = useGetRolesQuery();

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

  // 6. Listen for real-time permission updates via WebSockets
  const { on, off } = useSocket();

  useEffect(() => {
    const handlePermissionsUpdate = (data: { roleId: string, adminId?: string, description?: string }) => {


      // If the updated role is the current user's role, refresh their privileges
      if (data.roleId === roleId) {
        refetchPrivileges();

        // Don't show toast to the admin who just saved the changes
        if (data.adminId !== user?._id) {
          toast.info("Access permissions updated", {
            description: data.description || "Your administrative privileges have been synchronized with the server."
          });
        }
      }

      // Always refresh the roles list to keep state consistent across the UI
      refetchRoles();
    };

    const handleForceLogout = (data: { userId: string, reason?: string }) => {
      if (data.userId === user?._id) {
        // Clear everything
        dispatch(logOutAuth());
        dispatch(clearReduxPrivileges());
        localStorage.removeItem("userPrivileges");

        toast.error("Session Terminated", {
          description: data.reason || "Your administrative access has been revoked or locked by a superior administrator."
        });

        window.location.href = "/";
      }
    };

    on("permissions_updated", handlePermissionsUpdate);
    on("force_logout", handleForceLogout);

    return () => {
      off("permissions_updated", handlePermissionsUpdate);
      off("force_logout", handleForceLogout);
    };
  }, [roleId, refetchPrivileges, refetchRoles, on, off, user?._id, dispatch, router]);

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
