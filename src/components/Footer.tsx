import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/suntech logo.png";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { usePublicContent } from "@/hooks/use-public-content";
import { getPhoneList, toPhoneHref, toWhatsappHref } from "@/lib/contact-utils";

const socialMeta = [
  { key: "facebook", label: "FB" },
  { key: "instagram", label: "IG" },
  { key: "linkedin", label: "LI" },
  { key: "youtube", label: "YT" },
] as const;

const Footer = () => {
  const { data } = usePublicContent();

  const companyProfile = data.companyProfile;
  const socialLinks = data.socialLinks;
  const phoneList = getPhoneList(companyProfile);
  const supportLine = phoneList[0] ?? companyProfile.phone;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      <div className="gradient-dark">
        <div className="floating-orb w-72 h-72 bg-solar-green/20 top-10 -right-20" style={{ animationDelay: "0s" }} />
        <div className="floating-orb w-48 h-48 bg-solar-orange/15 bottom-20 left-10" style={{ animationDelay: "3s" }} />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4">
                <img src={logo} alt={companyProfile.name} className="h-12 w-auto" />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-primary-foreground">
                {companyProfile.name.split(" ")[0]} <span className="text-gradient-solar">{companyProfile.name.split(" ").slice(1).join(" ")}</span>
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-primary-foreground/50">{companyProfile.footerBlurb}</p>
              <div className="flex gap-3">
                {socialMeta.map((item) => {
                  const href = socialLinks[item.key];

                  return href ? (
                    <a
                      key={item.key}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/8 text-xs font-bold text-primary-foreground/60 transition-all duration-300 hover:scale-110 hover:bg-solar-orange hover:text-primary-foreground hover:shadow-lg hover:shadow-secondary/20"
                    >
                      {item.label}
                    </a>
                  ) : null;
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-primary-foreground">Quick Links</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Home", path: "/" },
                  { label: "About Us", path: "/about" },
                  { label: "Projects", path: "/projects" },
                  { label: "Contact", path: "/contact" },
                ].map((link) => (
                  <Link key={`${link.label}-${link.path}`} to={link.path} className="group flex items-center gap-1 text-sm text-primary-foreground/50 transition-colors hover:text-solar-orange">
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-primary-foreground">Services</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Residential Solar", path: "/residential" },
                  { label: "Commercial Solar", path: "/commercial" },
                  { label: "Industrial Rooftops", path: "/commercial" },
                  { label: "Subsidy Guidance", path: "/contact" },
                ].map((link) => (
                  <Link key={`${link.label}-${link.path}`} to={link.path} className="group flex items-center gap-1 text-sm text-primary-foreground/50 transition-colors hover:text-solar-orange">
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-primary-foreground">Get In Touch</h4>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex items-start gap-3 text-primary-foreground/50">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/8">
                    <MapPin className="h-4 w-4 text-solar-orange" />
                  </div>
                  <span>{companyProfile.address}</span>
                </div>
                {phoneList.map((phone) => (
                  <a key={phone} href={toPhoneHref(phone)} className="group flex items-center gap-3 text-primary-foreground/50 transition-colors hover:text-solar-orange">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/8 transition-colors group-hover:bg-solar-orange/20">
                      <Phone className="h-4 w-4 text-solar-orange" />
                    </div>
                    {phone}
                  </a>
                ))}
                <a href={`mailto:${companyProfile.email}`} className="group flex items-center gap-3 text-primary-foreground/50 transition-colors hover:text-solar-orange">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/8 transition-colors group-hover:bg-solar-orange/20">
                    <Mail className="h-4 w-4 text-solar-orange" />
                  </div>
                  {companyProfile.email}
                </a>
                <a href={toWhatsappHref(companyProfile.whatsapp)} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-primary-foreground/50 transition-colors hover:text-solar-orange">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/8 transition-colors group-hover:bg-solar-orange/20">
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  </div>
                  WhatsApp: {companyProfile.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="grid gap-4 rounded-[1.5rem] border border-primary-foreground/10 bg-primary-foreground/[0.04] p-4 sm:grid-cols-2 sm:p-5">
            <div className="rounded-[1rem] bg-primary-foreground/[0.06] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Working Hours</div>
              <div className="mt-2 text-base font-bold text-primary-foreground">{companyProfile.workingHours}</div>
            </div>
            <div className="rounded-[1rem] bg-primary-foreground/[0.06] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Support Line</div>
              <a href={toPhoneHref(supportLine)} className="mt-2 block text-base font-bold text-primary-foreground transition-colors hover:text-solar-orange">
                {supportLine}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/8">
          <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 md:flex-row">
            <p className="text-xs text-primary-foreground/40">
              &copy; {currentYear} {companyProfile.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-primary-foreground/40">
              <a href="#privacy" className="transition-colors hover:text-primary-foreground/70">
                Privacy Policy
              </a>
              <a href="#terms" className="transition-colors hover:text-primary-foreground/70">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


