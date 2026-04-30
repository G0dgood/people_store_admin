"use client";

import React, { useState } from "react";
import {
  Uploader,
  RangeSlider,
  InlineField,
  FloatingInput,
  FloatingTextarea,
  Input,
  Select,
  Radio
} from "@/app/components/Form";
import { Icon } from "@/app/components/Icon";

export default function FormOtherDemo() {
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);
  const [radioValue, setRadioValue] = useState("second");

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl  p-16 text-black">
        <h1 className="text-5xl font-bold mb-16">Form - Other</h1>

        <div className="flex flex-col gap-20">

          {/* Uploader Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8">Uploader</h2>
            <div className="flex gap-4">
              <Uploader variant="dashed" />
              <Uploader variant="solid" icon="photo" />
            </div>
          </section>

          {/* Range Slider Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8">Number, range</h2>
            <RangeSlider
              min={0}
              max={100}
              value={rangeValue}
              onChange={setRangeValue}
            />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {/* Inline Label Section */}
            <section>
              <h2 className="text-2xl font-bold mb-8">Inline label</h2>
              <div className="flex flex-col gap-6">
                <InlineField label="Label">
                  <Input placeholder="Type here" className="max-w-[200px]" />
                </InlineField>

                <InlineField label="Choose me">
                  <Select
                    options={[{ value: "1", label: "Option 1" }]}
                    value="1"
                    onChange={() => { }}
                    className="max-w-[200px]"
                  />
                </InlineField>

                <InlineField label="Your option" className="items-start">
                  <div className="flex flex-col gap-3 pt-1">
                    <Radio
                      label="First variant"
                      checked={radioValue === "first"}
                      onChange={() => setRadioValue("first")}
                    />
                    <Radio
                      label="Second variant"
                      checked={radioValue === "second"}
                      onChange={() => setRadioValue("second")}
                    />
                    <Radio
                      label="One more"
                      checked={radioValue === "third"}
                      onChange={() => setRadioValue("third")}
                    />
                  </div>
                </InlineField>
              </div>
            </section>

            {/* Floating Input Section */}
            <section>
              <h2 className="text-2xl font-bold mb-8">Floating input</h2>
              <div className="flex flex-col gap-8 max-w-sm">
                <div>
                  <span className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Label name</span>
                  {/* Normal label above for the design's first item */}
                  <Input placeholder="" className="placeholder:text-transparent" />
                </div>

                <FloatingInput label="Label name" defaultValue="Text" />

                <FloatingInput
                  label="Label name"
                  defaultValue="Text"
                  suffixElement={
                    <div className="flex gap-1.5 mr-1">
                      <div className="w-5 h-5 rounded bg-brand-gold" />
                      <div className="w-5 h-5 rounded bg-brand-gold" />
                    </div>
                  }
                />

                <FloatingTextarea label="Label name" defaultValue="Textarea" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
