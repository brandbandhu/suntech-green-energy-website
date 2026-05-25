import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  CircleDollarSign,
  Factory,
  Home,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Wrench,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import SectionHeading from "@/components/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroCommercial from "@/assets/hero-commercial.jpg";
import customerSatisfactionIcon from "@/assets/customer_satisfaction-removebg-preview.png";
import experienceIcon from "@/assets/experience-removebg-preview.png";
import heroHomeBanner from "@/assets/hero-home-banner.jpg";
import heroIndustrial from "@/assets/hero-industrial.jpg";
import heroResidential from "@/assets/hero-residential.jpg";
import homeSolarizeIcon from "@/assets/home_solarize-removebg-preview.png";
import powerInstalledIcon from "@/assets/power_installed-removebg-preview.png";
import { usePublicContent } from "@/hooks/use-public-content";
import { resolveContentImageUrl } from "@/lib/default-content";

const solutionCards = [
  {
    title: "Residential rooftop solar",
    eyebrow: "For homes",
    description:
      "Clean rooftop planning for villas, bungalows, and family homes that want visible bill relief without a messy installation experience.",
    image: heroResidential,
    link: "/residential",
    icon: Home,
    highlights: ["Subsidy-first planning", "Cleaner cable routing", "Lower monthly bill pressure"],
  },
  {
    title: "Commercial solar systems",
    eyebrow: "For businesses",
    description:
      "Daytime load-focused systems for schools, offices, clinics, and retail sites that need practical savings and stronger proposal clarity.",
    image: heroCommercial,
    link: "/commercial",
    icon: Building2,
    highlights: ["Faster proposal clarity", "Load-based sizing", "Smarter operating-cost control"],
  },
  {
    title: "Industrial rooftop solar",
    eyebrow: "For factories",
    description:
      "Structure-aware, output-focused solar for warehouses and sheds where safety, uptime, and long-term performance matter the most.",
    image: heroIndustrial,
    link: "/commercial",
    icon: Factory,
    highlights: ["Structure-first execution", "Large roof planning", "High daytime usage advantage"],
  },
];

const heroBackgroundImage = heroHomeBanner;

const heroQuickCards = [
  {
    icon: IndianRupee,
    title: "Savings-led proposals",
    description: "Bill-based recommendation.",
  },
  {
    icon: ShieldCheck,
    title: "Subsidy guidance",
    description: "Simple process support.",
  },
  {
    icon: Wrench,
    title: "After-install support",
    description: "Help after handover.",
  },
];

const whyChooseCards = [
  {
    icon: ShieldCheck,
    title: "Trusted execution standards",
    description: "Every rooftop design is planned with clean alignment, secure mounting, and neat cable routing for a premium finish.",
  },
  {
    icon: Sparkles,
    title: "End-to-end project clarity",
    description: "From site survey to commissioning, we keep each step transparent so your family or committee can decide confidently.",
  },
  {
    icon: IndianRupee,
    title: "Savings-focused recommendations",
    description: "System sizing is matched to your real consumption, roof area, and budget so payback and savings stay practical.",
  },
  {
    icon: Wrench,
    title: "Reliable after-install support",
    description: "Our team stays available beyond installation for performance checks, service guidance, and long-term peace of mind.",
  },
];

const faqItems = [
  {
    question: "What is the cost of rooftop solar in Pune?",
    answer:
      "Final cost depends on system size, roof type, and component selection. Most homes and societies get a clear quote after site survey and load analysis.",
  },
  {
    question: "How much electricity bill can I save with solar?",
    answer:
      "Savings usually depend on your monthly usage and system size. In many cases, rooftop solar can reduce bills significantly after commissioning.",
  },
  {
    question: "Do you provide solar installation for housing societies?",
    answer:
      "Yes. We support housing society projects with site survey, load planning, proposal, installation, and post-installation service support.",
  },
  {
    question: "Is subsidy available for home solar?",
    answer:
      "Subsidy may be available for eligible residential installations based on current government norms. Our team helps you understand the latest process and documentation.",
  },
  {
    question: "How much time does solar installation take?",
    answer:
      "Timelines vary by project size and approvals, but most home projects move quickly once survey, design confirmation, and paperwork are completed.",
  },
  {
    question: "Do you provide service after installation?",
    answer:
      "Yes. We provide after-sales support for system performance, maintenance guidance, and service coordination whenever needed.",
  },
];

const calculatorBillPresets = [2000, 4000, 6000, 8000, 12000, 20000];

const AnimatedCounter = ({
  target,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let frame = 0;
    let startedAt = 0;

    const step = (timestamp: number) => {
      if (!startedAt) {
        startedAt = timestamp;
      }

      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setValue(target * easedProgress);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [duration, isInView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(value).toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const Index = () => {
  const { data } = usePublicContent();
  const [calculatorBill, setCalculatorBill] = useState(6000);
  const [hasLoadShedding, setHasLoadShedding] = useState<boolean | null>(null);
  const [needsHeavyDutyStructure, setNeedsHeavyDutyStructure] = useState(false);
  const [includeMsebPaperwork, setIncludeMsebPaperwork] = useState(true);
  const [calculatorAddress, setCalculatorAddress] = useState("");

  const { companyProfile } = data;
  const preferredProjects = data.projects.filter((project) => project.isFeatured !== false);
  const featuredProjects = (preferredProjects.length > 0 ? preferredProjects : data.projects).slice(0, 3);

  const recommendedKw = Math.max(calculatorBill / 800, 0);
  const subsidy = Math.min(recommendedKw <= 1 ? 30000 : recommendedKw <= 2 ? 60000 : 78000, 78000);
  const systemType = hasLoadShedding ? "Hybrid + Battery" : "On-Grid";
  const batteryBackupAddon = hasLoadShedding ? recommendedKw * 25000 : 0;
  const heavyDutyAddon = needsHeavyDutyStructure ? recommendedKw * 3000 : 0;
  const annualSavings = calculatorBill * 12 * (needsHeavyDutyStructure ? 1.03 : 1);
  const estimatedInvestment = recommendedKw * 58000 + batteryBackupAddon + heavyDutyAddon;
  const investmentAfterSubsidy = Math.max(estimatedInvestment - subsidy, 0);
  const paybackYears = annualSavings > 0 ? investmentAfterSubsidy / annualSavings : 0;
  const roofAreaSqFt = recommendedKw * 100;

  const formatCurrency = (amount: number) => `₹${Math.round(amount).toLocaleString("en-IN")}`;

  const proofStats = [
    {
      label: "Homes Solarized",
      countTo: 500,
      suffix: "+",
      detail: "Trusted installations delivered for families across Pune and nearby service areas.",
      iconImage: homeSolarizeIcon,
    },
    {
      label: "Power Installed",
      countTo: 1,
      suffix: " MW",
      detail: "Total rooftop capacity installed with quality-driven engineering and execution standards.",
      iconImage: powerInstalledIcon,
    },
    {
      label: "Customer Satisfaction",
      countTo: 100,
      suffix: "%",
      detail: "Trusted service experience with quality execution and dependable support.",
      iconImage: customerSatisfactionIcon,
    },
    {
      label: "Portfolio Highlights",
      countTo: Math.max(featuredProjects.length, 1),
      detail: "Real project cards showcasing installation quality and location coverage.",
      iconImage: experienceIcon,
    },
  ];

  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden pb-16 pt-5 md:pb-24 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <img
            src={heroBackgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[56%_center] md:object-[62%_center]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,18,0.9)_0%,rgba(4,10,18,0.8)_28%,rgba(4,10,18,0.56)_58%,rgba(4,10,18,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,13,24,0.16),rgba(5,13,24,0.46)_54%,rgba(5,13,24,0.84))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,178,42,0.16),transparent_20%),radial-gradient(circle_at_82%_18%,rgba(17,134,91,0.14),transparent_18%)]" />
        </div>

        <div className="absolute inset-0 solar-grid opacity-30" />
        <div className="sunbeam left-[8%] top-14 h-52 w-52 bg-solar-yellow/20" />
        <div className="sunbeam right-[10%] top-24 h-72 w-72 bg-solar-orange/15" style={{ animationDelay: "1.8s" }} />
        <div className="sunbeam bottom-0 left-1/3 h-80 w-80 bg-solar-green/20" style={{ animationDelay: "0.9s" }} />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <h1 className="mt-2 max-w-4xl text-2xl font-extrabold leading-[1.02] text-primary-foreground md:text-4xl lg:text-5xl">
                Solar in Pune, designed around savings instead of sales pressure.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/[0.78] md:text-lg">
                Suntech Green Energy delivers rooftop solar for homes, businesses, and industries with clear guidance, clean execution, and
                smooth support from site survey to activation.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="gradient-cta shine inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-sm font-bold text-foreground shadow-[0_18px_50px_rgba(255,164,28,0.24)] transition-all hover:scale-[1.02]"
                >
                  Book Free Solar Visit
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-2xl border border-primary-foreground/[0.18] px-7 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  Explore Rooftop Projects
                </Link>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {heroQuickCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    className="glass-dark rounded-2xl px-4 py-4"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.16 + index * 0.06 }}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                      <card.icon className="h-4 w-4 text-solar-yellow" />
                    </div>
                    <h2 className="mt-3 text-sm font-bold text-primary-foreground">{card.title}</h2>
                    <p className="mt-1 text-xs text-primary-foreground/70">{card.description}</p>
                  </motion.div>
                ))}
              </div>

            </motion.div>

            <motion.div
              className="relative mx-auto w-full max-w-xl lg:mr-0"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
            >
              <motion.div
                className="pulse-border absolute right-0 top-0 hidden w-72 rounded-[1.5rem] border border-white/[0.16] bg-white/[0.12] px-4 py-3 text-primary-foreground backdrop-blur-xl md:block"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/[0.7]">Savings direction</div>
                <div className="mt-1 text-lg font-extrabold">Up to 70-90% bill offset</div>
              </motion.div>

              <div className="absolute -inset-6 rounded-[2.4rem] bg-white/[0.12] blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.14] bg-white/[0.96] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-8">
                <div className="absolute inset-x-0 top-0 h-1.5 gradient-cta" />

                <div className="mt-6">
                  <LeadForm compact showConsultationHeader />
                </div>

                <div className="mt-5 rounded-[1.5rem] bg-[#eaf2ff] p-3.5">
                  <div className="flex items-center gap-3 rounded-2xl bg-[#e8f2ff] p-3 sm:gap-4 sm:p-4">
                    <img
                      src={heroResidential}
                      alt="Solar calculator"
                      className="h-16 w-28 rounded-xl object-cover sm:h-20 sm:w-32"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="text-[0.88rem] font-extrabold text-[#1d2942] sm:text-[1.35rem] sm:leading-tight">Curious about solar savings?</div>
                      <a
                        href="#solar-calculator"
                        className="mt-2 inline-flex items-center gap-2 text-[0.82rem] font-bold text-[#1f35b3] transition-colors hover:text-[#1a2b8e] sm:text-base"
                      >
                        Try Solar Calculator
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {proofStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="lift-card rounded-[1.75rem] border border-border/70 bg-card p-6 text-center shadow-[0_16px_40px_rgba(12,22,36,0.09)] backdrop-blur-xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
              >
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgba(27,151,94,0.2),rgba(27,151,94,0.08))] ring-1 ring-primary/25 shadow-[0_10px_24px_rgba(12,22,36,0.14)]">
                  <img src={stat.iconImage} alt={`${stat.label} icon`} className="h-7 w-7 object-contain" loading="lazy" />
                </div>
                <div className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</div>
                <div className="mt-3 text-4xl font-extrabold leading-none text-primary">
                  <AnimatedCounter target={stat.countTo} suffix={stat.suffix} />
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{stat.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <SectionHeading
                title="About Suntech Green Energy"
                subtitle="At Suntech Green Energy, we have been delivering dependable solar energy solutions since 2020 with a commitment to quality, transparency, and customer satisfaction. Our goal is to make clean and cost-effective solar power accessible for homes, commercial spaces, and industries through expert consultation, advanced technology, and efficient project execution tailored to every customer’s energy needs."
                center={false}
              />
            </div>

            <motion.div
              className="relative overflow-hidden rounded-[2rem] gradient-dark shadow-[0_18px_60px_rgba(10,20,32,0.18)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="sunbeam -right-10 top-0 h-36 w-36 bg-solar-orange/[0.18]" />
              <div className="relative z-10 overflow-hidden rounded-[2rem]">
                <img
                  src={heroCommercial}
                  alt="Suntech rooftop solar installation"
                  className="h-[280px] w-full object-cover md:h-[380px]"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-solar-dark/30 to-transparent" />
              </div>
            </motion.div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {solutionCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Link
                  to={card.link}
                  className="group block overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_70px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img src={card.image} alt={card.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-solar-dark via-solar-dark/20 to-transparent" />
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/[0.88] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      <card.icon className="h-3.5 w-3.5" />
                      {card.eyebrow}
                    </div>
                  </div>

                  <div className="p-7">
                    <h3 className="text-2xl font-extrabold text-foreground">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>

                    <ul className="mt-5 list-disc space-y-2 pl-5">
                      {card.highlights.map((item) => (
                        <li key={item} className="text-sm font-bold uppercase tracking-[0.08em] text-primary">
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all group-hover:gap-3">
                      View solution
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/[0.45] py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title={`Why ${companyProfile.shortName} Feels Reliable From Day One`}
            subtitle="Professional solar guidance, transparent execution, and dependable support for homes and housing societies."
          />

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseCards.map((item, index) => (
              <motion.div
                key={item.title}
                className="lift-card rounded-[1.9rem] border border-border bg-card p-7 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <section id="solar-calculator" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
            <motion.div
              className="overflow-hidden rounded-[2rem] border border-border bg-card p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                <Calculator className="h-4 w-4" />
                Residential Calculator
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-foreground md:text-4xl">Claim up to ₹78,000 subsidy with a Suntech savings estimate.</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                This estimate follows a practical residential model and gives direction on system size, subsidy, and payback before your site survey.
              </p>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-foreground">Monthly Electricity Bill</label>
                  <span className="rounded-xl bg-secondary/[0.12] px-3 py-2 text-sm font-bold text-secondary">{formatCurrency(calculatorBill)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30000}
                  step={500}
                  value={calculatorBill}
                  onChange={(event) => setCalculatorBill(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-secondary"
                />
                <div className="mt-2 flex justify-between text-xs font-medium text-muted-foreground">
                  <span>₹0</span>
                  <span>₹30,000</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {calculatorBillPresets.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setCalculatorBill(amount)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      calculatorBill === amount
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-[1.35rem] border border-border bg-muted/[0.35] p-5">
                <p className="text-sm font-semibold text-foreground">Do you experience frequent load shedding?</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHasLoadShedding(true)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      hasLoadShedding === true ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasLoadShedding(false)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      hasLoadShedding === false ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    No
                  </button>
                </div>
                {hasLoadShedding === true ? (
                  <div className="mt-3 rounded-xl border border-solar-yellow/35 bg-solar-yellow/10 px-3 py-2 text-xs font-semibold text-foreground">
                    Hybrid + battery is usually recommended for backup during outages.
                  </div>
                ) : null}
              </div>

              <div className="mt-5 space-y-3">
                <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/[0.3] px-4 py-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={needsHeavyDutyStructure}
                    onChange={(event) => setNeedsHeavyDutyStructure(event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  Heavy-duty galvanized mounting structure required
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/[0.3] px-4 py-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={includeMsebPaperwork}
                    onChange={(event) => setIncludeMsebPaperwork(event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  Include end-to-end Mahavitaran paperwork support
                </label>

                {includeMsebPaperwork ? (
                  <div className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                    100% Mahavitaran paperwork guidance included in consultation.
                  </div>
                ) : null}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-foreground">Address</label>
                <input
                  type="text"
                  value={calculatorAddress}
                  onChange={(event) => setCalculatorAddress(event.target.value)}
                  placeholder="Enter your full address"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_14px_42px_rgba(15,23,42,0.06)] md:p-7"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <CircleDollarSign className="h-4 w-4" />
                  Estimated Results
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Recommended System", value: `${(Math.round(recommendedKw * 10) / 10).toLocaleString("en-IN")} kW (${systemType})`, icon: SunMedium },
                    { label: "Govt Subsidy", value: formatCurrency(subsidy), icon: CircleDollarSign },
                    { label: "Estimated Payback", value: `${(Math.round(paybackYears * 10) / 10).toLocaleString("en-IN")} years`, icon: ShieldCheck },
                    { label: "Annual Savings", value: formatCurrency(annualSavings), icon: BadgeCheck },
                    { label: "Total Investment", value: formatCurrency(estimatedInvestment), icon: Wrench },
                    { label: "Roof Area Need", value: `${Math.round(roofAreaSqFt).toLocaleString("en-IN")} sq ft`, icon: Home },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-border bg-muted/[0.3] p-4">
                      <item.icon className="h-4 w-4 text-primary" />
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-base font-extrabold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Projects" />

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={`${project.id ?? project.title}-${project.sortOrder ?? index}`}
                className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={resolveContentImageUrl(project.imageUrl)}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-solar-dark/90 via-solar-dark/[0.28] to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/[0.88] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {project.category}
                  </div>
                  <div className="absolute bottom-5 right-5 rounded-full gradient-cta px-4 py-2 text-xs font-bold text-foreground shadow-lg">
                    {project.capacity}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-foreground">{project.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {project.location}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {project.description || "Solar project delivered with a practical focus on performance, roof fit, and cleaner long-term value."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-2xl border border-primary px-6 py-4 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              View all projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-muted/[0.3] py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="All your key rooftop solar questions for Pune and PCMC, answered clearly."
          />

          <motion.div
            className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-border bg-card p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="rounded-[1.25rem] border border-border px-5 data-[state=open]:bg-muted/40"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-bold text-foreground hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 pt-4">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2rem] gradient-dark px-8 py-10 text-primary-foreground shadow-[0_24px_70px_rgba(2,12,27,0.25)] md:px-12 md:py-12">
            <div className="absolute inset-0" aria-hidden="true">
              <img src={heroResidential} alt="" className="h-full w-full object-cover object-center" loading="lazy" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,18,0.9)_0%,rgba(4,10,18,0.78)_38%,rgba(4,10,18,0.62)_100%)]" />
            </div>
            <div className="absolute inset-0 solar-grid opacity-20" />
            <div className="sunbeam -right-8 top-0 h-40 w-40 bg-solar-orange/[0.18]" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground/[0.85]">
                  <SunMedium className="h-4 w-4 text-solar-yellow" />
                  Ready to go solar
                </div>
                <h2 className="mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
                  Turn rooftop interest into real enquiries.
                </h2>
                <p className="mt-4 text-base leading-8 text-primary-foreground/[0.8] md:text-lg">
                  Book a free site visit and get a clear savings-first plan for your roof.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/contact"
                  className="gradient-cta shine inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-foreground shadow-lg shadow-secondary/20 transition-transform hover:scale-[1.02]"
                >
                  Get free consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary-foreground/20 px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  View projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

