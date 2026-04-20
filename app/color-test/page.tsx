import React from 'react';

export default function DesignSystemVerificationPage() {
  const neutrals = [
    { name: 'neutral-900', class: 'bg-neutral-900', hex: '#1A1A1A' },
    { name: 'neutral-700', class: 'bg-neutral-700', hex: '#404040' },
    { name: 'neutral-500', class: 'bg-neutral-500', hex: '#8D99AE' },
    { name: 'neutral-300', class: 'bg-neutral-300', hex: '#B0B9C1' },
    { name: 'neutral-200', class: 'bg-neutral-200', hex: '#D8E2DC' },
    { name: 'neutral-100', class: 'bg-neutral-100', hex: '#F4F7F6' },
    { name: 'neutral-50', class: 'bg-neutral-50', hex: '#FFFFFF', border: 'border border-neutral-200' },
  ];

  const brands = [
    { name: 'brand-blue', class: 'bg-brand-blue', light: 'bg-brand-blue-light' },
    { name: 'brand-green', class: 'bg-brand-green', light: 'bg-brand-green-light' },
    { name: 'brand-orange', class: 'bg-brand-orange', light: 'bg-brand-orange-light' },
    { name: 'brand-gold', class: 'bg-brand-gold', light: 'bg-brand-gold-light' },
  ];

  const cursors = [
    { name: 'default', class: 'cursor-default' },
    { name: 'pointer', class: 'cursor-pointer' },
    { name: 'text', class: 'cursor-text' },
    { name: 'grab', class: 'cursor-grab' },
    { name: 'grabbing', class: 'cursor-grabbing' },
    { name: 'zoom-in', class: 'cursor-zoom-in' },
    { name: 'zoom-out', class: 'cursor-zoom-out' },
    { name: 'move', class: 'cursor-move' },
    { name: 'alias', class: 'cursor-alias' },
    { name: 'no-drop', class: 'cursor-no-drop' },
    { name: 'copy', class: 'cursor-copy' },
    { name: 'row-resize', class: 'cursor-row-resize' },
    { name: 'col-resize', class: 'cursor-col-resize' },
    { name: 'nwse-resize', class: 'cursor-nwse-resize' },
    { name: 'nesw-resize', class: 'cursor-nesw-resize' },
    { name: 'n-resize', class: 'cursor-n-resize' },
    { name: 'e-resize', class: 'cursor-e-resize' },
    { name: 's-resize', class: 'cursor-s-resize' },
    { name: 'w-resize', class: 'cursor-w-resize' },
    { name: 'vertical-text', class: 'cursor-vertical-text' },
  ];

  return (
    <div className="p-12 space-y-20 bg-white min-h-screen max-w-6xl mx-auto pb-32">
      <header className="border-b border-neutral-200 pb-10">
        <h1 className="h1 mb-2">Design System Verification</h1>
        <p className="text-muted">A comprehensive audit of integrated colors, typography, and interactive behaviors.</p>
      </header>

      {/* Typography Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="h2 text-neutral-900 underline decoration-brand-blue decoration-4 underline-offset-8">Typography Hierarchy</h2>
          <span className="px-4 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-body-xs font-bold tracking-wider uppercase border border-neutral-200">System Fonts</span>
        </div>

        <div className="space-y-10 border rounded-3xl p-10 border-neutral-200 bg-neutral-50/30">
          <div className="space-y-2">
            <h1 className="h1">H1 Heading text</h1>
            <p className="text-body-xs text-neutral-400 font-mono tracking-widest uppercase">Outfit Bold / 36px / -0.02em</p>
          </div>

          <div className="space-y-2">
            <h2 className="h2">H2 Heading text</h2>
            <p className="text-body-xs text-neutral-400 font-mono tracking-widest uppercase">Outfit Bold / 30px / -0.01em</p>
          </div>

          <div className="space-y-2">
            <h3 className="h3">H3 Heading text</h3>
            <p className="text-body-xs text-neutral-400 font-mono tracking-widest uppercase">Outfit Bold / 24px</p>
          </div>

          <div className="space-y-6 pt-10 border-t border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <p className="text-body-sm font-bold text-neutral-900 border-l-4 border-brand-blue pl-3 bg-brand-blue-light/20 py-1">Body default - 16px</p>
                <p className="text-body leading-relaxed">
                  What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                </p>
                <p className="text-muted italic">Inter Regular / 16px / Muted Color</p>
              </div>

              <div className="space-y-3">
                <p className="text-body-sm font-bold text-neutral-900 border-l-4 border-brand-green pl-3 bg-brand-green-light/20 py-1">Body small - 14px</p>
                <p className="text-body-sm leading-normal">
                  What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                </p>
                <p className="text-body-sm text-muted italic">Inter Regular / 14px</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-body-sm font-bold text-neutral-900 border-l-4 border-brand-orange pl-3 bg-brand-orange-light/20 py-1">Body micro - 12px</p>
              <p className="text-body-xs leading-normal">
                What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </p>
              <p className="text-body-xs text-muted italic text-[10px] tracking-wider uppercase">Inter Regular / 12px</p>
            </div>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="space-y-8">
        <h2 className="h2 text-neutral-900 underline decoration-brand-green decoration-4 underline-offset-8">Color Palette</h2>

        <div className="space-y-6">
          <h3 className="h3 text-neutral-700">Neutrals</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6">
            {neutrals.map((color) => (
              <div key={color.name} className="group space-y-3">
                <div className={`h-24 w-full rounded-2xl  transition-transform group-hover:scale-105 duration-200 ${color.class} ${color.border || ''}`} />
                <div className="text-center px-1">
                  <p className="text-xs font-bold text-neutral-900 tracking-tight">{color.name}</p>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <h3 className="h3 text-neutral-700">Brand Elements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {brands.map((color) => (
              <div key={color.name} className="flex flex-col gap-4 p-6 rounded-3xl border border-neutral-100 bg-white shadow-xl shadow-neutral-900/[0.02] hover:shadow-brand-blue/5 transition-all">
                <div className="flex gap-2 h-20">
                  <div className={`flex-1 rounded-xl ${color.class}`} />
                  {color.light && <div className={`w-12 rounded-xl border border-neutral-50 ${color.light}`} />}
                </div>
                <p className="text-sm font-black text-neutral-900 text-center tracking-widest uppercase">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cursors Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="h2 text-neutral-900 underline decoration-brand-orange decoration-4 underline-offset-8">System Cursors</h2>
          <p className="text-sm font-medium text-neutral-500 italic">Hover to test cursor behavior</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {cursors.map((cursor) => (
            <div
              key={cursor.name}
              className={`flex flex-col items-center justify-center h-32 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-brand-blue hover:shadow-lg transition-all group ${cursor.class}`}
            >
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest group-hover:text-brand-blue mb-1">Cursor</p>
              <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-900">{cursor.name}</p>
              <div className="mt-4 w-6 h-6 rounded-full bg-neutral-200 group-hover:bg-brand-blue-light transition-colors" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
