"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input, Textarea } from "../../components/Form/Inputs";
import { UploadAvatarModal } from "../../components/Admin/UploadAvatarModal";
import Modal from "../../components/Modal/Modal";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { SecurityHelpDrawer } from "../../components/Admin/SecurityHelpDrawer";
import { HiLockClosed, HiKey, HiShieldCheck, HiEye, HiEyeSlash, HiArrowPath } from "react-icons/hi2";
import { Tooltip } from "@/app/components/Tooltip";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { selectCurrentUser, updateUser } from "@/lib/redux/features/authSlice";
import { useGetCurrentUserQuery, useUpdateAccountMutation, useUpdateAvatarMutation, useChangePasswordMutation } from "@/lib/redux/services/authApi";
import { toast } from "sonner";
import { ProfileSkeleton } from "../../components/Skeleton/ProfileSkeleton";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  // Get the loading states to show the skeleton
  const { refetch, isLoading, isFetching } = useGetCurrentUserQuery(undefined);

  const [updateAccount, { isLoading: isUpdatingAccount }] = useUpdateAccountMutation();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    biography: "",
    dob: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize and sync form whenever user data changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        location: user.location || "",
        biography: user.biography || "",
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
      });
    }
  }, [user]);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isChangeSuccessOpen, setIsChangeSuccessOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Required Fields", {
        description: "Please fill in all password fields."
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "New password and confirmation password do not match."
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Weak Password", {
        description: "New password must be at least 6 characters long."
      });
      return;
    }

    try {
      const response = await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }).unwrap();

      if (response.success) {
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        toast.success("Password Changed", {
          description: "Your security credentials have been updated successfully."
        });
      }
    } catch (err: any) {
      toast.error("Change Failed", {
        description: err.data?.message || "Invalid current password or update failed."
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await updateAccount(formData).unwrap();
      if (response.success) {
        // Force an immediate refresh of the user data across the whole app
        await refetch();
        setIsEditMode(false);
        setIsChangeSuccessOpen(true);
      }
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err.data?.message || "Something went wrong while updating your profile."
      });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await updateAvatar(file).unwrap();
      if (response.success) {
        // Force an immediate refresh of the user data across the whole app
        await refetch();
        toast.success("Avatar Updated", {
          description: "Your profile picture has been successfully changed."
        });
      }
    } catch (err: any) {
      toast.error("Upload Failed", {
        description: err.data?.message || "Something went wrong while uploading your avatar."
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-12">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (33%) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Profile Summary Card */}
          <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col items-center text-center relative">
            <div className="absolute top-6 right-6 flex gap-3 text-gray-400">
              <Tooltip text="Refresh Account Details">
                <Button variant="outline" shape="rounded-sm"
                  className="!p-1.5 text-gray-400 group"
                  onClick={() => refetch()}
                  disabled={isLoading || isFetching}
                >
                  <HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-brand-gold'} transition-colors`} />
                </Button>
              </Tooltip>
              <Button variant="outline" shape="rounded-sm" className="!p-1.5 text-gray-400">
                <Icon name="settings" folder="dashboardIcon" size="sm" />
              </Button>
              <Button variant="outline" shape="rounded-sm" className="!p-1.5 text-gray-400">
                <Icon name="link-external" folder="dashboardIcon" size="sm" />
              </Button>
            </div>

            <div className="w-24 h-24 rounded-full border-4 border-gray-50 overflow-hidden mb-4   bg-brand-gold/10 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-gold flex items-center justify-center text-white font-black text-2xl uppercase">
                  {user?.fullName?.charAt(0) || "A"}
                </div>
              )}
            </div>

            <h2 className="text-base font-bold text-[#1D3557]">{user?.fullName || "Administrative Account"}</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-6">
              <span>{user?.email || "No email provided"}</span>
              <button className="text-brand-gold hover:scale-110 transition-transform">
                <Icon name="Frame 4386" folder="dashboardIcon" size="xs" />
              </button>
            </div>

            <div className="w-full border-t border-gray-50 pt-6 flex flex-col gap-4">
              <span className="text-[10px] font-bold text-gray-400">Linked with Social media</span>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 opacity-80">
                  <Icon name="facebook" folder="dashboardIcon" size="sm" className="text-[#1877F2]" />
                  <span className="text-[10px] text-gray-400 font-bold decoration-gray-200 underline underline-offset-2">Linked</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-80">
                  <Icon name="linkedin" folder="dashboardIcon" size="sm" className="text-[#0077b5]" />
                  <span className="text-[10px] text-gray-400 font-bold decoration-gray-200 underline underline-offset-2">Linked</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-80">
                  <Icon name="x" folder="dashboardIcon" size="sm" className="text-black" />
                  <span className="text-[10px] text-gray-400 font-bold decoration-gray-200 underline underline-offset-2">Linked</span>
                </div>
              </div>
              <button className="mt-2 w-fit mx-auto flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-[6px] text-[10px] font-bold text-[#1D3557] hover:bg-gray-50 transition-all  ">
                <Icon name="circle-plus" folder="dashboardIcon" size="xs" />
                Social media
              </button>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[6px] bg-brand-gold/10 flex items-center justify-center">
                  <HiLockClosed className="text-brand-gold w-3 h-3" />
                </div>
                <h3 className="text-sm font-bold text-[#1D3557]">Change Password</h3>
              </div>
              <button
                className="text-[10px] font-bold text-brand-gold underline underline-offset-2 hover:text-brand-gold/80 transition-colors"
                onClick={() => setIsHelpDrawerOpen(true)}
              >
                Need help? <Icon name="live_help" folder="icon" size="xs" className="inline ml-1" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Current Password</label>
                <Input shape="rounded-sm"
                  type={showCurrentPassword ? "text" : "password"}
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter current password"
                  className="bg-gray-50/80 border-gray-50 text-xs font-medium"
                  prefixElement={<HiLockClosed className="text-gray-400 w-3 h-3" />}
                  suffixElement={
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="text-gray-300 hover:text-brand-gold transition-colors"
                    >
                      {showCurrentPassword ? <HiEyeSlash className="w-3 h-3" /> : <HiEye className="w-3 h-3" />}
                    </button>
                  }
                />
                <button className="text-[10px] font-bold text-brand-gold w-fit hover:underline hover:scale-105 transition-transform">Forgot Current Password? Click here</button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">New Password</label>
                <Input shape="rounded-sm"
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter new password"
                  className="bg-gray-50/80 border-gray-50 text-xs font-medium"
                  prefixElement={<HiKey className="text-gray-400 w-3 h-3" />}
                  suffixElement={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-gray-300 hover:text-brand-gold transition-colors"
                    >
                      {showNewPassword ? <HiEyeSlash className="w-3 h-3" /> : <HiEye className="w-3 h-3" />}
                    </button>
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Re-enter Password</label>
                <Input shape="rounded-sm"
                  type={showReenterPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm new password"
                  className="bg-gray-50/80 border-gray-50 text-xs font-medium"
                  prefixElement={<HiShieldCheck className="text-gray-400 w-3 h-3" />}
                  suffixElement={
                    <button
                      type="button"
                      onClick={() => setShowReenterPassword(!showReenterPassword)}
                      className="text-gray-300 hover:text-brand-gold transition-colors"
                    >
                      {showReenterPassword ? <HiEyeSlash className="w-3 h-3" /> : <HiEye className="w-3 h-3" />}
                    </button>
                  }
                />
              </div>

              <Button shape="rounded-sm" variant="primary"
                className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold w-full h-12 mt-2 shadow-lg shadow-brand-gold/10 text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95  "
                disabled={isChangingPassword}
                onClick={handleChangePassword}
              >
                {isChangingPassword ? "Updating..." : "Save Change"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column (66%) */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-8 relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#1D3557]">Profile Update</h3>
              <button
                className={`flex items-center gap-2 px-4 py-2 border rounded-[6px] text-xs font-bold transition-all  
                            ${isEditMode
                    ? "bg-brand-charcoal border-brand-charcoal text-white hover:bg-brand-charcoal/90"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}
                         `}
                disabled={isUpdatingAccount}
                onClick={() => {
                  if (isEditMode) {
                    handleUpdateProfile();
                  } else {
                    setIsEditMode(true);
                  }
                }}
              >
                <Icon name={isEditMode ? "verified" : "settings"} folder={isEditMode ? "icon" : "dashboardIcon"} size="xs" />
                {isUpdatingAccount ? "Updating..." : (isEditMode ? "Update Profile" : "Edit")}
              </button>
            </div>

            {/* Avatar Management */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-inner border border-gray-200 bg-brand-gold/10 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-gold flex items-center justify-center text-white font-black text-xs uppercase">
                    {user?.fullName?.charAt(0) || "A"}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="avatar-upload"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <Button shape="rounded-sm" variant="primary"
                  className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold px-5 py-2 text-[10px]  "
                  disabled={isUpdatingAvatar}
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  {isUpdatingAvatar ? "Uploading..." : "Upload New"}
                </Button>
                <Button shape="rounded-sm" variant="outline"
                  className="text-gray-400 px-5 py-2 text-[10px] font-bold  "
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Update Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1D3557]">Full Name</label>
                <Input shape="rounded-sm"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  readOnly={!isEditMode}
                  className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1D3557]">Phone Number</label>
                <Input shape="rounded-sm"
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  readOnly={!isEditMode}
                  className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1D3557]">E-mail</label>
                <Input shape="rounded-sm"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditMode}
                  className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1D3557]">Date of Birth</label>
                <Input shape="rounded-sm"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  readOnly={!isEditMode}
                  className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                />
              </div>

              <div className="md:col-span-1 flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1D3557]">Location</label>
                <Input shape="rounded-sm"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter your location"
                  readOnly={!isEditMode}
                  className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1D3557]">Biography</label>
                <div className="relative group">
                  <Textarea shape="rounded-sm"
                    rows={4}
                    name="biography"
                    value={formData.biography}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                    placeholder="Enter a biography about you"
                    readOnly={!isEditMode}
                    className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-medium text-gray-700 resize-none leading-relaxed transition-colors`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UploadAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => {
          setIsAvatarModalOpen(false);
        }}
        onUploadSuccess={(newSrc) => {
          dispatch(updateUser({ avatar: newSrc }));
          setIsChangeSuccessOpen(true);
        }}
      />

      <Modal
        isOpen={isChangeSuccessOpen}
        onClose={() => setIsChangeSuccessOpen(false)}
        title=""
        size="md"
      >
        <ModalBody className="flex flex-col items-center text-center py-10 gap-6">
          <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shadow-inner border border-brand-gold/20">
            <Icon name="verified" folder="icon" size="lg" className="w-10 h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-[#1D3557]">Update Successful!</h2>
            <p className="text-sm font-medium text-gray-400 max-w-[280px] mx-auto leading-relaxed">
              Your profile information has been securely updated and synchronized across the administrative system.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col gap-3 pb-8">
          <Button shape="rounded-sm"
            variant="primary"
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/10"
            onClick={() => setIsChangeSuccessOpen(false)}
          >
            Great, thank you
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          dispatch(updateUser({ avatar: undefined }));
          setIsDeleteConfirmOpen(false);
          setIsChangeSuccessOpen(true);
        }}
        title="Remove Photo"
        message="Are you sure you want to remove your profile photo? You can upload a new one at any time."
        confirmText="Yes, remove it"
        type="danger"
      />

      <SecurityHelpDrawer
        isOpen={isHelpDrawerOpen}
        onClose={() => setIsHelpDrawerOpen(false)}
      />
    </div>
  );
}
