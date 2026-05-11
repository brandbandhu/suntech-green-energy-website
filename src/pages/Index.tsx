import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  CircleDollarSign,
  Factory,
  FileText,
  Home,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Wrench,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import SectionHeading from "@/components/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroCommercial from "@/assets/hero-commercial.jpg";
import heroIndustrial from "@/assets/hero-industrial.jpg";
import heroResidential from "@/assets/hero-residential.jpg";
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

const heroBackgroundImage = heroResidential;

const heroSignals = [
  {
    icon: CircleDollarSign,
    title: "Savings-led proposals",
    description: "We shape the recommendation around your monthly bill and actual roof potential instead of pushing a standard package.",
  },
  {
    icon: FileText,
    title: "Subsidy and approval guidance",
    description: "From paperwork direction to net-metering coordination, the process is explained in a much more usable way.",
  },
  {
    icon: Wrench,
    title: "Support after installation",
    description: "The experience does not stop at handover. We stay helpful through activation, questions, and upkeep guidance.",
  },
];

const clarityCards = [
  {
    icon: ShieldCheck,
    title: "Cleaner execution on the roof",
    description: "Layouts, structures, and routing are planned to feel more premium and more trustworthy the moment you see the finished work.",
    points: ["Cleaner panel alignment across the roof", "Tidier cable routing and finishing details", "Structure choices explained before execution starts"],
  },
  {
    icon: Sparkles,
    title: "Local consultation, not generic sales talk",
    description: "You get site-visit thinking, bill-based guidance, and clearer next steps tailored to Pune rooftops and surrounding areas.",
    points: ["Advice shaped around your actual bill pattern", "Local roof constraints discussed early", "Next steps explained in plain language"],
  },
  {
    icon: CircleDollarSign,
    title: "Practical cost conversations",
    description: "We help explain what changes the system size, where the savings come from, and how the proposal should be evaluated.",
    points: ["System size linked to load and roof space", "Savings range discussed before finalizing", "Proposal comparisons made easier to judge"],
  },
  {
    icon: FileText,
    title: "A neater approval journey",
    description: "Documentation and follow-up are easier to manage when the steps are visible from the start instead of surfacing late.",
    points: ["Paperwork expectations shared earlier", "Approval flow broken into clear stages", "Follow-up support stays easier to track"],
  },
];

const quoteChecklist = [
  "Free rooftop visit and initial requirement review",
  "Direction on system size, layout, and roof fit",
  "Discussion around subsidy, approvals, and next steps",
  "Support that continues after installation goes live",
];

const processSteps = [
  {
    number: "01",
    title: "Talk through the bill and the roof",
    description: "We start by understanding your usage, sanctioned load, free rooftop area, and the kind of savings outcome you want.",
  },
  {
    number: "02",
    title: "Shape the right solar proposal",
    description: "The system direction is matched to your roof, your category, your budget comfort, and the practical approval flow.",
  },
  {
    number: "03",
    title: "Install with cleaner coordination",
    description: "Execution stays organized from structure work to panel placement so the site feels managed instead of improvised.",
  },
  {
    number: "04",
    title: "Activate, explain, and stay available",
    description: "After handover, we help you understand generation, approvals, and what the next few weeks should look like.",
  },
];

const faqItems = [
  {
    question: "How do I know if my roof is suitable for solar?",
    answer:
      "We look at your usable roof area, shadow pattern, structure type, load, and bill pattern during the site visit. That gives a much clearer answer than guessing from bill size alone.",
  },
  {
    question: "Can your team guide us on subsidy and net-metering?",
    answer:
      "Yes. We help explain the steps, paperwork direction, and approval flow so you know what is needed and when. Exact eligibility still depends on your category and current rules.",
  },
  {
    question: "Do you handle only homes, or larger rooftops too?",
    answer:
      "We support residential, commercial, and industrial rooftops. The design and execution approach changes based on roof scale, load profile, and structure requirements.",
  },
  {
    question: "What happens after the system is installed?",
    answer:
      "We stay available for activation guidance, performance questions, and post-install support so the project feels complete beyond the installation day.",
  },
];

const billPresets = [1500, 2500, 4000, 8000, 12000];

const Index = () => {
  const { data } = usePublicContent();
  const [bill, setBill] = useState(4000);

  const { aboutPage, companyProfile } = data;
  const yearsInBusiness = Math.max(1, new Date().getFullYear() - companyProfile.yearEstablished);
  const preferredProjects = data.projects.filter((project) => project.isFeatured !== false);
  const featuredProjects = (preferredProjects.length > 0 ? preferredProjects : data.projects).slice(0, 3);
  const galleryProjects = featuredProjects.length > 0 ? featuredProjects : data.projects.slice(0, 3);
  const googleReviewUrl = companyProfile.googleReviewUrl || "";

  const monthlySavings = Math.round(bill * 0.78);
  const annualSavings = monthlySavings * 12;
  const systemSize = Math.max(2, Math.round(bill / 1500));
  const roofArea = systemSize * 90;

  const proofStats = [
    {
      label: "Visible customer proof",
      value: "Trusted",
      detail: "Testimonials and project proof built into the About page and project portfolio",
    },
    {
      label: "Years in business",
      value: `${yearsInBusiness}+`,
      detail: "A local team focused on clearer solar planning and execution",
    },
    {
      label: "Rooftop categories",
      value: "3",
      detail: "Homes, commercial roofs, and industrial sheds",
    },
    {
      label: "Portfolio highlights",
      value: `${Math.max(featuredProjects.length, 1)}`,
      detail: "Featured solar examples already available on the site",
    },
  ];
  const secondaryGalleryProjects = galleryProjects.slice(1, 3);
  const galleryLayout = galleryProjects.length >= 3 ? "masonry" : galleryProjects.length === 2 ? "split" : "single";

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
              <div className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground/[0.82]">
                <Sparkles className="h-4 w-4 text-solar-yellow" />
                Rooftop solar in Pune
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[0.98] text-primary-foreground md:text-6xl lg:text-7xl">
                Solar in Pune, designed around savings instead of sales pressure.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/[0.78] md:text-xl">
                SUNTECH plans rooftop solar for homes, businesses, and industrial roofs with stronger visual polish, clearer guidance,
                better trust-building, and a process that feels easier from site visit to activation.
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

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-primary-foreground/[0.8]">
                {[
                  "Residential, commercial, and industrial rooftops",
                  "Guidance for subsidy and approval flow",
                  "A cleaner post-install support experience",
                ].map((item) => (
                  <div key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-sm">
                    <BadgeCheck className="h-4 w-4 text-solar-yellow" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {heroSignals.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="glass-dark lift-card rounded-[1.7rem] p-5"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 + index * 0.08 }}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                      <item.icon className="h-5 w-5 text-solar-yellow" />
                    </div>
                    <h2 className="mt-5 text-lg font-extrabold text-primary-foreground">{item.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-primary-foreground/[0.7]">{item.description}</p>
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

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    <SunMedium className="h-4 w-4" />
                    Free consultation
                  </div>
                  <div className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground">
                    Trusted consultation
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-3xl font-extrabold leading-tight text-foreground">Book a solar consultation that actually feels useful.</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Share your bill and contact details. We will help you understand the right direction for your roof, the likely savings range,
                    and the next steps around subsidy and approvals.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Free rooftop visit",
                    "Savings discussion",
                    "Subsidy guidance",
                    "Post-install support",
                  ].map((item) => (
                    <div key={item} className="rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <LeadForm compact />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { title: "Subsidy help", description: "Know the flow before you commit." },
                    { title: "Net-metering support", description: "A clearer route through documents." },
                    { title: "Local callback", description: `Speak directly with ${companyProfile.shortName}.` },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[1.3rem] border border-border bg-muted/[0.35] p-4">
                      <div className="text-sm font-bold text-foreground">{item.title}</div>
                      <div className="mt-1 text-xs leading-6 text-muted-foreground">{item.description}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] bg-primary/[0.05] px-4 py-3">
                  <div className="text-sm text-muted-foreground">
                    Prefer to speak first? Call us at <span className="font-bold text-foreground">{companyProfile.phone}</span>
                  </div>
                  {googleReviewUrl ? (
                    <a
                      href={googleReviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/80"
                    >
                      View reviews
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : null}
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
                className="lift-card rounded-[1.75rem] border border-border/80 bg-card/[0.95] p-6 shadow-[0_18px_48px_rgba(12,22,36,0.08)] backdrop-blur-xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</div>
                <div className="mt-3 text-4xl font-extrabold leading-none text-foreground">{stat.value}</div>
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
                tag="Solar Solutions"
                title="A homepage flow that now feels much closer to a modern solar landing page"
                subtitle="The layout now leans into stronger hierarchy, heavier trust cues, and more premium visual contrast while still using your own SUNTECH content and categories."
                center={false}
              />
            </div>

            <motion.div
              className="relative overflow-hidden rounded-[2rem] gradient-dark p-7 text-primary-foreground shadow-[0_18px_60px_rgba(10,20,32,0.18)] md:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="sunbeam -right-10 top-0 h-36 w-36 bg-solar-orange/[0.18]" />
              <div className="relative z-10">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-foreground/[0.68]">Experience Snapshot</div>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
                  {aboutPage.storyTitle || "Solar planning that feels clearer from the very first scroll"}
                </h2>
                <p className="mt-4 text-base leading-8 text-primary-foreground/[0.8]">{aboutPage.storyParagraph1}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-primary-foreground/80">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                    <MapPin className="h-4 w-4 text-solar-yellow" />
                    Pune and nearby regions
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                    <PhoneCall className="h-4 w-4 text-solar-yellow" />
                    {companyProfile.phone}
                  </div>
                </div>
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

                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.highlights.map((item) => (
                        <div key={item} className="rounded-full bg-primary/[0.07] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                          {item}
                        </div>
                      ))}
                    </div>

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
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <motion.div
              className="relative overflow-hidden rounded-[2rem] gradient-dark p-8 text-primary-foreground shadow-[0_20px_70px_rgba(3,12,28,0.22)] md:p-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="sunbeam -left-10 bottom-0 h-40 w-40 bg-solar-green/[0.18]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/[0.84]">
                  <ShieldCheck className="h-4 w-4 text-solar-yellow" />
                  Why choose {companyProfile.shortName}
                </div>

                <h2 className="mt-6 text-3xl font-extrabold leading-tight md:text-5xl">
                  Built to feel more trustworthy before, during, and after installation.
                </h2>
                <p className="mt-5 text-base leading-8 text-primary-foreground/70">{aboutPage.storyParagraph2}</p>

                <div className="mt-8 space-y-4">
                  {[
                    "Local rooftop understanding and more practical site conversations",
                    "Clearer hand-holding on subsidy, proposal, and approval expectations",
                    "A stronger service mindset after the rooftop goes live",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.06] px-4 py-4">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-solar-yellow" />
                      <span className="text-sm leading-7 text-primary-foreground/[0.84]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/[0.64]">Working hours</div>
                    <div className="mt-2 text-base font-semibold text-primary-foreground">{companyProfile.workingHours}</div>
                  </div>
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/[0.64]">Primary support line</div>
                    <div className="mt-2 text-base font-semibold text-primary-foreground">{companyProfile.phone}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              {clarityCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="lift-card flex h-full flex-col rounded-[2rem] border border-border bg-card p-7 shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  <ul className="mt-6 space-y-3 border-t border-border/70 pt-5 text-sm text-muted-foreground">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="leading-6">{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div
              className="overflow-hidden rounded-[2rem] border border-border bg-card p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    <Calculator className="h-4 w-4" />
                    Savings estimator
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold text-foreground md:text-4xl">See how the numbers start shaping the conversation.</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    This is a directional estimate only. Real output depends on roof condition, free area, sanctioned load, usage pattern,
                    and the final system design.
                  </p>
                </div>

                <div className="rounded-[1.35rem] bg-secondary/[0.12] px-4 py-3 text-right">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Indicative bill</div>
                  <div className="mt-2 text-3xl font-extrabold text-secondary">₹{bill.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {billPresets.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setBill(amount)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      bill === amount
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <input
                  type="range"
                  min={1000}
                  max={20000}
                  step={500}
                  value={bill}
                  onChange={(event) => setBill(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-secondary"
                />
                <div className="mt-2 flex justify-between text-xs font-medium text-muted-foreground">
                  <span>₹1,000</span>
                  <span>₹20,000</span>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <motion.div
                  key={`monthly-${monthlySavings}`}
                  initial={{ opacity: 0.3, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[1.45rem] bg-primary/[0.06] p-5"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Potential monthly savings</div>
                  <div className="mt-3 text-3xl font-extrabold text-primary">₹{monthlySavings.toLocaleString()}</div>
                </motion.div>
                <motion.div
                  key={`annual-${annualSavings}`}
                  initial={{ opacity: 0.3, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.04 }}
                  className="rounded-[1.45rem] bg-secondary/[0.12] p-5"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Potential annual relief</div>
                  <div className="mt-3 text-3xl font-extrabold text-secondary">₹{annualSavings.toLocaleString()}</div>
                </motion.div>
                <motion.div
                  key={`system-${systemSize}`}
                  initial={{ opacity: 0.3, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.08 }}
                  className="rounded-[1.45rem] bg-solar-green/[0.08] p-5"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Indicative system size</div>
                  <div className="mt-3 text-3xl font-extrabold text-solar-green">{systemSize} kW</div>
                </motion.div>
              </div>

              <div className="mt-6 rounded-[1.7rem] border border-border bg-muted/[0.35] p-5">
                <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <div className="text-sm font-bold text-foreground">What this bill range usually points toward</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Around <span className="font-bold text-foreground">{roofArea} sq ft</span> of usable roof area may be worth reviewing for a
                      <span className="font-bold text-foreground"> {systemSize} kW</span> direction.
                    </p>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {[
                      `Proposal direction shaped around roughly ₹${annualSavings.toLocaleString()} yearly bill relief`,
                      "A better conversation on subsidy support and approval readiness",
                      "Clearer understanding of whether your roof should go smaller, match this size, or scale up",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                className="rounded-[2rem] gradient-dark p-7 text-primary-foreground shadow-[0_18px_60px_rgba(4,12,22,0.2)] md:p-8"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/[0.82]">
                  <CircleDollarSign className="h-4 w-4 text-solar-yellow" />
                  What your consultation includes
                </div>
                <h2 className="mt-5 text-3xl font-extrabold leading-tight">A quote should reduce uncertainty, not add to it.</h2>
                <div className="mt-6 space-y-4">
                  {quoteChecklist.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.06] px-4 py-4">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-solar-yellow" />
                      <span className="text-sm leading-7 text-primary-foreground/[0.84]">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="rounded-[2rem] border border-border bg-card p-7 shadow-[0_14px_42px_rgba(15,23,42,0.06)] md:p-8"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Need answers quickly?</div>
                <h2 className="mt-4 text-2xl font-extrabold text-foreground">Talk to a local solar advisor and move faster.</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  This new layout pushes trust, clarity, and action harder so the page behaves more like a conversion-focused solar landing page.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Get detailed estimate
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={`tel:${companyProfile.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Call {companyProfile.shortName}
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/[0.45] py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
            <div>
              <SectionHeading
                tag="Process"
                title="A cleaner solar journey from the first visit to final activation"
                subtitle="The structure below is intentionally more landing-page friendly: easy to scan, easy to trust, and much clearer about what happens next."
                center={false}
              />

              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    className="lift-card rounded-[1.7rem] border border-border bg-card p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-extrabold text-primary">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-foreground">{step.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className={`grid h-full gap-4 ${
                galleryLayout === "masonry" ? "md:auto-rows-fr md:grid-cols-[1.05fr_0.95fr]" : ""
              } ${galleryLayout === "split" ? "md:grid-cols-[1.05fr_0.95fr]" : ""}`}
            >
              {galleryProjects[0] ? (
                <motion.div
                  className={`group relative h-full overflow-hidden rounded-[2rem] border border-border shadow-[0_18px_50px_rgba(15,23,42,0.09)] ${
                    galleryLayout === "masonry" ? "md:row-span-2" : ""
                  }`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={resolveContentImageUrl(galleryProjects[0].imageUrl)}
                    alt={galleryProjects[0].title}
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      galleryLayout === "masonry"
                        ? "h-full min-h-[24rem]"
                        : galleryLayout === "split"
                          ? "h-full min-h-[32rem]"
                          : "h-full min-h-[34rem]"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-solar-dark via-solar-dark/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="inline-flex rounded-full bg-white/[0.88] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      {galleryProjects[0].category}
                    </div>
                    <h3 className="mt-4 text-2xl font-extrabold text-primary-foreground">{galleryProjects[0].title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/[0.78]">
                      <MapPin className="h-4 w-4 text-solar-yellow" />
                      {galleryProjects[0].location}
                    </div>
                    <div className="mt-4 inline-flex rounded-full gradient-cta px-4 py-2 text-sm font-bold text-foreground shadow-lg">
                      {galleryProjects[0].capacity}
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {secondaryGalleryProjects.map((project, index) => (
                <motion.div
                  key={`${project.id ?? project.title}-${index}`}
                  className="group relative h-full overflow-hidden rounded-[2rem] border border-border shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <img
                    src={resolveContentImageUrl(project.imageUrl)}
                    alt={project.title}
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      galleryLayout === "masonry" ? "h-full min-h-[18rem]" : "h-full min-h-[32rem]"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-solar-dark via-solar-dark/[0.18] to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="inline-flex rounded-full bg-white/[0.88] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {project.category}
                    </div>
                    <h3 className="mt-3 text-xl font-extrabold text-primary-foreground">{project.title}</h3>
                    <div className="mt-2 flex items-center justify-between gap-3 text-sm text-primary-foreground/[0.78]">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-solar-yellow" />
                        {project.location}
                      </span>
                      <span className="font-bold text-solar-yellow">{project.capacity}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            tag="Project Proof"
            title="Project cards now carry more depth, stronger contrast, and a clearer premium feel"
            subtitle="The visual treatment has been pushed harder so the portfolio reads more confidently, closer to a polished solar conversion page."
          />

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

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionHeading
                tag="FAQ"
                title="Common questions, now inside a cleaner and better-spaced layout"
                subtitle="This keeps the page conversion-friendly while still answering the doubts people usually have before booking a visit."
                center={false}
              />

              <div className="rounded-[2rem] border border-border bg-muted/[0.35] p-7">
                <div className="text-sm leading-7 text-muted-foreground">
                  Good solar pages work best when trust, clarity, proof, and FAQs all support one another. This redesign now pushes that pattern much more clearly.
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Schedule free visit
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/about#reviews"
                    className="inline-flex items-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Read customer feedback
                  </Link>
                </div>
              </div>
            </div>

            <motion.div
              className="rounded-[2rem] border border-border bg-card p-7 shadow-[0_16px_42px_rgba(15,23,42,0.06)] md:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`faq-${index}`}
                    className="rounded-[1.35rem] border border-border px-5 data-[state=open]:bg-muted/[0.35]"
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
        </div>
      </section>

      <section className="pb-20 pt-4">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2rem] gradient-dark px-8 py-10 text-primary-foreground shadow-[0_24px_70px_rgba(2,12,27,0.25)] md:px-12 md:py-12">
            <div className="absolute inset-0 solar-grid opacity-20" />
            <div className="sunbeam -right-8 top-0 h-40 w-40 bg-solar-orange/[0.18]" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground/[0.85]">
                  <SunMedium className="h-4 w-4 text-solar-yellow" />
                  Ready to go solar
                </div>
                <h2 className="mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
                  The homepage now feels sharper. Next step: turn that into more enquiries.
                </h2>
                <p className="mt-4 text-base leading-8 text-primary-foreground/[0.8] md:text-lg">
                  Book a free site visit, talk through your roof and bill, and let the new landing-page flow do a better job of building confidence.
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
                  View project examples
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
