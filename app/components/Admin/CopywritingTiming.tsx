import React from "react";
import Dropdown from "../Form/Dropdown";
import { Button } from "../Button";
import Checkbox from "../Checkbox";
import { Label, Input } from "../Form";
import { AdvertConfig } from "@/lib/redux/services/advertApi";

interface CopywritingTimingProps {
  config: AdvertConfig;
  activeVisualIndex: number | null;
  setConfig: React.Dispatch<React.SetStateAction<AdvertConfig | null>>;
  setActiveVisualIndex: (index: number | null) => void;
}

export const CopywritingTiming: React.FC<CopywritingTimingProps> = ({
  config,
  activeVisualIndex,
  setConfig,
  setActiveVisualIndex,
}) => {
  return (
    <section className="bg-white p-8 rounded-[6px] border border-gray-200   flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-[#1D3557] flex items-center gap-2">
          <span className="w-8 h-8 rounded-[4px] bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xs">01</span>
          Feature Copy & Timing
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-1.5 ">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none italic">Targeting Atmosphere</span>
            <Dropdown
              options={[
                { value: "global", label: "Global Defaults (Sequence)" },
                ...config.backgroundImages.map((bg, i) => ({ value: i.toString(), label: `Atmosphere ${i + 1}` }))
              ]}
              value={activeVisualIndex === null ? "global" : activeVisualIndex.toString()}
              onChange={(val) => setActiveVisualIndex(val === "global" ? null : parseInt(val))}
              size="sm"
              className="min-w-[180px]"
            />
          </div>
          {activeVisualIndex !== null && (
            <Button shape="rounded-sm" variant="outline"
              className="text-[10px] py-1 h-9 px-4"
              onClick={() => {
                const newBgs = [...config.backgroundImages];
                newBgs[activeVisualIndex] = {
                  ...newBgs[activeVisualIndex],
                  title: undefined,
                  titleHighlight: undefined,
                  description: undefined,
                  stats: undefined,
                  duration: undefined
                };
                setConfig({ ...config, backgroundImages: newBgs });
              }}
            >
              Reset Slide
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={config.showTitle}
                  onChange={(checked) => setConfig({ ...config, showTitle: checked })}
                  size="md"
                />
                <Label className={`!mb-0 text-[10px] font-black uppercase tracking-widest transition-opacity ${!config.showTitle ? "text-gray-300" : "text-brand-gold/60"}`}>Main Title</Label>
              </div>
              <div className={`transition-opacity duration-300 ${!config.showTitle ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
                <Input shape="rounded-sm"
                  value={activeVisualIndex === null ? config.title : (config.backgroundImages[activeVisualIndex]?.title || "")}
                  onChange={(e) => {
                    if (activeVisualIndex === null) {
                      setConfig({ ...config, title: e.target.value });
                    } else {
                      const newBgs = [...config.backgroundImages];
                      newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], title: e.target.value };
                      setConfig({ ...config, backgroundImages: newBgs });
                    }
                  }}
                  placeholder={activeVisualIndex === null ? "e.g. Master Your" : `Default: ${config.title}`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={config.showHighlight}
                  onChange={(checked) => setConfig({ ...config, showHighlight: checked })}
                  size="md"
                />
                <Label className={`!mb-0 text-[10px] font-black uppercase tracking-widest transition-opacity ${!config.showHighlight ? "text-gray-300" : "text-brand-gold/60"}`}>Highlighted Title</Label>
              </div>
              <div className={`transition-opacity duration-300 ${!config.showHighlight ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
                <Input shape="rounded-sm"
                  value={activeVisualIndex === null ? config.titleHighlight : (config.backgroundImages[activeVisualIndex]?.titleHighlight || "")}
                  onChange={(e) => {
                    if (activeVisualIndex === null) {
                      setConfig({ ...config, titleHighlight: e.target.value });
                    } else {
                      const newBgs = [...config.backgroundImages];
                      newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], titleHighlight: e.target.value };
                      setConfig({ ...config, backgroundImages: newBgs });
                    }
                  }}
                  placeholder={activeVisualIndex === null ? "e.g. Command." : `Default: ${config.titleHighlight}`}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={config.showDescription}
                onChange={(checked) => setConfig({ ...config, showDescription: checked })}
                size="md"
              />
              <Label className={`!mb-0 text-[10px] font-black uppercase tracking-widest transition-opacity ${!config.showDescription ? "text-gray-300" : "text-brand-gold/60"}`}>Description Text</Label>
            </div>
            <div className={`transition-opacity duration-300 ${!config.showDescription ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
              <Input shape="rounded-sm"
                value={activeVisualIndex === null ? config.description : (config.backgroundImages[activeVisualIndex]?.description || "")}
                onChange={(e) => {
                  if (activeVisualIndex === null) {
                    setConfig({ ...config, description: e.target.value });
                  } else {
                    const newBgs = [...config.backgroundImages];
                    newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], description: e.target.value };
                    setConfig({ ...config, backgroundImages: newBgs });
                  }
                }}
                placeholder={activeVisualIndex === null ? "Describe your platform brilliance..." : `Default: ${config.description}`}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={config.showStats}
                onChange={(checked) => setConfig({ ...config, showStats: checked })}
                size="md"
              />
              <Label className={`!mb-0 text-[10px] font-black uppercase tracking-widest transition-opacity ${!config.showStats ? "text-gray-300" : "text-brand-gold/60"}`}>Platform Stats</Label>
            </div>
            <div className={`transition-opacity duration-300 ${!config.showStats ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
              <Input shape="rounded-sm"
                value={activeVisualIndex === null ? config.stats : (config.backgroundImages[activeVisualIndex]?.stats || "")}
                onChange={(e) => {
                  if (activeVisualIndex === null) {
                    setConfig({ ...config, stats: e.target.value });
                  } else {
                    const newBgs = [...config.backgroundImages];
                    newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], stats: e.target.value };
                    setConfig({ ...config, backgroundImages: newBgs });
                  }
                }}
                placeholder={activeVisualIndex === null ? "e.g. Powering 12,400+ stores..." : `Default: ${config.stats}`}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-[6px] border border-gray-200 flex flex-col gap-6 justify-center">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-[#1D3557] uppercase tracking-widest">
              {activeVisualIndex === null ? "Global Cycle Duration" : `Atmosphere ${activeVisualIndex + 1} Timing Override`}
            </label>
            <p className="text-[10px] text-gray-400 font-medium">
              {activeVisualIndex === null
                ? "How many seconds should each background image stay before cycling?"
                : `Override the global timing for this specific atmosphere.`}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <input
              type="range"
              min="2"
              max="30"
              value={activeVisualIndex === null ? config.cycleDuration : (config.backgroundImages[activeVisualIndex]?.duration || config.cycleDuration)}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (activeVisualIndex === null) {
                  setConfig({ ...config, cycleDuration: val });
                } else {
                  const newBgs = [...config.backgroundImages];
                  newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], duration: val };
                  setConfig({ ...config, backgroundImages: newBgs });
                }
              }}
              className="flex-1 accent-brand-gold"
            />
            <span className="w-16 h-12 bg-white rounded-[4px] border border-gray-200 flex items-center justify-center font-black text-brand-gold text-lg">
              {activeVisualIndex === null ? config.cycleDuration : (config.backgroundImages[activeVisualIndex]?.duration || config.cycleDuration)}s
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
