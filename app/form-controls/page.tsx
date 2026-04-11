"use client";

import React, { useState } from "react";
import { Checkbox, Radio, Switch, Label } from "@/app/components/Form";

export default function FormControlsDemo() {
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(true);
  const [radio1, setRadio1] = useState("option1");
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl  p-16">
        <h1 className="text-5xl font-bold mb-16 text-black">Form - checks & radios</h1>

        <div className="flex flex-col gap-16">

          {/* Checkboxes Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-black">Checkboxes</h2>
            <div className="flex flex-col gap-10">
              <div className="flex gap-8">
                <Checkbox
                  label="Check label"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                />
                <Checkbox
                  label="Check label"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                />
              </div>

              <div>
                <Label className="mb-4">Label</Label>
                <div className="flex gap-8">
                  <Checkbox label="Option1" defaultChecked />
                  <Checkbox label="Option2" />
                </div>
              </div>
            </div>
          </section>

          {/* Radiobox Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-black">Radiobox</h2>
            <div className="flex flex-col gap-10">
              <div className="flex gap-8">
                <Radio
                  label="Radio label"
                  name="radio-demo-1"
                  checked={radio1 === "label1"}
                  onChange={() => setRadio1("label1")}
                />
                <Radio
                  label="Radio label"
                  name="radio-demo-1"
                  checked={radio1 === "label2"}
                  onChange={() => setRadio1("label2")}
                  defaultChecked
                />
              </div>

              <div>
                <Label className="mb-4">Label</Label>
                <div className="flex gap-8">
                  <Radio label="Option1" name="radio-demo-2" defaultChecked />
                  <Radio label="Option2" name="radio-demo-2" />
                </div>
              </div>
            </div>
          </section>

          {/* Switch Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-black">Switch</h2>
            <div className="flex gap-12">
              <Switch
                label="Switch label"
                checked={switch1}
                onChange={(e) => setSwitch1(e.target.checked)}
              />
              <Switch
                label="Switch label"
                checked={switch2}
                onChange={(e) => setSwitch2(e.target.checked)}
              />
            </div>
          </section>

          {/* Base Components Footer */}
          <section>
            <h3 className="text-gray-400 font-semibold mb-8 uppercase tracking-wider">Base components</h3>

            <div className="flex items-center gap-12">
              <div className="flex items-center gap-6 p-6 border border-dashed border-purple-200 rounded-lg">
                <Radio checked onChange={() => { }} />
                <Radio checked={false} onChange={() => { }} />
                <Checkbox checked onChange={() => { }} />
                <Checkbox checked={false} onChange={() => { }} />
                <Checkbox indeterminate onChange={() => { }} />
              </div>

              <div className="flex items-center gap-6 p-6 border border-dashed border-purple-200 rounded-lg">
                <Switch checked onChange={() => { }} />
                <Switch checked={false} onChange={() => { }} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
