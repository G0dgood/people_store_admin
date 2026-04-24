"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { TabFilter } from "./TabFilter";
import { Select } from "../Form/Select";
import { Switch } from "../Form/Switch";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiTone: string;
  setAiTone: (tone: string) => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  aiTone,
  setAiTone,
}) => {
  // Internal states for toggles to make the component interactive
  const [autoFormat, setAutoFormat] = useState(true);
  const [inclusiveLanguage, setInclusiveLanguage] = useState(true);
  const [detailLevel, setDetailLevel] = useState("Standard");
  const [targetAudience, setTargetAudience] = useState("General");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Assistant Configuration"
      size="lg"
    >
      <ModalBody className="flex flex-col gap-8 py-4">
        {/* Tone Selection */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Assistant Tone
          </h4>
          <TabFilter
            tabs={["Professional", "Casual", "Luxury", "Technical"]}
            activeTab={aiTone}
            onChange={(tab) => setAiTone(tab as string)}
            fullWidth
          />
        </div>

        {/* Detail and Audience */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-black text-[#1D3557] uppercase tracking-widest">
              Detail Level
            </label>
            <Select
              shape="rounded-sm"
              value={detailLevel}
              options={[
                { label: "Concise", value: "Concise" },
                { label: "Standard", value: "Standard" },
                { label: "Elaborate", value: "Elaborate" },
              ]}
              onChange={(val) => setDetailLevel(val as string)}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-black text-[#1D3557] uppercase tracking-widest">
              Target Audience
            </label>
            <Select
              shape="rounded-sm"
              value={targetAudience}
              options={[
                { label: "General", value: "General" },
                { label: "Tech Savvy", value: "Tech Savvy" },
                { label: "Bargain Hunters", value: "Bargain Hunters" },
              ]}
              onChange={(val) => setTargetAudience(val as string)}
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-[6px] border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#1D3557]">
                Auto-format listicles
              </span>
              <span className="text-[10px] text-gray-400">
                Automatically convert listed items into bullet points.
              </span>
            </div>
            <Switch checked={autoFormat}
              onChange={(e) => setAutoFormat(e.target.checked)} />
          </div>
          <div className="h-px bg-gray-200/50" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#1D3557]">
                Inclusive Language
              </span>
              <span className="text-[10px] text-gray-400">
                Ensure the AI uses gender-neutral and inclusive terms.
              </span>
            </div>
            <Switch checked={inclusiveLanguage}
              onChange={(e) => setInclusiveLanguage(e.target.checked)} />
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-center gap-3 p-4 bg-brand-gold/5 rounded-[6px] border border-brand-gold/20">
          <Icon name="verified" folder="icon" size="sm" className="text-brand-gold" />
          <p className="text-[10px] font-medium text-brand-gold/80 leading-relaxed">
            These settings will persist across all product descriptions for this
            session to ensure a consistent brand voice.
          </p>
        </div>
      </ModalBody>

      <ModalFooter className="flex gap-3 pt-6 border-t border-gray-200">
        <Button
          shape="rounded-sm"
          variant="outline"
          className="flex-1"
          onClick={onClose}
        >
          Discard
        </Button>
        <Button
          shape="rounded-sm"
          variant="primary"
          className="flex-3"
          onClick={onClose}
        >
          Apply Configuration
        </Button>
      </ModalFooter>
    </Modal>
  );
};
