import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  IndianRupee,
  Landmark,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Star,
  Sun,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { getMarketingContext, trackEvent } from "@/lib/analytics";
import { submitLead } from "@/lib/api";
import trustAfterSalesImage from "@/assets/Reliable Service.png";
import trustGuaranteedSavingsImage from "@/assets/Savings-first Design.png";
import trustHassleFreeProcessImage from "@/assets/Hassle-free Process.png";
import trustStormProofImage from "@/assets/Durable Structure.png";

const projectImage = "/assets/project/DJI_20250609154417_0168_D.JPG.jpeg";
const projectImageTwo = "/assets/project/DJI_20250609153027_0162_D.JPG.jpeg";
const projectImageThree = "/assets/project/DJI_20250609154421_0169_D.JPG.jpeg";

const trustLogos = ["Manjari Green", "Hadapsar CHS", "Pune Societies", "PCMC Rooftops", "Residential Towers", "Common Area Loads"];

const whyCards = [
  {
    image: trustGuaranteedSavingsImage,
    title: "Savings-led Design",
    desc: "Common-area load, roof area, and tariff are reviewed before recommending system capacity.",
  },
  {
    image: trustHassleFreeProcessImage,
    title: "Committee-friendly Process",
    desc: "Proposal, AGM discussion points, documentation, and installation are coordinated in one flow.",
  },
  {
    image: trustStormProofImage,
    title: "Durable Rooftop Structure",
    desc: "Mounting plans are selected for long-term roof safety, wind resilience, and clean workmanship.",
  },
  {
    image: trustAfterSalesImage,
    title: "Ongoing Maintenance",
    desc: "After commissioning, planned support keeps generation consistent for society facilities.",
  },
];

const cityProjects = [
  { city: "Hadapsar", count: "300 kW", detail: "Manjari Green Ph 4 CHS" },
  { city: "Pune", count: "1 MW", detail: "Manjari Green Phase 5" },
  { city: "PCMC", count: "100 kW+", detail: "Society rooftop planning" },
];

const projectStats = [
  { icon: Building2, value: "1 MW", label: "Large Society Project" },
  { icon: Zap, value: "300 kW", label: "CHS Installation" },
  { icon: IndianRupee, value: "Up to 90%", label: "Bill Reduction Target" },
  { icon: Wrench, value: "25 yrs", label: "System Life Planning" },
];

const savingsBlocks = [
  {
    icon: IndianRupee,
    title: "Government subsidy guidance",
    desc: "Eligible housing societies can plan with current subsidy norms and documentation support.",
  },
  {
    icon: Landmark,
    title: "CAPEX and OPEX options",
    desc: "Choose upfront ownership, zero-investment solar, or a model suited to your committee's budget.",
  },
  {
    icon: ClipboardCheck,
    title: "Breakeven visibility",
    desc: "We help estimate payback from real common-area bills before the society makes a decision.",
  },
];

const journey = [
  "Free site visit and bill study",
  "Technical feasibility and savings proposal",
  "Committee and AGM approval support",
  "Installation, net-metering, and subsidy workflow",
  "Commissioning plus maintenance support",
];

const testimonials = [
  {
    quote: "The proposal made it easy for our committee to understand common-area savings, rooftop use, and payback before moving ahead.",
    name: "Management Committee Member",
    role: "Housing Society, Pune",
  },
  {
    quote: "Suntech handled the rooftop planning and execution clearly. The installation work was organized and professional.",
    name: "Facility Coordinator",
    role: "Hadapsar CHS",
  },
  {
    quote: "Our society needed practical guidance for approvals and long-term maintenance. The team kept the discussion simple and useful.",
    name: "Society Resident",
    role: "PCMC",
  },
];

const faqs = [
  {
    question: "How much can a housing society save with rooftop solar?",
    answer:
      "Many societies target up to 90% reduction on common-area electricity bills. Final savings depend on sanctioned load, roof area, tariff, and installed capacity.",
  },
  {
    question: "Do we need AGM approval before installing solar?",
    answer:
      "Most societies need committee and AGM approval before execution. A feasibility visit and savings proposal can be prepared first so residents can review the decision clearly.",
  },
  {
    question: "Is subsidy available for housing societies?",
    answer:
      "Eligible group housing projects can receive subsidy support under current rooftop solar schemes. The final amount depends on government rules, capacity, and approval status at the time of application.",
  },
  {
    question: "Which society loads can solar support?",
    answer:
      "Solar is commonly used for lifts, pumps, parking lights, staircase lighting, clubhouses, security systems, and other shared facilities connected to common meters.",
  },
  {
    question: "What happens after installation?",
    answer:
      "After commissioning, Suntech can support monitoring guidance, cleaning schedules, periodic checks, and service coordination so generation remains healthy.",
  },
];

const inputClass =
  "w-full rounded-xl border border-[#d8deec] bg-white px-4 py-4 text-sm text-[#242b5a] placeholder:text-[#697098] transition-all focus:border-[#1b25a8] focus:outline-none focus:ring-2 focus:ring-[#1b25a8]/15";

const billOptions = ["0 - Rs.50,000", "Rs.50,000 - Rs.2 Lacs", "Above Rs.2 Lacs"];
const agmOptions = ["We already have AGM approval", "We do not have AGM approval yet", "We want help preparing for AGM"];
const designationOptions = ["Management committee member", "Resident", "Builder", "Facility manager"];

const SocietyVisitForm = () => {
  const [form, setForm] = useState({
    name: "",
    societyName: "",
    pinCode: "",
    phone: "",
    agm: "",
    bill: "",
    designation: "",
  });
  const [accepted, setAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.agm || !form.bill || !form.designation) {
      toast({
        title: "Complete the form",
        description: "Please select AGM status, monthly bill range, and your designation.",
        variant: "destructive",
      });
      return;
    }

    if (!accepted) {
      toast({
        title: "Accept terms",
        description: "Please accept the terms and privacy policy before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const context = getMarketingContext();
      await submitLead({
        name: form.name,
        phone: form.phone,
        pinCode: form.pinCode,
        city: "Pune",
        bill: form.bill === "Above Rs.2 Lacs" ? "200000" : form.bill === "Rs.50,000 - Rs.2 Lacs" ? "125000" : "50000",
        message: `Housing Society: ${form.societyName}; AGM: ${form.agm}; Designation: ${form.designation}; Bill range: ${form.bill}`,
        sourcePage: context.path,
        referrer: context.referrer,
        utmSource: context.utmSource,
        utmMedium: context.utmMedium,
        utmCampaign: context.utmCampaign,
      });

      await trackEvent("housing_society_lead_submitted", { sourcePage: context.path });

      toast({
        title: "Visit request received",
        description: "Our solar consultant will contact you shortly.",
      });

      setForm({ name: "", societyName: "", pinCode: "", phone: "", agm: "", bill: "", designation: "" });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold leading-tight text-[#101840] md:text-3xl">Book a FREE Visit</h2>
        <p className="mt-3 text-sm leading-6 text-[#4c527e]">
          Our solar consultant will assess your common-area load and prepare a society savings plan.
        </p>
      </div>

      <input className={inputClass} placeholder="Full Name" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
      <input className={inputClass} placeholder="Name of the Housing Society" required value={form.societyName} onChange={(event) => setForm((current) => ({ ...current, societyName: event.target.value }))} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="PIN Code"
          required
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={form.pinCode}
          onChange={(event) => setForm((current) => ({ ...current, pinCode: event.target.value.replace(/\D/g, "").slice(0, 6) }))}
        />
        <input
          className={inputClass}
          placeholder="Whatsapp Number"
          required
          inputMode="tel"
          pattern="[0-9]{10}"
          maxLength={10}
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }))}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-[#242b5a]">AGM Approval Status</label>
        <select className={inputClass} required value={form.agm} onChange={(event) => setForm((current) => ({ ...current, agm: event.target.value }))}>
          <option value="" disabled>
            Select status
          </option>
          {agmOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-[#242b5a]">Monthly Common-Area Electricity Bill</label>
        <div className="grid gap-2 sm:grid-cols-3">
          {billOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setForm((current) => ({ ...current, bill: option }))}
              className={`min-h-12 rounded-xl border px-3 py-3 text-xs font-extrabold transition-colors ${
                form.bill === option ? "border-[#111eb4] bg-[#111eb4] text-white" : "border-[#d8deec] bg-white text-[#111544] hover:border-[#111eb4]/35"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-[#242b5a]">Your Designation in the Society</label>
        <select className={inputClass} required value={form.designation} onChange={(event) => setForm((current) => ({ ...current, designation: event.target.value }))}>
          <option value="" disabled>
            Select designation
          </option>
          {designationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-start gap-2 text-sm leading-6 text-[#3d456e]">
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 rounded border-[#9ba4e8] accent-[#98a0ea]" />
        <span>I agree to Suntech Green Energy terms and privacy policy.</span>
      </label>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#111544] py-4 font-bold text-white shadow-lg transition-colors hover:bg-[#0f1338] disabled:cursor-not-allowed disabled:opacity-70">
        {isSubmitting ? "Sending..." : "Get Started"}
      </button>
    </form>
  );
};

const HousingSociety = () => (
  <div className="bg-[#f7f9fc]">
    <section className="relative isolate overflow-hidden pt-24 lg:pt-28">
      <div className="absolute inset-0" aria-hidden="true">
        <img src={projectImage} alt="" className="h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,43,0.92)_0%,rgba(8,13,43,0.82)_48%,rgba(8,13,43,0.5)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pb-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_460px] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-white/85">
              <Building2 className="h-4 w-4 text-[#ffbe3d]" />
              Housing Society Solar
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Slash your society's common-area electricity bills by up to 90%.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
              Rooftop solar for apartment complexes and CHS communities, managed from feasibility and approvals to installation and maintenance.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#society-visit" className="gradient-cta shine inline-flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-extrabold text-[#111544]">
                Schedule a FREE Visit
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/projects" className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-6 py-4 text-sm font-bold text-white hover:bg-white/10">
                View Society Projects
              </Link>
            </div>

            <div className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur">
              <Star className="h-5 w-5 fill-[#ffbe3d] text-[#ffbe3d]" />
              Trusted by housing societies across Pune and PCMC
            </div>
          </motion.div>

          <motion.div id="society-visit" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }} className="rounded-[1rem] bg-white p-5 shadow-[0_24px_70px_rgba(3,7,18,0.28)] md:p-7">
            <SocietyVisitForm />
          </motion.div>
        </div>
      </div>
    </section>

    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-extrabold text-foreground md:text-3xl">Trusted Across Local Housing Communities</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {trustLogos.map((item) => (
            <div key={item} className="flex min-h-20 items-center justify-center rounded-lg border border-border bg-[#f7f9fc] px-4 text-center text-sm font-extrabold text-[#101840]">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title="Why Choose Suntech" subtitle="Quality-focused rooftop solar for societies that need savings, safety, and clear committee-level decision support." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {whyCards.map((card, index) => (
            <motion.div key={card.title} className="rounded-lg border border-border bg-white p-4 text-center shadow-[0_14px_34px_rgba(15,23,42,0.06)]" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
              <div className="mx-auto h-48 overflow-hidden rounded-lg bg-muted">
                <img src={card.image} alt={card.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {projectStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-white p-5">
              <stat.icon className="h-6 w-6 text-primary" />
              <div className="mt-4 text-2xl font-extrabold text-foreground">{stat.value}</div>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading center={false} title="Our Largest Society Projects" subtitle="Local rooftop work gives committees a clearer reference point before approving their own project." />
            <div className="grid gap-4 sm:grid-cols-3">
              {cityProjects.map((item) => (
                <div key={item.city} className="rounded-lg border border-border bg-[#f7f9fc] p-5">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-xl font-extrabold text-foreground">{item.city}</h3>
                  <p className="mt-1 text-2xl font-extrabold text-primary">{item.count}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <img src={projectImageTwo} alt="Housing society rooftop solar project" className="h-72 w-full rounded-lg object-cover shadow-[0_18px_48px_rgba(15,23,42,0.12)]" loading="lazy" />
            <img src={projectImageThree} alt="Large rooftop solar installation" className="h-72 w-full rounded-lg object-cover shadow-[0_18px_48px_rgba(15,23,42,0.12)] sm:mt-12" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="rounded-lg border border-border bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] md:p-8">
            <SectionHeading center={false} title="Guaranteed Savings Direction" subtitle="A society solar decision should be backed by practical savings numbers, subsidy clarity, and reliable execution planning." />
            <div className="grid gap-4 md:grid-cols-3">
              {savingsBlocks.map((item) => (
                <div key={item.title} className="rounded-lg bg-[#f7f9fc] p-5">
                  <item.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-extrabold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg">
            <img src={trustGuaranteedSavingsImage} alt="Solar panels installed on a rooftop" className="h-[430px] w-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title="Your Society's Solar Journey" subtitle="A simple approval-to-commissioning flow for residents, committees, and facility teams." />
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-5">
          {journey.map((step, index) => (
            <div key={step} className="relative rounded-lg border border-border bg-[#f7f9fc] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">{index + 1}</div>
              <p className="mt-4 text-sm font-extrabold leading-6 text-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading center={false} title="Safety Comes First" subtitle="Society rooftops need durable structures, clean cable routing, and planned maintenance after commissioning." />
            <div className="space-y-3">
              {["Roof-safe installation practices", "Weather-ready mounting direction", "Net-metering and documentation support", "Scheduled service and maintenance planning"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-white p-4 text-sm font-bold text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [ShieldCheck, "Structural Safety", "Mounting selected for reliable long-term rooftop performance."],
              [Award, "Quality Components", "Panels, inverters, and structures selected around project need."],
              [FileText, "Documentation", "Committee, utility, and subsidy paperwork guidance."],
              [BadgeCheck, "Service Support", "After-sales support for stable generation and maintenance."],
            ].map(([Icon, title, desc]) => (
              <div key={title as string} className="rounded-lg border border-border bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 font-extrabold text-foreground">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title="A Glimpse of Society Customer Feedback" />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-lg border border-border bg-[#f7f9fc] p-6">
              <Users className="h-6 w-6 text-primary" />
              <p className="mt-4 text-sm leading-7 text-muted-foreground">"{item.quote}"</p>
              <h3 className="mt-5 font-extrabold text-foreground">{item.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title="Frequently Asked Questions" />
        <div className="mx-auto max-w-4xl rounded-lg border border-border bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] md:p-7">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`society-faq-${index}`} className="rounded-lg border border-border px-5 data-[state=open]:bg-[#f7f9fc]">
                <AccordionTrigger className="py-5 text-left text-base font-bold text-foreground hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>

    <section className="pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg px-7 py-10 text-white shadow-[0_24px_70px_rgba(2,12,27,0.22)] md:px-10">
          <img src={projectImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,43,0.94),rgba(8,13,43,0.72))]" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold md:text-4xl">Start saving on society electricity bills.</h2>
              <p className="mt-3 text-base leading-8 text-white/76">Book a free feasibility visit for rooftop space, common load, subsidy direction, and payback clarity.</p>
            </div>
            <a href="#society-visit" className="gradient-cta shine inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-extrabold text-[#111544]">
              Book Free Visit
              <PhoneCall className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default HousingSociety;
