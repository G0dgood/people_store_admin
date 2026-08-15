"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Dropdown from "@/app/components/Form/Dropdown";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiArrowPath } from "react-icons/hi2";
import { useGetRolesQuery, useUpdateRoleMutation, Role } from "@/lib/redux/services/roleApi";
import { useGetModulesQuery, Module } from "@/lib/redux/services/moduleApi";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";
import { toast } from "sonner";
import { PermissionsSkeleton } from "@/app/components/Skeleton/PermissionsSkeleton";

const privileges = [
  { id: "view", label: "View" },
  { id: "create", label: "Create" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
];

const roleColors: Record<string, string> = {
  "Super Admin": "bg-brand-gold",
  "SUPER_ADMIN": "bg-brand-gold",
  "Editor": "bg-emerald-500",
  "Order Manager": "bg-amber-500",
  "Support": "bg-rose-500",
};

export default function PermissionsAccordion() {
  const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRolesQuery();
  const roles = rolesResponse?.roles || [];
  const { data: modules = [], isLoading: isLoadingModules, refetch: refetchModules, isFetching: isFetchingModules } = useGetModulesQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  // matrixState[roleId][moduleId][privilegeId] = boolean
  const [matrixState, setMatrixState] = useState<Record<string, Record<string, Record<string, boolean>>>>({});
  const [hasChanges, setHasChanges] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (roles.length > 0 && modules.length > 0) {
      const newState: Record<string, Record<string, Record<string, boolean>>> = {};
      roles.forEach(role => {
        newState[role._id] = {};
        const currentPermissions = new Set(role.permissions || []);

        modules.forEach(m => {
          newState[role._id][m.slug] = {};
          privileges.forEach(p => {
            newState[role._id][m.slug][p.id] = currentPermissions.has(`${m.slug}_${p.id}`);
          });
        });
      });
      setMatrixState(newState);
      setHasChanges({});
    }
  }, [roles, modules]);

  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All sectors");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const togglePermission = (roleId: string, moduleSlug: string, privId: string) => {
    setMatrixState(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [moduleSlug]: {
          ...prev[roleId][moduleSlug],
          [privId]: !prev[roleId][moduleSlug][privId]
        }
      }
    }));
    setHasChanges(prev => ({ ...prev, [roleId]: true }));
  };

  const toggleModuleRow = (roleId: string, moduleSlug: string) => {
    const allOn = privileges.every(p => matrixState[roleId][moduleSlug][p.id]);
    setMatrixState(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [moduleSlug]: privileges.reduce((acc, p) => ({ ...acc, [p.id]: !allOn }), {} as any)
      }
    }));
    setHasChanges(prev => ({ ...prev, [roleId]: true }));
  };

  const handleSaveRole = async (roleId: string) => {
    const role = roles.find(r => r._id === roleId);
    if (!role || !matrixState[roleId]) return;

    // Flatten logic
    const permissions: string[] = [];
    Object.entries(matrixState[roleId]).forEach(([moduleSlug, privs]) => {
      Object.entries(privs).forEach(([privId, isAllowed]) => {
        if (isAllowed) permissions.push(`${moduleSlug}_${privId}`);
      });
    });

    try {
      await updateRole({ roleId, data: { permissions } }).unwrap();
      toast.success("Governance Updated", {
        description: `Policies for "${role.name}" have been synchronized.`
      });
      setHasChanges(prev => ({ ...prev, [roleId]: false }));
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err.data?.message || "Failed to synchronize governance."
      });
    }
  };

  const handleDeployAll = async () => {
    const changedRoleIds = Object.keys(hasChanges).filter(id => hasChanges[id]);
    if (changedRoleIds.length === 0) {
      toast.info("No Changes Detected", { description: "Global rules are already synchronized." });
      setIsSyncModalOpen(false);
      return;
    }

    try {
      await Promise.all(changedRoleIds.map(id => handleSaveRole(id)));
      setIsSyncModalOpen(false);
    } catch (err) {
      // Errors are handled per role
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesCategory = activeCategory === "All sectors" || module.category === activeCategory;
    const matchesSearch = module.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All sectors", ...Array.from(new Set(modules.map(m => m.category)))];

  const isLoading = isLoadingRoles || isLoadingModules;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Action Bar */}
      <div className="flex justify-between items-end gap-6 mb-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-[#121212]">Administrative Permissions</h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Role Based Governance</p>
        </div>
        <div className="flex gap-3">
          <Button shape="rounded-sm" variant="outline"
            className="border-gray-200 text-gray-500 group"
            iconLeft={<HiArrowPath size={16} className={`${isFetchingModules ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
            onClick={() => refetchModules()}
            disabled={isLoading || isFetchingModules}
          >
            {isFetchingModules ? "Syncing..." : "Refresh Policies"}
          </Button>
          <Button shape="rounded-sm" variant="primary"
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
            iconLeft={<Icon name="verified" folder="icon" size="sm" />}
            onClick={() => setIsSyncModalOpen(true)}
            disabled={Object.values(hasChanges).every(v => !v)}
          >
            Deploy All Policies
          </Button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white rounded-[6px] border border-[#1C1C1C1A] p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Dropdown
            options={categories.map(cat => ({
              value: cat,
              label: cat === "All sectors" ? "All Administrative Sectors" : `${cat} Sector`
            }))}
            value={activeCategory}
            onChange={setActiveCategory}
            className="w-full lg:w-[250px]"
            size="md"
            variant="minimal"
          />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap hidden xl:block">:Filter Sector</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex-1 xl:w-80 relative group">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search modules or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon name="search-01" folder="dashboardIcon" size="xs" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-gold transition-colors" />
          </div>
          <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
        </div>
      </div>

      {/* Role Accordion List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <PermissionsSkeleton />
        ) : roles.length === 0 ? (
          <NoRecordFound text="No administrative roles found." asTable={false} />
        ) : (
          roles.map((role: Role) => {
            const isExpanded = expandedRoleId === role._id;
            const roleHasChanges = !!hasChanges[role._id];

            return (
              <div key={role._id} className={`bg-white rounded-[6px] border transition-all duration-300 ${roleHasChanges ? 'border-brand-gold shadow-md' : 'border-[#1C1C1C1A] hover:shadow-md'}`}>
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedRoleId(isExpanded ? null : role._id)}
                  className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isExpanded ? 'bg-gray-50/50 border-b border-gray-200' : 'hover:bg-gray-50/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${roleColors[role.name] || 'bg-gray-300'}  `} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-base font-black text-[#121212]">{role.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{role.users || 0} Active Users Assigned</span>
                    </div>
                    {roleHasChanges && (
                      <span className="ml-4 px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[9px] font-black uppercase tracking-widest rounded-full">Pending Sync</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <HiChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      size={20}
                    />
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-0 sm:p-0 overflow-x-auto admin-table-container my-3">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50/20 border-b border-gray-200">
                              <th className="py-4 pl-8 text-left">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Module</span>
                              </th>
                              {privileges.map(p => (
                                <th key={p.id} className="py-4 text-center">
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.label}</span>
                                </th>
                              ))}
                              <th className="py-4 pr-8 text-right w-24">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Toggle All</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {matrixState[role._id] && filteredModules.map((module, mIdx) => (
                              <motion.tr
                                key={module._id}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: mIdx * 0.02 }}
                                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors"
                              >
                                <td className="py-4 pl-8">
                                  <div className="flex flex-col">
                                    <span className="text-[13px] font-black text-[#121212]">{module.label}</span>
                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{module.category} Sector</span>
                                  </div>
                                </td>
                                {privileges.map(p => (
                                  <td key={p.id} className="py-4 text-center px-4">
                                    <div className="flex justify-center items-center">
                                      <div className={`p-1.5 rounded-lg transition-all ${matrixState[role._id][module.slug][p.id] ? 'bg-emerald-50/40' : 'hover:bg-gray-50'}`}>
                                        <Checkbox
                                          checked={matrixState[role._id][module.slug][p.id]}
                                          onChange={() => togglePermission(role._id, module.slug, p.id)}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                ))}
                                <td className="py-4 pr-8 text-right">
                                  <button
                                    onClick={() => toggleModuleRow(role._id, module.slug)}
                                    className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-brand-gold hover:text-white transition-all  "
                                  >
                                    <Icon name="verified" folder="icon" size="md" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>

                        {roleHasChanges && (
                          <div className="p-6 bg-gray-50/30 border-t border-gray-200 flex justify-end gap-3">
                            <Button
                              variant="outline"
                              shape="rounded-sm"
                              size="sm"
                              onClick={() => refetchModules()}
                              className="text-gray-400"
                            >
                              Discard Role Changes
                            </Button>
                            <Button
                              variant="primary"
                              shape="rounded-sm"
                              size="sm"
                              onClick={() => handleSaveRole(role._id)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Synchronizing..." : `Save ${role.name} Policies`}
                            </Button>
                          </div>
                        )}

                        {filteredModules.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-20">
                            <NoRecordFound text="No sectors matching your search criteria." asTable={false} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Global Sync Modal */}
      <ConfirmationModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onConfirm={handleDeployAll}
        title="Deploy Governance Policies"
        message="Are you sure you want to force synchronize these role-based access rules across all server instances? This will override local permission sets for all active accounts immediately."
        confirmText={isUpdating ? "Deploying..." : "Initialize Sync"}
        type="success"
      />
    </div>
  );
}
