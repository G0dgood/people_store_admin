"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Button } from "../Button";
import { Icon } from "../Icon";
import Checkbox from "@/app/components/Checkbox";
import { Role, useUpdateRoleMutation } from "@/lib/redux/services/roleApi";
import { useGetModulesQuery, Module } from "@/lib/redux/services/moduleApi";
import { SVGLoaderFetch } from "@/app/components/Options";
import { toast } from "sonner";

interface EditRoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

const accessTypes = [
  { id: "view", label: "View" },
  { id: "create", label: "Create" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
];

export function EditRoleDrawer({ isOpen, onClose, role }: EditRoleDrawerProps) {
  const { data: modules = [], isLoading: isLoadingModules } = useGetModulesQuery();
  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  // permissionState[moduleSlug][accessTypeId] = boolean
  const [permissionState, setPermissionState] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    if (role && modules.length > 0) {
      const initial: Record<string, Record<string, boolean>> = {};
      const currentPermissions = new Set(role.permissions || []);

      modules.forEach(m => {
        initial[m.slug] = {};
        accessTypes.forEach(a => {
           initial[m.slug][a.id] = currentPermissions.has(`${m.slug}_${a.id}`);
        });
      });
      setPermissionState(initial);
    }
  }, [role, modules, isOpen]);

  const togglePermission = (moduleSlug: string, accessId: string) => {
    setPermissionState(prev => ({
      ...prev,
      [moduleSlug]: {
        ...prev[moduleSlug],
        [accessId]: !prev[moduleSlug][accessId]
      }
    }));
  };

  const toggleRow = (moduleSlug: string) => {
    const allOn = accessTypes.every(a => permissionState[moduleSlug]?.[a.id]);
    setPermissionState(prev => ({
      ...prev,
      [moduleSlug]: accessTypes.reduce((acc, a) => ({ ...acc, [a.id]: !allOn }), {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    // Flatten selected permissions into an array
    const permissions: string[] = [];
    Object.entries(permissionState).forEach(([moduleSlug, actions]) => {
      Object.entries(actions).forEach(([actionId, isAllowed]) => {
        if (isAllowed) {
          permissions.push(`${moduleSlug}_${actionId}`);
        }
      });
    });

    try {
      await updateRole({ 
        roleId: role._id, 
        data: { permissions } 
      }).unwrap();
      
      toast.success("Governance Updated", {
        description: `Access matrix for "${role.name}" has been synchronized.`
      });
      onClose();
    } catch (err: any) {
      toast.error("Update Failed", {
          description: err.data?.message || "Something went wrong while updating governance."
      });
    }
  };

  if (!role) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Administrative Access Matrix" width="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-8">
          {/* Header Card */}
          <div className="bg-[#121212] rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.05] rounded-full -translate-y-12 translate-x-12" />
             <div className="flex flex-col gap-1 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Policy Governance</span>
                <h3 className="text-xl font-black">{role.name}</h3>
                <p className="text-[11px] font-medium opacity-70 mt-1 max-w-[240px]">Define granular access rules for this administrative role across all system modules.</p>
             </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Matrix Header */}
            <div className="grid grid-cols-12 gap-2 px-1 items-center">
               <div className="col-span-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">System Module</div>
               {accessTypes.map(a => (
                 <div key={a.id} className="col-span-1.5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{a.label}</div>
               ))}
               <div className="col-span-1 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">All</div>
            </div>

            <div className="flex flex-col gap-2">
              {isLoadingModules ? (
                <div className="py-20 flex justify-center items-center">
                  <SVGLoaderFetch colSpan={1} text="Loading system sectors..." asTable={false} />
                </div>
              ) : (
                modules.map((module) => (
                  <div 
                    key={module._id} 
                    className="grid grid-cols-12 gap-2 items-center p-3 sm:p-4 bg-white border border-gray-200 rounded-2xl hover:border-brand-gold/20 hover:shadow-md transition-all group"
                  >
                    <div className="col-span-5 flex flex-col gap-0.5">
                      <span className="text-[13px] font-black text-[#121212] group-hover:text-brand-gold transition-colors">{module.label}</span>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{module.category} Sector</span>
                    </div>
                    
                    {accessTypes.map(a => (
                      <div key={a.id} className="col-span-1.5 flex justify-center">
                         <Checkbox 
                           checked={permissionState[module.slug]?.[a.id] || false}
                           onChange={() => togglePermission(module.slug, a.id)}
                         />
                      </div>
                    ))}

                    <div className="col-span-1 flex justify-end">
                       <button 
                         type="button" 
                         onClick={() => toggleRow(module.slug)}
                         className="w-6 h-6 rounded-sm bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-brand-gold/10 hover:text-brand-gold transition-all"
                       >
                          <Icon name="verified" folder="icon" size="xs" />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Security Warning */}
          <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex gap-4 items-start">
             <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
                <Icon name="ic_round-logout" folder="dashboardIcon" size="xs" className="rotate-90" />
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black text-rose-800 uppercase tracking-wider">Elevation Warning</span>
                <p className="text-[10px] font-medium text-rose-600 leading-relaxed">
                   Changes to the access matrix are global. Elevated permissions will be applied to all members assigned to this role immediately upon synchronization.
                </p>
             </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3 pb-8">
          <Button 
            shape="rounded-sm"
            variant="primary" 
            type="submit"
            disabled={isLoading || isLoadingModules}
            className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-brand-gold/10 transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold animate-pulse-subtle"
          >
            {isLoading ? "Synchronizing..." : "Deploy Governance Update"}
          </Button>
          <Button 
            shape="rounded-sm"
            variant="outline" 
            type="button" 
            onClick={onClose}
            className="w-full h-12 text-[11px] font-bold text-gray-400 group hover:text-gray-900 border-gray-200 transition-all"
          >
            Discard Changes
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
