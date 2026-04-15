"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input, Textarea } from "../../components/Form/Inputs";
import { UploadAvatarModal } from "../../components/Admin/UploadAvatarModal";
import Modal from "../../components/Modal/Modal";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import { ConfirmationModal } from "../../components/Admin/ConfirmationModal";
import { SecurityHelpDrawer } from "../../components/Admin/SecurityHelpDrawer";

export default function ProfilePage() {
   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showReenterPassword, setShowReenterPassword] = useState(false);
   const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
   const [isChangeSuccessOpen, setIsChangeSuccessOpen] = useState(false);
   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);

   return (
      <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-12">
         {/* Page Title */}
         {/* <h1 className="text-xl font-bold text-[#1D3557]">About section</h1> */}

         <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column (33%) */}
            <div className="xl:col-span-4 flex flex-col gap-6">
               {/* Profile Summary Card */}
               <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center relative">
                  <div className="absolute top-6 right-6 flex gap-3 text-gray-400">
                     <button className="hover:text-gray-900 transition-colors"><Icon name="settings" folder="dashboardIcon" size="sm" /></button>
                     <button className="hover:text-gray-900 transition-colors"><Icon name="link-external" folder="dashboardIcon" size="sm" /></button>
                  </div>

                  <div className="w-24 h-24 rounded-full border-4 border-gray-50 overflow-hidden mb-4 shadow-sm">
                     <img src="/dashboardImage/Picture.png" alt="Wade Warren" className="w-full h-full object-cover" />
                  </div>

                  <h2 className="text-base font-bold text-[#1D3557]">Wade Warren</h2>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-6">
                     <span>wade.warren@example.com</span>
                     <button className="text-brand-blue hover:scale-110 transition-transform">
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
                     <button className="mt-2 w-fit mx-auto flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-[6px] text-[10px] font-bold text-[#1D3557] hover:bg-gray-50 transition-all shadow-sm">
                        <Icon name="circle-plus" folder="dashboardIcon" size="xs" />
                        Social media
                     </button>
                  </div>
               </div>

               {/* Change Password Card */}
               <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-bold text-[#1D3557]">Change Password</h3>
                     <button 
                        className="text-[10px] font-bold text-brand-blue underline underline-offset-2 hover:text-blue-600 transition-colors"
                        onClick={() => setIsHelpDrawerOpen(true)}
                     >
                        Need help? <Icon name="live_help" folder="icon" size="xs" className="inline ml-1" />
                     </button>
                  </div>

                  <div className="flex flex-col gap-5">
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">Current Password</label>
                        <Input
                           type={showCurrentPassword ? "text" : "password"}
                           placeholder="Enter password"
                           className="bg-gray-50/80 border-gray-50 text-xs font-medium"
                           suffixElement={
                              <button
                                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                 className="text-gray-300 hover:text-gray-500 transition-colors"
                              >
                                 <Icon name="menu-close" folder="dashboardIcon" size="xs" />
                              </button>
                           }
                        />
                        <button className="text-[10px] font-bold text-brand-blue w-fit">Forgot Current Password? Click here</button>
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">New Password</label>
                        <Input
                           type={showNewPassword ? "text" : "password"}
                           placeholder="Enter password"
                           className="bg-gray-50/80 border-gray-50 text-xs font-medium"
                           suffixElement={
                              <button
                                 onClick={() => setShowNewPassword(!showNewPassword)}
                                 className="text-gray-300 hover:text-gray-500 transition-colors"
                              >
                                 <Icon name="menu-close" folder="dashboardIcon" size="xs" />
                              </button>
                           }
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">Re-enter Password</label>
                        <Input
                           type={showReenterPassword ? "text" : "password"}
                           placeholder="Enter password"
                           className="bg-gray-50/80 border-gray-50 text-xs font-medium"
                           suffixElement={
                              <button
                                 onClick={() => setShowReenterPassword(!showReenterPassword)}
                                 className="text-gray-300 hover:text-gray-500 transition-colors"
                              >
                                 <Icon name="menu-close" folder="dashboardIcon" size="xs" />
                              </button>
                           }
                        />
                     </div>

                     <Button
                        variant="primary"
                        shape="rounded-sm"
                        className="w-full py-3 mt-2 shadow-md"
                        onClick={() => setIsChangeSuccessOpen(true)}
                     >
                        Save Change
                     </Button>
                  </div>
               </div>
            </div>

            {/* Right Column (66%) */}
            <div className="xl:col-span-8">
               <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm p-8 flex flex-col gap-8 relative">
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="text-sm font-bold text-[#1D3557]">Profile Update</h3>
                     <button 
                        className={`flex items-center gap-2 px-4 py-2 border rounded-[6px] text-xs font-bold transition-all shadow-sm
                           ${isEditMode 
                              ? "bg-brand-blue border-brand-blue text-white hover:bg-blue-600" 
                              : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"}
                        `}
                        onClick={() => {
                           if (isEditMode) {
                              setIsChangeSuccessOpen(true);
                           }
                           setIsEditMode(!isEditMode);
                        }}
                     >
                        <Icon name={isEditMode ? "verified" : "settings"} folder={isEditMode ? "icon" : "dashboardIcon"} size="xs" />
                        {isEditMode ? "Update Profile" : "Edit"}
                     </button>
                  </div>

                  {/* Avatar Management */}
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full overflow-hidden shadow-inner border border-gray-100">
                        <img src="/dashboardImage/Picture.png" alt="Avatar" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex gap-2">
                        <Button
                           variant="primary"
                           shape="rounded-sm"
                           className="px-5 py-2 text-[10px] shadow-sm"
                           onClick={() => setIsAvatarModalOpen(true)}
                        >
                           Upload New
                        </Button>
                        <button 
                           className="bg-white border border-gray-100 text-gray-400 px-5 py-2 rounded-[6px] text-[10px] font-bold hover:bg-gray-50 transition-all shadow-sm"
                           onClick={() => setIsDeleteConfirmOpen(true)}
                        >
                           Delete
                        </button>
                     </div>
                  </div>

                  {/* Update Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">First Name</label>
                        <Input
                           type="text"
                           defaultValue="Wade"
                           readOnly={!isEditMode}
                           className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                        />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">Last Name</label>
                        <Input
                           type="text"
                           defaultValue="Warren"
                           readOnly={!isEditMode}
                           className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">Password</label>
                        <Input
                           type="password"
                           defaultValue="**********"
                           readOnly={!isEditMode}
                           className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                           suffixElement={
                              <button className="text-gray-300">
                                 <Icon name="menu-close" folder="dashboardIcon" size="xs" />
                              </button>
                           }
                        />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">Phone Number</label>
                        <Input
                           type="text"
                           defaultValue="(406) 555-0120"
                           readOnly={!isEditMode}
                           className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                           suffixElement={
                              <div className="flex items-center gap-2 px-2 py-0.5 bg-white border border-gray-100 rounded-[3px] shadow-sm cursor-pointer">
                                 <img src="/dashboardIcon/usa.svg" alt="USA" className="w-5 h-3 object-cover rounded-[1px]" />
                                 <Icon name="material-symbols_arrow-downward-rounded" folder="dashboardIcon" size="xs" className="text-gray-300" />
                              </div>
                           }
                        />
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">E-mail</label>
                        <Input
                           type="email"
                           defaultValue="wade.warren@example.com"
                           readOnly={!isEditMode}
                           className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                        />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">Date of Birth</label>
                        <Input
                           type="text"
                           defaultValue="12- January- 1999"
                           className="bg-gray-50/80 border-gray-50 text-xs font-bold text-gray-900"
                           suffixElement={
                              <Icon name="ticket" folder="dashboardIcon" size="xs" className="text-gray-300" />
                           }
                        />
                     </div>

                     <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">Location</label>
                        <Input
                           type="text"
                           defaultValue="2972 Westheimer Rd. Santa Ana, Illinois 85486"
                           readOnly={!isEditMode}
                           className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                        />
                     </div>

                     <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">Credit Card</label>
                        <Input
                           type="text"
                           defaultValue="843-4359-4444"
                           readOnly={!isEditMode}
                           className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-bold text-gray-900 transition-colors`}
                           prefixElement={
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-4 bg-[#EB001B] rounded-[2px] relative flex items-center justify-center p-0.5">
                                    <div className="w-1/2 h-full bg-[#FF5F00] rounded-full absolute left-[30%] opacity-80 shadow-sm"></div>
                                    <div className="w-1/2 h-full bg-[#EB001B] rounded-full absolute right-[30%] opacity-80 shadow-sm"></div>
                                 </div>
                              </div>
                           }
                           suffixElement={
                              <Icon name="material-symbols_arrow-downward-rounded" folder="dashboardIcon" size="xs" className="text-gray-300" />
                           }
                        />
                     </div>

                     <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#1D3557]">Biography</label>
                        <div className="relative group">
                           <Textarea
                              rows={4}
                              placeholder="Enter a biography about you"
                              readOnly={!isEditMode}
                              className={`${!isEditMode ? "bg-gray-50/50" : "bg-white"} border-gray-50 text-xs font-medium text-gray-700 resize-none leading-relaxed transition-colors`}
                           />
                           <div className="absolute bottom-4 right-4 flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                              <Icon name="settings" folder="dashboardIcon" size="xs" className="cursor-pointer hover:text-gray-900" />
                              <Icon name="star" folder="dashboardIcon" size="xs" className="cursor-pointer hover:text-gray-900" />
                           </div>
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
               <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shadow-inner border border-blue-100">
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
                  <Button 
                     variant="primary" 
                     className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
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
                  console.log("Removing avatar...");
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
