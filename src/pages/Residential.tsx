import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Battery,
  Building2,
  CheckCircle2,
  FileText,
  Gauge,
  Home,
  IndianRupee,
  Landmark,
  PhoneCall,
  Shield,
  Smartphone,
  Star,
  Sun,
  Wrench,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import LeadForm from "@/components/LeadForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import trustAfterSalesImage from "@/assets/Reliable Service.png";
import trustGuaranteedSavingsImage from "@/assets/Savings-first Design.png";
import trustHassleFreeProcessImage from "@/assets/Hassle-free Process.png";
import trustStormProofImage from "@/assets/Durable Structure.png";
import heroHomeBanner from "@/assets/hero-home-banner.jpg";

type Segment = "homes" | "housing-society";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface SubsidyRow {
  size: string;
  subsidy: string;
  cost: string;
}

interface JourneyStep {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface TrustVisualCard {
  image: string;
  title: string;
  desc: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SegmentContent {
  bannerTitle: string;
  bannerSubtitle: string;
  breadcrumbLabel: string;
  benefitsTitle: string;
  benefits: FeatureItem[];
  trustShowcaseTitle: string;
  trustShowcaseCards: TrustVisualCard[];
  subsidyTitle: string;
  subsidySubtitle: string;
  subsidyRows: SubsidyRow[];
  journeyTitle: string;
  journeySteps: JourneyStep[];
  trustTitle: string;
  trustPoints: FeatureItem[];
  estimateTitle: string;
  billLabel: string;
  billMin: number;
  billMax: number;
  billStep: number;
  savingsRatio: number;
  estimateNote: string;
  faqTitle: string;
  faqs: FaqItem[];
  ctaTitle: string;
  ctaNote: string;
}

const contentBySegment: Record<Segment, SegmentContent> = {
  homes: {
    bannerTitle: "Rooftop Solar for Homes",
    bannerSubtitle: "Cut home electricity bills by up to 90% with a rooftop system designed around your actual annual usage.",
    breadcrumbLabel: "Homes Solar",
    benefitsTitle: "Why Homeowners Switch to Solar",
    benefits: [
      {
        icon: Zap,
        title: "Up to 90% Bill Reduction",
        desc: "A correctly sized system can bring monthly grid bills close to zero for many families.",
      },
      {
        icon: Sun,
        title: "Personalized Roof Planning",
        desc: "Survey-based design and shadow analysis improve generation from your available rooftop.",
      },
      {
        icon: FileText,
        title: "Subsidy Documentation Help",
        desc: "Paperwork steps are guided end-to-end so approvals move faster with fewer follow-ups.",
      },
      {
        icon: Battery,
        title: "Long-term Performance Support",
        desc: "Ongoing checks and service support help maintain generation quality year after year.",
      },
    ],
    trustShowcaseTitle: "Why Families Across India Trust Suntech Green Energy",
    trustShowcaseCards: [
      {
        image: trustGuaranteedSavingsImage,
        title: "Guaranteed Savings Direction",
        desc: "Usage-based design approach focused on practical bill reduction and measurable long-term value.",
      },
      {
        image: trustHassleFreeProcessImage,
        title: "Hassle-free Project Execution",
        desc: "Survey, installation, subsidy workflow, and support are coordinated through one guided process.",
      },
      {
        image: trustStormProofImage,
        title: "Storm-ready Mounting Quality",
        desc: "Structure and installation standards are planned for safety, durability, and long service life.",
      },
      {
        image: trustAfterSalesImage,
        title: "Dependable After-sales Service",
        desc: "Proactive service support helps keep system performance stable and savings consistent over time.",
      },
    ],
    subsidyTitle: "Home Solar Subsidy Snapshot",
    subsidySubtitle: "Indicative values aligned to PM Surya Ghar residential rooftop norms.",
    subsidyRows: [
      { size: "1 kW", subsidy: "Rs. 30,000", cost: "Rs. 35,000 approx" },
      { size: "2 kW", subsidy: "Rs. 60,000", cost: "Rs. 70,000 approx" },
      { size: "3 kW", subsidy: "Rs. 78,000", cost: "Rs. 1,10,000 approx" },
      { size: "3+ kW", subsidy: "Rs. 78,000 (cap)", cost: "Depends on final design" },
    ],
    journeyTitle: "Simplified Solar Journey for Homes",
    journeySteps: [
      {
        icon: Home,
        title: "Free Roof Visit and Consumption Check",
        desc: "We assess roof space, shadow impact, and your power usage to estimate practical system size.",
      },
      {
        icon: Sun,
        title: "3D Layout Before You Confirm",
        desc: "You review a rooftop layout preview so placement and output expectations are clear in advance.",
      },
      {
        icon: FileText,
        title: "Installation plus Subsidy Process",
        desc: "Execution and subsidy documentation are managed together through one coordinated workflow.",
      },
      {
        icon: Wrench,
        title: "System On and Maintenance Support",
        desc: "After commissioning, routine service and monitoring support help preserve long-term performance.",
      },
    ],
    trustTitle: "Why Families Trust This Model",
    trustPoints: [
      {
        icon: Shield,
        title: "Savings-first Planning",
        desc: "System sizing is done around expected payback and real usage patterns, not over-selling capacity.",
      },
      {
        icon: Building2,
        title: "End-to-end Managed Execution",
        desc: "Survey, design, installation, paperwork, and post-install support move through one accountable team.",
      },
      {
        icon: Landmark,
        title: "Storm-ready Structural Direction",
        desc: "Mounting and hardware are selected for safety and durability under local weather conditions.",
      },
      {
        icon: Wrench,
        title: "After-sales Follow-up",
        desc: "Regular service support helps sustain output consistency and protects long-term system health.",
      },
    ],
    estimateTitle: "Estimate Home Solar Savings",
    billLabel: "Monthly Home Electricity Bill",
    billMin: 1000,
    billMax: 50000,
    billStep: 500,
    savingsRatio: 0.85,
    estimateNote: "Actual savings vary with roof orientation, sanctioned load, and final system capacity.",
    faqTitle: "Home Solar FAQs",
    faqs: [
      {
        question: "Why should homeowners consider rooftop solar?",
        answer:
          "If monthly electricity charges are rising, rooftop solar can reduce grid dependence and lower long-term household energy cost significantly.",
      },
      {
        question: "From what bill level does solar usually make sense?",
        answer:
          "Many projects become more attractive once monthly bills are around Rs. 1,500 or above, though the best answer comes after a usage-based assessment.",
      },
      {
        question: "How much can a home save after installation?",
        answer:
          "Well-sized residential systems often reduce bills by about 80% to 90%, depending on usage profile and local tariff structure.",
      },
      {
        question: "What if I am unsure about rooftop suitability?",
        answer:
          "A site visit and design study can confirm space, shadow behavior, and expected generation before you commit.",
      },
    ],
    ctaTitle: "Get a Free Home Site Survey",
    ctaNote: "No-pressure consultation with practical sizing and subsidy guidance.",
  },
  "housing-society": {
    bannerTitle: "Rooftop Solar for Housing Societies",
    bannerSubtitle: "Reduce common-area electricity charges by up to 90% with society-focused rooftop planning and execution.",
    breadcrumbLabel: "Housing Society Solar",
    benefitsTitle: "Why Housing Societies Go Solar",
    benefits: [
      {
        icon: Zap,
        title: "Lower Common-Area Electricity Cost",
        desc: "Societies can significantly reduce bills for lifts, pumps, lighting, and other shared loads.",
      },
      {
        icon: Landmark,
        title: "Subsidy Support for Shared Systems",
        desc: "Under current norms, support can be around Rs. 18,000 per kW, up to defined scheme caps.",
      },
      {
        icon: Building2,
        title: "AGM and Committee Flow Guidance",
        desc: "Planning support helps committees navigate approvals and align residents around project decisions.",
      },
      {
        icon: Wrench,
        title: "Execution plus O and M",
        desc: "Design, installation, compliance, and ongoing service support are handled through one workflow.",
      },
    ],
    trustShowcaseTitle: "Why Societies Trust Suntech for Rooftop Solar",
    trustShowcaseCards: [
      {
        image: trustGuaranteedSavingsImage,
        title: "Clear Savings Visibility",
        desc: "Common-area energy planning is done with ROI-focused projections for committees and residents.",
      },
      {
        image: trustHassleFreeProcessImage,
        title: "Committee-friendly Execution Flow",
        desc: "AGM alignment, approvals, and documentation steps are structured to reduce operational friction.",
      },
      {
        image: trustStormProofImage,
        title: "High Structural Safety Standards",
        desc: "Mounting and rooftop practices are selected for strong weather resilience and long lifecycle reliability.",
      },
      {
        image: trustAfterSalesImage,
        title: "Long-term O and M Support",
        desc: "Post-install maintenance planning helps preserve generation consistency for shared society loads.",
      },
    ],
    subsidyTitle: "Housing Society Cost and Subsidy Snapshot",
    subsidySubtitle: "Indicative values inspired by current market ranges and PM Surya Ghar society norms.",
    subsidyRows: [
      { size: "30 kW", subsidy: "Rs. 5.4 lakh", cost: "Rs. 12.6-14.1 lakh approx" },
      { size: "50 kW", subsidy: "Rs. 9 lakh", cost: "Rs. 21-23.5 lakh approx" },
      { size: "100 kW", subsidy: "Rs. 18 lakh", cost: "Rs. 42-47 lakh approx" },
      { size: "500 kW", subsidy: "Up to Rs. 90 lakh", cost: "Rs. 2.10-2.35 crore approx" },
    ],
    journeyTitle: "Simplified Solar Journey for Societies",
    journeySteps: [
      {
        icon: FileText,
        title: "Energy Audit and Savings Proposal",
        desc: "Common-load profile and rooftop feasibility are mapped first to define project scale and savings direction.",
      },
      {
        icon: Building2,
        title: "Committee and AGM Preparedness",
        desc: "Technical and financial discussion points are structured to support smoother AGM decision-making.",
      },
      {
        icon: Shield,
        title: "Installation, Utility, and Subsidy Workflow",
        desc: "Execution and documentation move in parallel, including subsidy and compliance steps.",
      },
      {
        icon: Wrench,
        title: "Commissioning and Ongoing Maintenance",
        desc: "Post-install support helps protect long-term output and sustained savings for shared facilities.",
      },
    ],
    trustTitle: "What Societies Usually Look For",
    trustPoints: [
      {
        icon: Shield,
        title: "High Structural Reliability",
        desc: "Society rooftops need durable mounting and safety-first installation quality for long lifecycle performance.",
      },
      {
        icon: Zap,
        title: "Strong ROI Visibility",
        desc: "Clear payback and common-area savings projections help committees evaluate investment confidence.",
      },
      {
        icon: FileText,
        title: "Documentation Clarity",
        desc: "AGM paperwork, utility coordination, and subsidy filing become easier with guided process ownership.",
      },
      {
        icon: Wrench,
        title: "Long-term Service Coverage",
        desc: "Planned maintenance and response support are critical for consistent generation after commissioning.",
      },
    ],
    estimateTitle: "Estimate Society Solar Savings",
    billLabel: "Monthly Common-Area Electricity Bill",
    billMin: 10000,
    billMax: 500000,
    billStep: 5000,
    savingsRatio: 0.9,
    estimateNote: "Actual savings vary by sanctioned load, roof conditions, and chosen project model (CAPEX/OPEX/hybrid).",
    faqTitle: "Housing Society FAQs",
    faqs: [
      {
        question: "How much can a housing society save with rooftop solar?",
        answer:
          "Many societies target up to 90% reduction in common-area electricity charges, though final results depend on load and installed capacity.",
      },
      {
        question: "Is subsidy available for housing society solar projects?",
        answer:
          "Current PM Surya Ghar-linked norms indicate around Rs. 18,000 per kW for eligible shared systems, with an upper cap for larger capacities.",
      },
      {
        question: "Can we start if AGM approval is not finalized yet?",
        answer:
          "Yes. Feasibility, proposal planning, and committee briefing can begin first, then move to AGM resolution and formal execution.",
      },
      {
        question: "Which roles in a society usually coordinate the project?",
        answer:
          "Management committee members, facility teams, and residents typically coordinate together on technical, commercial, and approval steps.",
      },
    ],
    ctaTitle: "Get a Free Society Feasibility Visit",
    ctaNote: "We can also help your team prepare for AGM-level decision-making.",
  },
};

const homeJourneySteps = [
  {
    title: "Free Visit and Rooftop Check",
    desc: "Our team checks roof space, shadow, current bill pattern, and practical system capacity.",
  },
  {
    title: "Personalized Solar Design",
    desc: "You get a clear layout direction before confirming, so panel placement and savings expectations are easy to understand.",
  },
  {
    title: "Installation and Subsidy Support",
    desc: "Suntech coordinates installation planning, documentation, and subsidy guidance through one accountable workflow.",
  },
  {
    title: "Solar On, Savings Begin",
    desc: "After commissioning, we support performance checks and maintenance guidance for steady long-term generation.",
  },
];

const homeTrustCards = [
  {
    image: trustGuaranteedSavingsImage,
    title: "Savings-first Design",
    desc: "System sizing is planned around real bill reduction, roof conditions, and practical long-term payback.",
  },
  {
    image: trustHassleFreeProcessImage,
    title: "Hassle-free Process",
    desc: "Survey, design, installation, subsidy guidance, and after-sales support are handled in one flow.",
  },
  {
    image: trustStormProofImage,
    title: "Durable Structure",
    desc: "Rooftop mounting is planned for clean alignment, local weather, and long service life.",
  },
  {
    image: trustAfterSalesImage,
    title: "Reliable Service",
    desc: "Performance guidance and service support help keep your plant generating consistently after handover.",
  },
];

const homeStats = [
  { value: "500+", label: "Homes Solarized", icon: Home },
  { value: "1 MW+", label: "Power Installed", icon: Zap },
  { value: "Rs.78k", label: "Subsidy Guidance", icon: IndianRupee },
  { value: "100%", label: "Customer Satisfaction", icon: Award },
];

const homeAdvantages = [
  "End-to-end survey, design, installation, and support",
  "Subsidy and net-metering documentation guidance",
  "Clean rooftop workmanship with durable mounting",
  "Local Pune and PCMC service support",
];

const otherProviderGaps = [
  "Fragmented vendor coordination",
  "Limited post-install follow-up",
  "Unclear subsidy and documentation process",
  "Generic system sizing without usage review",
];

const homeownerFaqs = [
  {
    question: "Why should I switch my home to solar?",
    answer:
      "Rooftop solar can reduce monthly electricity bills, lower grid dependency, and create long-term savings when the system is sized around your actual usage.",
  },
  {
    question: "How high should my electricity bill be for solar to make sense?",
    answer:
      "Solar usually becomes more attractive when monthly bills are around Rs. 1,500 or above, but the best answer depends on roof space, tariff, and usage pattern.",
  },
  {
    question: "Can Suntech help with subsidy paperwork?",
    answer:
      "Yes. Our team guides eligible homeowners through the subsidy and documentation process so the project is easier to manage.",
  },
  {
    question: "What if I am not sure my roof has enough space?",
    answer:
      "A free site visit helps confirm roof area, shade impact, structure requirements, and the right solar capacity before you commit.",
  },
  {
    question: "How will I know if the system is performing well?",
    answer:
      "We guide you on generation tracking and provide post-install support so performance issues can be spotted and addressed early.",
  },
];

const formatCurrency = (amount: number) => `Rs.${Math.round(amount).toLocaleString("en-IN")}`;

const HomeOfferingPage = () => {
  const [bill, setBill] = useState(6000);
  const annualSavings = Math.round(bill * 12 * 0.86);
  const lifetimeSavings = annualSavings * 25;
  const recommendedKw = Math.max(1, Math.round((bill / 850) * 10) / 10);

  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden pb-12 pt-24 lg:pb-16 lg:pt-28">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={heroHomeBanner} alt="" className="h-full w-full object-cover object-[55%_center]" loading="eager" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,11,24,0.9)_0%,rgba(4,11,24,0.78)_45%,rgba(4,11,24,0.58)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,11,24,0.08),rgba(4,11,24,0.82))]" />
        </div>
        <div className="absolute inset-0 solar-grid opacity-20" aria-hidden="true" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/85">
                <Sun className="h-4 w-4 text-solar-yellow" />
                Home Solar by Suntech
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
                Save up to 90% on your home electricity bills.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/78 md:text-lg">
                Rooftop solar for homes, professionally managed from roof survey and design to installation, subsidy guidance, and after-sales support.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#home-consultation" className="gradient-cta shine inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-sm font-bold text-foreground shadow-lg shadow-secondary/20">
                  Get Free Quote
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#home-calculator" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-7 py-4 text-sm font-semibold text-primary-foreground hover:bg-white/10">
                  Calculate Savings
                </a>
              </div>

              <div className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-primary-foreground backdrop-blur-xl">
                <span className="inline-flex items-center gap-1 text-solar-yellow">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                <span className="text-sm font-semibold">Trusted by homeowners across Pune and PCMC</span>
              </div>
            </motion.div>

            <motion.div
              id="home-consultation"
              className="relative mx-auto w-full max-w-2xl self-stretch"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="h-full bg-[#eaf0fb] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:p-8 lg:p-10">
                <LeadForm compact showConsultationHeader referenceStyle />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionHeading title="Simplified Solar Journey for Your Home" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {homeJourneySteps.map((step, index) => (
              <motion.div
                key={step.title}
                className="rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">{index + 1}</span>
                <h3 className="mt-5 text-lg font-extrabold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {homeStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] border border-border bg-card p-6 text-center shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                <stat.icon className="mx-auto h-7 w-7 text-primary" />
                <div className="mt-4 text-3xl font-extrabold text-foreground">{stat.value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionHeading title="Why Families Trust Suntech Green Energy" />
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {homeTrustCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="mx-auto mb-4 h-52 w-full max-w-[230px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_14px_35px_rgba(12,20,31,0.08)]">
                  <img src={card.image} alt={card.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground">{card.title}</h3>
                <p className="mx-auto mt-2 max-w-[280px] text-sm leading-7 text-muted-foreground">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="home-calculator" className="bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionHeading center={false} title="Unlock Your Solar Savings" subtitle="Enter your average monthly electricity bill to see a quick home solar direction." />
              <div className="rounded-[2rem] border border-border bg-card p-7 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label className="text-sm font-bold text-foreground">Monthly Electricity Bill</label>
                  <span className="rounded-xl bg-secondary/10 px-3 py-2 text-sm font-extrabold text-secondary">{formatCurrency(bill)}</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={30000}
                  step={500}
                  value={bill}
                  onChange={(event) => setBill(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-secondary"
                />
                <div className="mt-2 flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Rs.1,500</span>
                  <span>Rs.30,000</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                <Sun className="h-6 w-6 text-primary" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Recommended Size</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground">{recommendedKw.toLocaleString("en-IN")} kW</p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                <Gauge className="h-6 w-6 text-primary" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Annual Savings</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground">{formatCurrency(annualSavings)}</p>
              </div>
              <div className="sm:col-span-2 rounded-[1.5rem] border border-primary/20 bg-primary/5 p-6">
                <SparklineIcon />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">25-Year Savings Direction</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{formatCurrency(lifetimeSavings)}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">Final capacity, subsidy eligibility, and savings are confirmed after roof survey and utility checks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
              <img src={trustHassleFreeProcessImage} alt="Residential rooftop solar installation" className="h-[440px] w-full object-cover" loading="lazy" />
            </div>
            <div>
              <SectionHeading center={false} title="The Suntech Advantage" subtitle="End-to-end management for homeowners who want solar savings without confusing vendor coordination." />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-primary/20 bg-card p-5">
                  <h3 className="mb-4 text-lg font-extrabold text-foreground">Suntech</h3>
                  <div className="space-y-3">
                    {homeAdvantages.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-border bg-muted/45 p-5">
                  <h3 className="mb-4 text-lg font-extrabold text-foreground">Typical Gaps</h3>
                  <div className="space-y-3">
                    {otherProviderGaps.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <a href="#home-consultation" className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-primary px-6 py-4 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground">
                Talk to an Expert
                <PhoneCall className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading center={false} title="Track Your Solar Performance" subtitle="Stay informed about generation, savings direction, and plant health with clear monitoring guidance after installation." />
              <div className="grid gap-4 sm:grid-cols-3">
                {["Power generation", "Savings visibility", "Service follow-up"].map((item) => (
                  <div key={item} className="rounded-[1.25rem] border border-border bg-card p-4 text-sm font-bold text-foreground">
                    <Smartphone className="mb-3 h-5 w-5 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-border bg-card p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="rounded-[1.5rem] bg-[#101840] p-6 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/65">Today</p>
                    <p className="mt-2 text-3xl font-extrabold">24.8 units</p>
                  </div>
                  <Sun className="h-10 w-10 text-solar-yellow" />
                </div>
                <div className="mt-8 grid grid-cols-7 items-end gap-2">
                  {[38, 52, 45, 72, 64, 88, 78].map((height, index) => (
                    <div key={index} className="rounded-full bg-solar-yellow/85" style={{ height }} />
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-primary-foreground/70">Estimated monthly bill reduction</p>
                  <p className="mt-1 text-2xl font-extrabold">Up to 90%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionHeading title="90% of Customers Recommend Going Solar" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Pune Homeowner", "Our bill reduction estimate was explained clearly before installation, and the final work was neat."],
              ["PCMC Customer", "The subsidy and net-metering process felt much easier with one team guiding every step."],
              ["Residential Family", "We understood the roof layout, investment, and savings direction before saying yes."],
            ].map(([name, quote]) => (
              <div key={name} className="rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                <Shield className="h-6 w-6 text-primary" />
                <p className="mt-4 text-sm leading-7 text-muted-foreground">"{quote}"</p>
                <div className="mt-5 text-base font-extrabold text-foreground">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-12">
        <div className="container mx-auto px-4">
          <SectionHeading title="Frequently Asked Questions" />
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-card p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
            <Accordion type="single" collapsible className="space-y-3">
              {homeownerFaqs.map((item, index) => (
                <AccordionItem key={item.question} value={`home-offering-faq-${index}`} className="rounded-[1.25rem] border border-border px-5 data-[state=open]:bg-muted/40">
                  <AccordionTrigger className="py-5 text-left text-base font-bold text-foreground hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2rem] px-8 py-10 text-primary-foreground shadow-[0_24px_70px_rgba(2,12,27,0.25)] md:px-12">
            <img src={trustGuaranteedSavingsImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,18,0.92)_0%,rgba(4,10,18,0.76)_54%,rgba(4,10,18,0.68)_100%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-extrabold md:text-4xl">Book a free home solar consultation.</h2>
                <p className="mt-3 text-base leading-8 text-primary-foreground/78">Get rooftop feasibility, system size, subsidy direction, and savings clarity before you decide.</p>
              </div>
              <a href="#home-consultation" className="gradient-cta shine inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-foreground">
                Schedule Free Visit
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SparklineIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
    <Zap className="h-5 w-5 text-primary" />
  </div>
);

const Residential = () => {
  const location = useLocation();
  const segment = useMemo<Segment>(() => {
    const value = new URLSearchParams(location.search).get("segment");
    return value === "housing-society" ? "housing-society" : "homes";
  }, [location.search]);

  if (segment === "homes") {
    return <HomeOfferingPage />;
  }

  const content = contentBySegment[segment];

  const [homeBill, setHomeBill] = useState(5000);
  const [societyBill, setSocietyBill] = useState(80000);
  const bill = segment === "housing-society" ? societyBill : homeBill;
  const savings = Math.round(bill * content.savingsRatio * 12);

  return (
    <div>
      <PageBanner
        title={content.bannerTitle}
        subtitle={content.bannerSubtitle}
        breadcrumbs={[{ label: "Home", path: "/" }, { label: content.breadcrumbLabel }]}
      />

      <section className="pt-8">
        <div className="container mx-auto px-4">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <Link
              to="/residential"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                segment === "homes" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              Homes
            </Link>
            <Link
              to="/residential?segment=housing-society"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                segment === "housing-society" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              Housing Society
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title={content.benefitsTitle} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.benefits.map((item, index) => (
              <motion.div
                key={item.title}
                className="card-hover rounded-2xl border border-border bg-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <SectionHeading title={content.trustShowcaseTitle} />
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {content.trustShowcaseCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="mx-auto mb-4 h-56 w-full max-w-[240px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_14px_35px_rgba(12,20,31,0.08)]">
                  <img src={card.image} alt={card.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground">{card.title}</h3>
                <p className="mx-auto mt-2 max-w-[280px] text-sm leading-7 text-muted-foreground">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title={content.subsidyTitle} subtitle={content.subsidySubtitle} />

          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">System Size</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Indicative Subsidy</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Indicative Net Cost</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {content.subsidyRows.map((row, index) => (
                    <tr key={row.size} className={index < content.subsidyRows.length - 1 ? "border-b border-border" : ""}>
                      <td className="px-4 py-3">{row.size}</td>
                      <td className="px-4 py-3 font-medium text-primary">{row.subsidy}</td>
                      <td className="px-4 py-3">{row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Indicative figures only. Final pricing depends on city, roof conditions, product choices, and utility/discom requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title={content.journeyTitle} />
          <div className="grid gap-8 md:grid-cols-2">
            {content.journeySteps.map((step, index) => (
              <motion.div
                key={step.title}
                className="card-hover rounded-2xl border border-border bg-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="mb-4 inline-flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-2 font-bold text-foreground">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title={content.trustTitle} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.trustPoints.map((item, index) => (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <item.icon className="mb-3 h-6 w-6 text-primary" />
                <h4 className="mb-2 font-bold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-2xl px-4">
          <SectionHeading title={content.estimateTitle} />
          <div className="rounded-2xl border border-border bg-card p-8">
            <label className="mb-2 block text-sm font-medium text-foreground">
              {content.billLabel}: Rs.{bill.toLocaleString("en-IN")}
            </label>
            <input
              type="range"
              min={content.billMin}
              max={content.billMax}
              step={content.billStep}
              value={bill}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (segment === "housing-society") {
                  setSocietyBill(value);
                } else {
                  setHomeBill(value);
                }
              }}
              className="mb-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-solar-orange"
            />
            <div className="rounded-xl bg-primary/5 p-6 text-center">
              <div className="text-3xl font-bold text-primary">Rs.{savings.toLocaleString("en-IN")}</div>
              <div className="mt-1 text-sm text-muted-foreground">Estimated Annual Savings</div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{content.estimateNote}</p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title={content.faqTitle} />
          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 md:p-8">
            <Accordion type="single" collapsible className="space-y-3">
              {content.faqs.map((item, index) => (
                <AccordionItem key={item.question} value={`res-faq-${index}`} className="rounded-xl border border-border px-5 data-[state=open]:bg-muted/40">
                  <AccordionTrigger className="py-4 text-left text-base font-bold text-foreground hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-7 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-xl px-4">
          <SectionHeading title={content.ctaTitle} />
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <LeadForm />
            <p className="mt-3 text-xs text-muted-foreground">{content.ctaNote}</p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-2xl border border-primary px-6 py-4 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Residential;
