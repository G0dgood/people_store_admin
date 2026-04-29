"use client";

import Image from "next/image";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Input, Textarea } from "@/app/components/Form/Inputs";
import { Button } from "@/app/components/Button";
import { HiPhone, HiEnvelope, HiMapPin } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCreateTicketMutation } from "@/lib/redux/services/ticketApi";
import { toast } from "sonner";

const ContactPage = () => {
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createTicket(formData).unwrap();
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({
        customerName: "",
        customerEmail: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
      <Header />

      <main className="flex-1 w-full bg-white">
        {/* Step 57: Contact Hero with Banner.png */}
        <section className="relative w-full h-[320px] md:h-[420px] overflow-hidden">
          <Image
            src="/ContactUs/Banner.png"
            alt="Contact Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D3557]/80 to-transparent flex items-center">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2"
              >
                <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-xs md:text-sm">Bloom & Mist Support</span>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">How can we <br /><span className="text-[#8CB7F5]">help you?</span></h1>
                <p className="text-white/80 text-sm md:text-base max-w-md mt-4 leading-relaxed">
                  Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            {/* Step 58: High-fidelity Contact Form section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-10"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-black text-[#1D3557] tracking-tight text-inter">Send us a message</h2>
                <p className="text-gray-500 text-sm md:text-base">Complete the form below and a member of our Bloom & Mist team will get back to you within 24 hours.</p>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="h-12 border-gray-200 focus:border-brand-blue bg-gray-50/30"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 border-gray-200 focus:border-brand-blue bg-gray-50/30"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</label>
                  <Input
                    type="text"
                    placeholder="Inquiry about Bloom & Mist services"
                    className="h-12 border-gray-200 focus:border-brand-blue bg-gray-50/30"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Message</label>
                  <Textarea
                    className="min-h-[160px] border-gray-200 focus:border-brand-blue bg-gray-50/30 shadow-none"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto px-12 py-4 h-auto text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100"
                  >
                    {isLoading ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Step 59: Contact Information & Info Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-12"
            >
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue-light flex items-center justify-center text-brand-blue flex-shrink-0 group-hover:scale-110 transition-transform">
                    <HiMapPin size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-[#1D3557] text-lg">Visit Us</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      123 Bloom Street, Mist Valley,<br />
                      Lagos, Nigeria 100001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue-light flex items-center justify-center text-brand-blue flex-shrink-0 group-hover:scale-110 transition-transform">
                    <HiPhone size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-[#1D3557] text-lg">Call Us</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Main Office: +234 800 BLOOM<br />
                      Support: +234 812 MIST CARE
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue-light flex items-center justify-center text-brand-blue flex-shrink-0 group-hover:scale-110 transition-transform">
                    <HiEnvelope size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-[#1D3557] text-lg">Email Us</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      General: hello@bloomandmist.com<br />
                      Support: support@bloomandmist.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Placeholder for Map */}
              <div className="w-full aspect-video rounded-md bg-gray-100 overflow-hidden relative group shadow-inner">
                <iframe
                  title="Bloom & Mist HQ Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126846.5056461955!2d3.310156!3d6.524379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e8ef04e17e476!2sLagos!5e0!3m2!1sen!2sng!4v1713430000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
                ></iframe>
                <div className="absolute top-4 left-4 pointer-events-none">
                  <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-tighter text-[#1D3557] shadow-sm border border-gray-200">
                    Bloom & Mist HQ
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>


      <Footer />
    </div>
  );
};

export default ContactPage;
