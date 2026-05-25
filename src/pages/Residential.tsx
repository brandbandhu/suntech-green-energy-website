import { motion } from "framer-motion";
import { ArrowRight, Battery, Building2, FileText, Home, Landmark, Shield, Sun, Wrench, Zap, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import LeadForm from "@/components/LeadForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import trustAfterSalesImage from "@/assets/trust-after-sales.webp";
import trustGuaranteedSavingsImage from "@/assets/trust-guaranteed-savings.webp";
import trustHassleFreeProcessImage from "@/assets/trust-hassle-free-process.webp";
import trustStormProofImage from "@/assets/trust-storm-proof.webp";

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

const Residential = () => {
  const location = useLocation();
  const segment = useMemo<Segment>(() => {
    const value = new URLSearchParams(location.search).get("segment");
    return value === "housing-society" ? "housing-society" : "homes";
  }, [location.search]);

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
