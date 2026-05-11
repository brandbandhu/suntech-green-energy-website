import { motion } from "framer-motion";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { usePublicContent } from "@/hooks/use-public-content";
import { toWhatsappHref } from "@/lib/contact-utils";

const WhatsAppButton = () => {
  const { data } = usePublicContent();

  return (
    <motion.a
      href={toWhatsappHref(data.companyProfile.whatsapp || data.companyProfile.phone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg hover:shadow-xl"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <WhatsAppIcon className="h-8 w-8 text-white" />
    </motion.a>
  );
};

export default WhatsAppButton;
