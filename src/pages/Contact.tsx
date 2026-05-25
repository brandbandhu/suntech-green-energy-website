import { motion } from "framer-motion";
import { Clock, IndianRupee, Mail, MapPin, Phone, ShieldCheck, Sun, Wrench } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import LeadForm from "@/components/LeadForm";
import PageBanner from "@/components/PageBanner";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { usePublicContent } from "@/hooks/use-public-content";
import { getPhoneList, toPhoneHref, toWhatsappHref } from "@/lib/contact-utils";

const Contact = () => {
  const { data } = usePublicContent();
  const location = useLocation();
  const selectedCity = useMemo(() => {
    const city = new URLSearchParams(location.search).get("city");
    if (city === "Pune" || city === "PCMC") {
      return city;
    }

    return null;
  }, [location.search]);
  const isPune = selectedCity === "Pune";

  const puneHighlights = [
    {
      icon: Sun,
      title: "Strong Solar Potential",
      detail: "Pune receives high annual sunlight, making rooftop generation practical for many homes.",
    },
    {
      icon: IndianRupee,
      title: "High Bill-Reduction Potential",
      detail: "Well-sized systems can reduce household electricity bills significantly, often in the 80-90% range.",
    },
    {
      icon: ShieldCheck,
      title: "Subsidy-Ready Planning",
      detail: "Residential projects can align with PM Surya Ghar norms, with capped subsidy support for eligible systems.",
    },
    {
      icon: Wrench,
      title: "Execution + Service Focus",
      detail: "Survey, install, and after-sales support are coordinated to keep performance stable over time.",
    },
  ];

  const punePriceRows = [
    { size: "2 kW", price: "Rs. 1.23 lakh approx" },
    { size: "3 kW", price: "Rs. 1.37 lakh approx" },
    { size: "4 kW", price: "Rs. 1.82 lakh approx" },
    { size: "5 kW", price: "Rs. 2.45 lakh approx" },
    { size: "10 kW", price: "Rs. 5.05 lakh approx" },
  ];

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
        title={isPune ? "Contact Pune Solar Team" : "Contact Us"}
        subtitle={isPune ? "Get Pune-specific rooftop pricing, subsidy guidance, and installation support." : "Get in touch with our solar experts"}
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Contact" }, ...(selectedCity ? [{ label: selectedCity }] : [])]}
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <motion.div className="h-full" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-lg">
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

                <div className="h-64 overflow-hidden rounded-2xl border border-border lg:min-h-[320px] lg:flex-1">
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
              </div>
            </motion.div>

            <motion.div className="h-full" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-lg">
                <h3 className="mb-6 text-xl font-bold text-foreground">Send Us a Message</h3>
                <LeadForm fillHeight />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {isPune ? (
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-8 shadow-lg md:p-10">
              <h2 className="text-3xl font-bold text-foreground">Pune Rooftop Solar Snapshot</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Quick overview for Pune homeowners based on publicly available market benchmarks and subsidy-aligned residential estimates.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {puneHighlights.map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-muted/35 p-4">
                    <item.icon className="h-5 w-5 text-primary" />
                    <h3 className="mt-2 text-base font-bold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4 md:p-6">
                <h3 className="text-lg font-bold text-foreground">Indicative Pune Residential Pricing (With Subsidy)</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-3 py-2 text-left font-semibold text-foreground">System Size</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Indicative Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {punePriceRows.map((row, index) => (
                        <tr key={row.size} className={index < punePriceRows.length - 1 ? "border-b border-border/70" : ""}>
                          <td className="px-3 py-2 text-foreground">{row.size}</td>
                          <td className="px-3 py-2 text-muted-foreground">{row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Indicative figures referenced from a Pune-focused rooftop solar page (as published for April 20, 2026). Final pricing varies by site conditions,
                  product selection, utility/discom charges, and installation scope.
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                Subsidy direction (residential): up to Rs. 30,000 for 1 kW, Rs. 60,000 for 2 kW, and capped around Rs. 78,000 for 3 kW and above under applicable
                PM Surya Ghar norms.
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Contact;
