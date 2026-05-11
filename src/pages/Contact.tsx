import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import PageBanner from "@/components/PageBanner";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { usePublicContent } from "@/hooks/use-public-content";
import { getPhoneList, toPhoneHref, toWhatsappHref } from "@/lib/contact-utils";

const Contact = () => {
  const { data } = usePublicContent();

  const contactInfo = [
    { icon: MapPin, title: "Address", value: data.companyProfile.address },
    ...getPhoneList(data.companyProfile).map((phone, index) => ({
      icon: Phone,
      title: index === 0 ? "Mobile Number" : "Alternate Mobile",
      value: phone,
      href: toPhoneHref(phone),
    })),
    { icon: Mail, title: "Email", value: data.companyProfile.email, href: `mailto:${data.companyProfile.email}` },
    { icon: WhatsAppIcon, title: "WhatsApp", value: data.companyProfile.whatsapp, href: toWhatsappHref(data.companyProfile.whatsapp) },
    { icon: Clock, title: "Working Hours", value: data.companyProfile.workingHours },
  ];

  return (
    <div>
      <PageBanner
        title="Contact Us"
        subtitle="Get in touch with our solar experts"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Contact" }]}
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="mb-6 text-3xl font-bold text-foreground">Get In Touch</h2>
              <div className="mb-8 space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-64 overflow-hidden rounded-2xl border border-border">
                <iframe
                  src={data.companyProfile.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${data.companyProfile.name} Location`}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                <h3 className="mb-6 text-xl font-bold text-foreground">Send Us a Message</h3>
                <LeadForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
