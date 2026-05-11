import { motion } from "framer-motion";
import { Award, BadgePercent, Building, CheckCircle, CreditCard, Eye, FileText, Target, Users } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import ReviewCarousel from "@/components/ReviewCarousel";
import SectionHeading from "@/components/SectionHeading";
import { usePublicContent } from "@/hooks/use-public-content";

const team = [
  { name: "Aditya Sharma", role: "Founder & CEO", initials: "AS" },
  { name: "Priya Deshmukh", role: "Head of Engineering", initials: "PD" },
  { name: "Rohit Mehta", role: "Sales Director", initials: "RM" },
  { name: "Sneha Patil", role: "Operations Manager", initials: "SP" },
];

const financingOptions = [
  {
    icon: BadgePercent,
    title: "Solar Loans",
    desc: "Easy EMI options starting from ₹999/month with partner banks. Zero collateral required.",
  },
  {
    icon: CreditCard,
    title: "₹0 Upfront (OPEX)",
    desc: "No investment needed. Pay only for the power you consume at a discounted rate.",
  },
  {
    icon: Building,
    title: "Government Subsidy",
    desc: "Up to 40% subsidy for residential systems under PM Surya Ghar Yojana.",
  },
  {
    icon: FileText,
    title: "PPA Model",
    desc: "Power Purchase Agreement for commercial clients. Fixed rate for 25 years.",
  },
];

const subsidyTable = [
  { size: "Up to 1 kW", subsidy: "Rs.30,000/kW", total: "Rs.30,000" },
  { size: "1-2 kW", subsidy: "Rs.30,000/kW", total: "Rs.60,000" },
  { size: "2-3 kW", subsidy: "Rs.18,000/kW", total: "Rs.78,000" },
  { size: "Above 3 kW", subsidy: "Rs.78,000 (fixed)", total: "Rs.78,000" },
];

const certs = ["MNRE Approved", "ISO 9001:2015", "BIS Certified", "NABCB Accredited", "IEC 61215 Compliant", "IS 14286 Certified"];

const About = () => {
  const { data } = usePublicContent();
  const testimonials = data.testimonials;

  return (
    <div>
      <PageBanner
        title={`About ${data.companyProfile.name}`}
        subtitle={`Powering India's transition to clean energy since ${data.companyProfile.yearEstablished}`}
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "About Us" }]}
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                Our Story
              </span>
              <h2 className="mb-4 text-3xl font-bold text-foreground">{data.aboutPage.storyTitle}</h2>
              <p className="mb-4 text-muted-foreground">{data.aboutPage.storyParagraph1}</p>
              <p className="text-muted-foreground">{data.aboutPage.storyParagraph2}</p>
            </motion.div>
            <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {[
                { icon: Target, title: "Mission", desc: "Democratize solar energy access" },
                { icon: Eye, title: "Vision", desc: "100% renewable powered India" },
                { icon: Users, title: "Team", desc: "100+ solar professionals" },
                { icon: Award, title: "Awards", desc: "15+ industry recognitions" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-4 text-center">
                  <item.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <SectionHeading tag="Team" title="Meet Our Leadership" />
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="card-hover rounded-2xl border border-border bg-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="gradient-solar mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-primary-foreground">
                  {member.initials}
                </div>
                <h4 className="text-sm font-bold text-foreground">{member.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            tag="Options"
            title="Flexible Financing Solutions"
            subtitle="The same financing options are now available directly inside the About page for easier browsing."
          />

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {financingOptions.map((option, index) => (
              <motion.div
                key={option.title}
                className="card-hover flex gap-4 rounded-2xl border border-border bg-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="gradient-solar flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                  <option.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="mb-1 font-bold text-foreground">{option.title}</h4>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            tag="Subsidy"
            title="Government Subsidy Details"
            subtitle="Subsidy guidance now sits on the About page too, so financing and support details stay together in one place."
          />

          <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">System Size</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Subsidy Rate</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Max Subsidy</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {subsidyTable.map((row) => (
                    <tr key={row.size} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">{row.size}</td>
                      <td className="px-4 py-3 font-medium text-primary">{row.subsidy}</td>
                      <td className="px-4 py-3">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="scroll-mt-28 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              tag="Customer Reviews"
              title="What customers say about our solar work"
              subtitle="Browse customer feedback in a cleaner carousel layout, with multiple review cards visible together on larger screens."
            />

            <ReviewCarousel
              testimonials={testimonials}
              itemClassName="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading tag="Quality" title="Certifications & Standards" />
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3">
            {certs.map((certification, index) => (
              <motion.div
                key={certification}
                className="card-hover flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium text-foreground">{certification}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
