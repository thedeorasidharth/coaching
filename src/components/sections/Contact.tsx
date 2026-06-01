"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      desc: "2nd Floor, Krishna Prime Complex, Opposite Ambuja Cement, Gaushala Road, Sheoganj – 307027",
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      desc: "+91 9460234151 / +91 7976049149",
    },
    {
      icon: Clock,
      title: "Office Timings",
      desc: "3:00 PM to 7:00 PM (Monday - Saturday)",
    },
  ];

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-black text-navy mb-8">Get In Touch</h2>
            <p className="text-navy/60 mb-12 max-w-lg">
              Have questions? We&apos;re here to help. Visit our center or give us a call to discuss your child&apos;s future.
            </p>

            <div className="space-y-10">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">{item.title}</h4>
                    <p className="text-navy/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button 
                variant="primary" 
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] border-none"
                onClick={() => window.open("https://wa.me/919460234151", "_blank")}
              >
                <MessageCircle size={20} /> WhatsApp Now
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "tel:9460234151"}
              >
                Call Us
              </Button>
            </div>
          </motion.div>

          {/* Real Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[320px] sm:h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden glass shadow-2xl relative border-8 border-white"
          >
            <iframe
              title="EDUSPARK Sheoganj Center Location Map"
              src="https://maps.google.com/maps?q=Krishna%20Prime%20Complex%2C%20Gaushala%20Road%2C%20Sheoganj%20Rajasthan%20307027%20India&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Map Overlay HUD */}
            <div className="absolute bottom-4 left-4 right-4 glass p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10">
              <div>
                <p className="text-[10px] font-black text-primary uppercase mb-0.5">EDUSPARK CENTER</p>
                <p className="text-xs sm:text-sm font-bold text-navy">Gaushala Road, Sheoganj</p>
              </div>
              <Button 
                size="sm" 
                className="w-full sm:w-auto text-xs"
                onClick={() => window.open("https://www.google.com/maps/dir/?api=1&destination=Krishna%20Complex%2C%20Gaushala%20Road%2C%20Sheoganj%2C%20Rajasthan%20307027%2C%20India", "_blank")}
              >
                Directions
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
