import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CircleDollarSign,
  ClipboardCheck,
  Home,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Wrench,
  Zap,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import SectionHeading from "@/components/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroHomeBanner from "@/assets/hero-home-banner.jpg";
import trustAfterSalesImage from "@/assets/Reliable Service.png";
import trustGuaranteedSavingsImage from "@/assets/Savings-first Design.png";
import trustHassleFreeProcessImage from "@/assets/Hassle-free Process.png";
import trustStormProofImage from "@/assets/Durable Structure.png";

const trustCards = [
  {
    image: trustGuaranteedSavingsImage,
    title: "Savings-first Design",
    desc: "Your system size is planned around real bill reduction, roof conditions, and practical long-term payback.",
  },
  {
    image: trustHassleFreeProcessImage,
    title: "End-to-end Process",
    desc: "Survey, design, installation, net metering guidance, and subsidy workflow are handled in one clear flow.",
  },
  {
    image: trustStormProofImage,
    title: "Durable Mounting",
    desc: "Rooftop structures are planned for stability, clean alignment, and long service life in local weather.",
  },
  {
    image: trustAfterSalesImage,
    title: "After-sales Support",
    desc: "Service guidance and performance checks help keep your solar plant generating consistently after handover.",
  },
];

const proofStats = [
  { value: "500+", label: "Homes Solarized", icon: Home },
  { value: "1 MW+", label: "Power Installed", icon: Zap },
  { value: "100%", label: "Customer Satisfaction", icon: BadgeCheck },
  { value: "Rs.78k", label: "Subsidy Guidance", icon: CircleDollarSign },
];

const priceRows = [
  { size: "2 kW", subsidy: "Rs. 60,000", netCost: "Rs. 1.23 lakh approx", savings: "Rs. 10.7 lakh approx" },
  { size: "3 kW", subsidy: "Rs. 78,000", netCost: "Rs. 1.37 lakh approx", savings: "Rs. 16.1 lakh approx" },
  { size: "4 kW", subsidy: "Rs. 78,000", netCost: "Rs. 1.82 lakh approx", savings: "Rs. 21.4 lakh approx" },
  { size: "5 kW", subsidy: "Rs. 78,000", netCost: "Rs. 2.45 lakh approx", savings: "Rs. 33.4 lakh approx" },
  { size: "10 kW", subsidy: "Rs. 78,000", netCost: "Rs. 5.05 lakh approx", savings: "Rs. 66.9 lakh approx" },
];

const processSteps = [
  {
    icon: MapPin,
    title: "Free Rooftop Visit",
    desc: "We check roof space, shade, electrical load, and your current bill pattern.",
  },
  {
    icon: Calculator,
    title: "Savings and Size Estimate",
    desc: "You get a practical system recommendation with subsidy direction and payback visibility.",
  },
  {
    icon: ClipboardCheck,
    title: "Approvals and Installation",
    desc: "Our team coordinates installation planning, utility process guidance, and documentation steps.",
  },
  {
    icon: Wrench,
    title: "Commissioning and Support",
    desc: "After activation, we remain available for performance guidance and service support.",
  },
];

const testimonialsByLocation = {
  pune: [
  {
    name: "Pune Homeowner",
    location: "Baner, Pune",
    quote: "The consultation was clear, the team explained subsidy and roof layout properly, and the installation looked neat.",
  },
  {
    name: "Residential Customer",
    location: "Kothrud, Pune",
    quote: "We wanted bill reduction without confusion. Suntech helped us understand system size, net metering, and expected savings.",
  },
  {
    name: "Housing Society Committee",
    location: "Wakad, Pune",
    quote: "The proposal made it easier for our committee to compare common-area savings and discuss the project with residents.",
  },
  ],
  pcmc: [
    {
      name: "PCMC Homeowner",
      location: "Ravet, PCMC",
      quote: "The consultation was clear, the team explained subsidy and roof layout properly, and the installation looked neat.",
    },
    {
      name: "Residential Customer",
      location: "Pimpri-Chinchwad",
      quote: "We wanted bill reduction without confusion. Suntech helped us understand system size, net metering, and expected savings.",
    },
    {
      name: "Housing Society Committee",
      location: "Wakad, PCMC",
      quote: "The proposal made it easier for our committee to compare common-area savings and discuss the project with residents.",
    },
  ],
};

const faqsByLocation = {
  pune: [
  {
    question: "What is the cost of solar panel installation in Pune?",
    answer:
      "Indicative residential prices after subsidy can start around Rs. 1.23 lakh for 2 kW and around Rs. 1.37 lakh for 3 kW. Final pricing depends on roof height, structure, panel and inverter choice, utility charges, and site scope.",
  },
  {
    question: "How much subsidy is available for home solar in Pune?",
    answer:
      "Current residential subsidy direction is up to Rs. 30,000 for 1 kW, Rs. 60,000 for 2 kW, and capped around Rs. 78,000 for 3 kW and above, subject to eligibility and current government rules.",
  },
  {
    question: "How long does installation usually take?",
    answer:
      "Small home installations can be completed quickly once design, material readiness, and approvals are in place. The overall project timeline also depends on documentation and utility-side steps.",
  },
  {
    question: "Is rooftop solar good for Pune homes?",
    answer:
      "Yes. Pune has strong solar potential, and many homes with monthly bills above Rs. 1,500 can see meaningful savings when the system is sized correctly.",
  },
  {
    question: "Do you support housing societies in Pune?",
    answer:
      "Yes. Suntech supports housing societies with feasibility study, common-area load assessment, committee-friendly proposal, installation, and after-sales guidance.",
  },
  ],
  pcmc: [
    {
      question: "What is the cost of solar panel installation in PCMC?",
      answer:
        "Indicative residential prices after subsidy can start around Rs. 1.23 lakh for 2 kW and around Rs. 1.37 lakh for 3 kW. Final pricing depends on roof height, structure, panel and inverter choice, utility charges, and site scope.",
    },
    {
      question: "How much subsidy is available for home solar in PCMC?",
      answer:
        "Current residential subsidy direction is up to Rs. 30,000 for 1 kW, Rs. 60,000 for 2 kW, and capped around Rs. 78,000 for 3 kW and above, subject to eligibility and current government rules.",
    },
    {
      question: "How long does installation usually take?",
      answer:
        "Small home installations can be completed quickly once design, material readiness, and approvals are in place. The overall project timeline also depends on documentation and utility-side steps.",
    },
    {
      question: "Is rooftop solar good for PCMC homes?",
      answer:
        "Yes. PCMC homes and societies in areas like Pimpri, Chinchwad, Wakad, Ravet, Moshi, and nearby locations can see meaningful savings when the system is sized correctly.",
    },
    {
      question: "Do you support housing societies in PCMC?",
      answer:
        "Yes. Suntech supports housing societies with feasibility study, common-area load assessment, committee-friendly proposal, installation, and after-sales guidance.",
    },
  ],
};

const locationCopy = {
  pune: {
    badge: "Namaste Pune",
    heroTitle: "Rooftop solar in Pune for homes and housing societies.",
    heroDescription:
      "Power your roof with a savings-led solar system, subsidy guidance up to Rs. 78,000, and dependable local installation support from Suntech Green Energy.",
    trustTitle: "Why Pune Families Trust Suntech",
    calculatorSubtitle: "Move the bill slider to see a quick Pune residential solar direction before the site survey.",
    priceTitle: "Solar Panel Price in Pune With Subsidy",
    priceNote:
      "Figures are adapted as indicative Pune market benchmarks published for April 20, 2026. Prices can change with DISCOM charges, roof height, mounting structure, inverter, panel type, and service scope.",
    proofTitle: "Best Solar Company in Pune for Practical Rooftop Savings",
    proofSubtitle:
      "Pune has strong annual sunlight, rising electricity bills, and many roofs that can support clean power generation. The right rooftop solar partner should help you understand system size, subsidy eligibility, product selection, expected payback, and post-installation service before you commit.",
    proofParagraph1:
      "Suntech Green Energy supports homeowners and housing societies across Pune with survey-led design, transparent quote discussion, installation planning, and after-sales guidance. The goal is simple: make the solar decision easier, more accountable, and more savings-focused.",
    proofParagraph2:
      "Whether you are comparing a 3 kW home solar system or evaluating a larger society project for common-area load, our team helps you map investment, subsidy direction, roof feasibility, and long-term savings in one place.",
    projectsCta: "View Pune Projects",
    projectAlt: "Suntech rooftop solar project in Pune",
    customersTitle: "Happy Pune Customers",
    finalTitle: "Ready to compare your Pune rooftop solar savings?",
    finalDescription: "Book a free consultation and get system size, subsidy direction, and payback clarity for your roof.",
  },
  pcmc: {
    badge: "Namaste PCMC",
    heroTitle: "Rooftop solar in PCMC for homes and housing societies.",
    heroDescription:
      "Power your roof in Pimpri-Chinchwad with a savings-led solar system, subsidy guidance up to Rs. 78,000, and dependable local installation support from Suntech Green Energy.",
    trustTitle: "Why PCMC Families Trust Suntech",
    calculatorSubtitle: "Move the bill slider to see a quick PCMC residential solar direction before the site survey.",
    priceTitle: "Solar Panel Price in PCMC With Subsidy",
    priceNote:
      "Figures are adapted as indicative PCMC market benchmarks published for April 20, 2026. Prices can change with DISCOM charges, roof height, mounting structure, inverter, panel type, and service scope.",
    proofTitle: "Best Solar Company in PCMC for Practical Rooftop Savings",
    proofSubtitle:
      "Pimpri-Chinchwad has strong annual sunlight, rising electricity bills, and many residential roofs and societies that can support clean power generation. The right rooftop solar partner should help you understand system size, subsidy eligibility, product selection, expected payback, and post-installation service before you commit.",
    proofParagraph1:
      "Suntech Green Energy supports homeowners and housing societies across PCMC with survey-led design, transparent quote discussion, installation planning, and after-sales guidance. The goal is simple: make the solar decision easier, more accountable, and more savings-focused.",
    proofParagraph2:
      "Whether you are comparing a 3 kW home solar system or evaluating a larger society project in Pimpri, Chinchwad, Wakad, Ravet, or nearby areas, our team helps you map investment, subsidy direction, roof feasibility, and long-term savings in one place.",
    projectsCta: "View PCMC Projects",
    projectAlt: "Suntech rooftop solar project in PCMC",
    customersTitle: "Happy PCMC Customers",
    finalTitle: "Ready to compare your PCMC rooftop solar savings?",
    finalDescription: "Book a free consultation and get system size, subsidy direction, and payback clarity for your roof.",
  },
};

type PuneSolarProps = {
  location?: keyof typeof locationCopy;
};

const formatCurrency = (amount: number) => `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;

const PuneSolar = ({ location = "pune" }: PuneSolarProps) => {
  const copy = locationCopy[location];
  const testimonials = testimonialsByLocation[location];
  const faqs = faqsByLocation[location];
  const [bill, setBill] = useState(6000);
  const recommendedKw = Math.max(1, Math.round((bill / 850) * 10) / 10);
  const subsidy = recommendedKw <= 1 ? 30000 : recommendedKw <= 2 ? 60000 : 78000;
  const annualSavings = Math.round(bill * 12 * 0.86);
  const monthlyEmi = Math.max(Math.round((recommendedKw * 58000 - subsidy) / 60), 0);
  const twentyFiveYearSavings = annualSavings * 25;

  const calculatorCards = useMemo(
    () => [
      { label: "Recommended Size", value: `${recommendedKw.toLocaleString("en-IN")} kW`, icon: SunMedium },
      { label: "Subsidy Direction", value: formatCurrency(subsidy), icon: CircleDollarSign },
      { label: "Monthly EMI Direction", value: formatCurrency(monthlyEmi), icon: IndianRupee },
      { label: "25-Year Savings", value: formatCurrency(twentyFiveYearSavings), icon: Sparkles },
    ],
    [monthlyEmi, recommendedKw, subsidy, twentyFiveYearSavings],
  );

  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden pb-10 pt-5 md:pb-12">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={heroHomeBanner} alt="" className="h-full w-full object-cover object-[55%_center]" loading="eager" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,13,24,0.9)_0%,rgba(5,13,24,0.78)_45%,rgba(5,13,24,0.62)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,13,24,0.08),rgba(5,13,24,0.84))]" />
        </div>
        <div className="absolute inset-0 solar-grid opacity-25" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/85">
                <MapPin className="h-4 w-4 text-solar-yellow" />
                {copy.badge}
              </div>
              <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight text-primary-foreground md:text-5xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/78 md:text-lg">
                {copy.heroDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#consultation" className="gradient-cta shine inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-sm font-bold text-foreground shadow-lg shadow-secondary/20">
                  Book FREE Consultation
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#calculator" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-7 py-4 text-sm font-semibold text-primary-foreground hover:bg-white/10">
                  Check Savings
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {proofStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                    <stat.icon className="h-5 w-5 text-solar-yellow" />
                    <div className="mt-3 text-2xl font-extrabold text-primary-foreground">{stat.value}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/65">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              id="consultation"
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
          <SectionHeading title={copy.trustTitle} subtitle="The same high-converting page pattern, shaped for your brand, local leads, and real customer decisions." />
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {trustCards.map((card, index) => (
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

      <section id="calculator" className="bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionHeading
                center={false}
                title="Get Savings and EMI Estimates"
                subtitle={copy.calculatorSubtitle}
              />
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
                  <span>Rs. 1,500</span>
                  <span>Rs. 30,000</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {calculatorCards.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                  <item.icon className="h-6 w-6 text-primary" />
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-foreground">{item.value}</p>
                </div>
              ))}
              <div className="sm:col-span-2 rounded-[1.5rem] border border-primary/20 bg-primary/5 p-5 text-sm leading-7 text-muted-foreground">
                These are directional estimates. Final capacity, EMI, subsidy eligibility, and savings are confirmed after roof survey, utility checks, and product selection.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionHeading title={copy.priceTitle} subtitle="Indicative residential benchmarks for quick comparison. Final quote depends on site conditions and chosen components." />
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-5 py-4 text-left font-extrabold text-foreground">System Size</th>
                    <th className="px-5 py-4 text-left font-extrabold text-foreground">Indicative Subsidy</th>
                    <th className="px-5 py-4 text-left font-extrabold text-foreground">Indicative Net Cost</th>
                    <th className="px-5 py-4 text-left font-extrabold text-foreground">25-Year Savings Direction</th>
                  </tr>
                </thead>
                <tbody>
                  {priceRows.map((row, index) => (
                    <tr key={row.size} className={index < priceRows.length - 1 ? "border-b border-border" : ""}>
                      <td className="px-5 py-4 font-bold text-foreground">{row.size}</td>
                      <td className="px-5 py-4 text-primary">{row.subsidy}</td>
                      <td className="px-5 py-4 text-muted-foreground">{row.netCost}</td>
                      <td className="px-5 py-4 text-muted-foreground">{row.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-border px-5 py-4 text-xs leading-6 text-muted-foreground">
              {copy.priceNote}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-12">
        <div className="container mx-auto px-4">
          <SectionHeading title="Go Solar With a Clear Process" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                className="rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">{index + 1}</span>
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <SectionHeading
                center={false}
                title={copy.proofTitle}
                subtitle={copy.proofSubtitle}
              />
              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  {copy.proofParagraph1}
                </p>
                <p>
                  {copy.proofParagraph2}
                </p>
              </div>
              <Link to="/projects" className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-primary px-6 py-4 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground">
                {copy.projectsCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
              <img src="/assets/project/DJI_20250609152835_0158_D.JPG.jpeg" alt={copy.projectAlt} className="h-[420px] w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-12">
        <div className="container mx-auto px-4">
          <SectionHeading title={copy.customersTitle} />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.location} className="rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <p className="mt-4 text-sm leading-7 text-muted-foreground">"{item.quote}"</p>
                <div className="mt-5 text-base font-extrabold text-foreground">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionHeading title="Frequently Asked Questions" />
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-card p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((item, index) => (
                <AccordionItem key={item.question} value={`pune-faq-${index}`} className="rounded-[1.25rem] border border-border px-5 data-[state=open]:bg-muted/40">
                  <AccordionTrigger className="py-5 text-left text-base font-bold text-foreground hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2rem] px-8 py-10 text-primary-foreground shadow-[0_24px_70px_rgba(2,12,27,0.25)] md:px-12">
            <img src={trustGuaranteedSavingsImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,18,0.92)_0%,rgba(4,10,18,0.76)_54%,rgba(4,10,18,0.68)_100%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-extrabold md:text-4xl">{copy.finalTitle}</h2>
                <p className="mt-3 text-base leading-8 text-primary-foreground/78">{copy.finalDescription}</p>
              </div>
              <a href="#consultation" className="gradient-cta shine inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-foreground">
                Book Free Visit
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PuneSolar;
