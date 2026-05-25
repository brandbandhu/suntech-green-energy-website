import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { submitLead } from "@/lib/api";
import { getMarketingContext, trackEvent } from "@/lib/analytics";

interface LeadFormProps {
  compact?: boolean;
  fillHeight?: boolean;
  showConsultationHeader?: boolean;
}

const inputClass =
  "w-full rounded-2xl border border-border/80 bg-muted/40 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/25";

const billOptions = [
  { label: "₹3000 - ₹5000", value: "4000" },
  { label: "Above ₹5000", value: "6000" },
];

const LeadForm = ({ compact = false, fillHeight = false, showConsultationHeader = false }: LeadFormProps) => {
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pinCode: "",
    city: "",
    bill: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldSpacingClass = compact ? "space-y-3" : "space-y-4";

  useEffect(() => {
    const cityFromUrl = new URLSearchParams(location.search).get("city");
    if (cityFromUrl === "Pune" || cityFromUrl === "PCMC") {
      setForm((current) => ({ ...current, city: cityFromUrl }));
    }
  }, [location.search]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.bill) {
      toast({
        title: "Select monthly bill range",
        description: "Please choose your monthly electricity bill category to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const context = getMarketingContext();

      await submitLead({
        ...form,
        sourcePage: context.path,
        referrer: context.referrer,
        utmSource: context.utmSource,
        utmMedium: context.utmMedium,
        utmCampaign: context.utmCampaign,
      });

      await trackEvent("lead_submitted", {
        sourcePage: context.path,
      });

      toast({
        title: "Thank you!",
        description: "Your enquiry has been sent successfully. Our team will contact you shortly.",
      });

      setForm({
        name: "",
        phone: "",
        pinCode: "",
        city: "",
        bill: "",
      });
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
    <form onSubmit={handleSubmit} className={fillHeight ? "flex h-full flex-col gap-4" : "space-y-4"}>
      {showConsultationHeader ? (
        <div>
          <h3 className="text-3xl font-extrabold leading-tight text-foreground">Book a FREE Solar Consultation</h3>
          <p className="mt-2 text-base text-muted-foreground">And save up to ₹78,000 with subsidy</p>
        </div>
      ) : null}

      <div className={fillHeight ? "flex flex-1 flex-col gap-4" : fieldSpacingClass}>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          className={inputClass}
        />
        <input
          type="tel"
          placeholder="WhatsApp Number"
          required
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="PIN Code"
          required
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={form.pinCode}
          onChange={(event) => setForm((current) => ({ ...current, pinCode: event.target.value.replace(/\D/g, "").slice(0, 6) }))}
          className={inputClass}
        />
        <select
          required
          value={form.city}
          onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
          className={inputClass}
        >
          <option value="" disabled>
            Select City
          </option>
          <option value="Pune">Pune</option>
          <option value="PCMC">PCMC</option>
        </select>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Monthly Electricity Bill</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {billOptions.map((option) => {
              const selected = form.bill === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, bill: option.value }))}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/80 bg-muted/40 text-foreground hover:bg-muted/65"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <input type="hidden" name="monthlyBillCategory" value={form.bill} required />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full rounded-xl bg-[#111544] py-4 font-bold text-white shadow-lg transition-colors hover:bg-[#0f1338] disabled:cursor-not-allowed disabled:opacity-70 ${fillHeight ? "mt-auto" : ""}`}
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting ? "Sending..." : "Book a FREE Consultation"}
        </span>
      </button>
    </form>
  );
};

export default LeadForm;
