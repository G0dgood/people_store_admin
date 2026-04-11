"use client";

import { Alert, Avatar, Rating, PaymentIcons, StoreButtons } from "@/app/components/Other";
import { Badge } from "@/app/components/Badge";

export default function OtherDemo() {
  return (
    <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl  p-16">
        <h1 className="text-5xl font-bold mb-16 text-black">Other</h1>

        {/* Section: Alert */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-black">Alert</h2>
          <div className="flex flex-col gap-12 p-8 border border-dashed border-purple-200 rounded-xl w-fit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4 w-[320px]">
                <Alert variant="error" title="Error" description="Long sample text" onClose={() => { }} />
                <Alert variant="success" title="Success" description="Long sample text" onClose={() => { }} />
                <Alert variant="warning" title="Warning" description="Long sample text" onClose={() => { }} />
              </div>
              <div className="flex flex-col gap-4 w-[280px]">
                <Alert variant="error" title="Error" onClose={() => { }} />
                <Alert variant="success" title="Success" onClose={() => { }} />
                <Alert variant="warning" title="Warning" onClose={() => { }} />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Avatars */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-black">Avatars</h2>
          <div className="flex items-center gap-6 p-8 border border-dashed border-purple-200 rounded-xl w-fit">
            <Avatar src="" /> {/* Placeholder icon */}
            <Avatar src="/avatars/avatar=pic1.jpg" />
            <Avatar src="/avatars/avatar=pic2.png" />
            <Avatar src="/avatars/avatar=pic3.png" />
            <Avatar src="/avatars/avatar=pic4.png" />
            <Avatar src="/avatars/avatar=pic5.png" />
          </div>
        </section>

        {/* Section: Badge */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-black">Badge</h2>
          <div className="flex items-center gap-4">
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="neutral">Cancel</Badge>
            <Badge variant="dot">8</Badge>
          </div>
        </section>

        {/* Section: Misc */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-black">Misc</h2>
          <div className="flex flex-col gap-12">
            <PaymentIcons />
            <StoreButtons />
            <div className="flex items-center gap-8 py-4 px-6 border border-dashed border-purple-200 rounded-xl w-fit">
              <Rating value={4} />
              <Rating value={2.5} />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
