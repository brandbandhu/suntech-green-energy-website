import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, X, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/suntech logo.png";
import { usePublicContent } from "@/hooks/use-public-content";
import { toPhoneHref } from "@/lib/contact-utils";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Residential", path: "/residential" },
  { label: "Commercial", path: "/commercial" },
  { label: "Projects", path: "/projects" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const { data } = usePublicContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const phoneHref = toPhoneHref(data.companyProfile.phone);
  const isLinkActive = (path: string) => {
    const [pathname, hash] = path.split("#");

    if (hash) {
      return location.pathname === pathname && location.hash === `#${hash}`;
    }

    if (pathname === "/about") {
      return location.pathname === pathname && location.hash !== "#reviews";
    }

    return location.pathname === pathname;
  };
  const navItems = navLinks.map((link) => ({ ...link, active: isLinkActive(link.path) }));

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen ? "border-b border-border bg-card/95 shadow-lg shadow-primary/5 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-18 items-center justify-between px-4 lg:h-20">
        <Link to="/" className="group flex items-center gap-2">
          <img src={logo} alt={data.companyProfile.name} className="h-10 w-auto transition-transform group-hover:scale-105 lg:h-12" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300 ${
                link.active
                  ? "text-primary"
                  : "text-solar-green hover:bg-solar-green/10 hover:text-solar-green"
              }`}
            >
              {link.label}
              {link.active ? (
                <motion.div layoutId="nav-active" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Pune rooftop solar
          </div>
          <a href={phoneHref} className="flex items-center gap-2 text-sm font-medium text-solar-green transition-colors hover:text-solar-green">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-3.5 w-3.5 text-primary" />
            </div>
            {data.companyProfile.phone}
          </a>
          <Link
            to="/contact"
            className="gradient-cta shine rounded-xl px-6 py-2.5 text-sm font-bold text-foreground shadow-lg shadow-secondary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-secondary/30"
          >
            Book Site Visit
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-xl border border-solar-green/20 bg-solar-green/10 p-2.5 text-solar-green transition-all hover:bg-solar-green/15 lg:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-white shadow-xl shadow-primary/5 lg:hidden"
          >
            <div className="container mx-auto flex flex-col gap-1.5 px-4 py-4">
              {navItems.map((link, index) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link
                    to={link.path}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      link.active
                        ? "border border-solar-green/20 bg-solar-green/10 text-solar-green"
                        : "text-solar-green hover:bg-solar-green/5"
                    }`}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 text-solar-green opacity-40" />
                  </Link>
                </motion.div>
              ))}
              <div className="mt-2 border-t border-border pt-3">
                <a href={phoneHref} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-solar-green/90">
                  <Phone className="h-4 w-4 text-solar-green" /> {data.companyProfile.phone}
                </a>
                <Link
                  to="/contact"
                  className="mt-2 block rounded-xl bg-solar-green px-4 py-3 text-center text-sm font-bold text-primary-foreground shadow-lg transition-colors hover:bg-solar-green/90"
                >
                  Book Site Visit
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Header;
