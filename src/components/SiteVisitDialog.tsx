import { FormEvent, useState } from "react";
import { BriefcaseBusiness, Building2, CalendarCheck, CheckCircle2, Factory, Home, IndianRupee, MapPin, Phone, UserRound, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { getMarketingContext, trackEvent } from "@/lib/analytics";
import { submitLead } from "@/lib/api";
import heroHomeBanner from "@/assets/hero-home-banner.jpg";

interface SiteVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const propertyTypes = [
  { label: "Home", icon: Home },
  { label: "Housing Society", icon: Building2 },
  { label: "Commercial", icon: BriefcaseBusiness },
  { label: "Industrial", icon: Factory },
];

const billRanges = [
  { label: "Below Rs.3,000", value: "2500" },
  { label: "Rs.3,000 - Rs.10,000", value: "6500" },
  { label: "Rs.10,000 - Rs.50,000", value: "30000" },
  { label: "Above Rs.50,000", value: "50000" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const SiteVisitDialog = ({ open, onOpenChange }: SiteVisitDialogProps) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    pinCode: "",
    propertyType: "",
    bill: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBillLabel = billRanges.find((item) => item.value === form.bill)?.label ?? "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.propertyType || !form.bill) {
      toast({
        title: "Complete required details",
        description: "Please select customer type and monthly bill range.",
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
        city: form.city,
        bill: form.bill,
        message: `Site visit request; Type: ${form.propertyType}; Bill range: ${selectedBillLabel}; Note: ${form.note || "Not provided"}`,
        sourcePage: context.path,
        referrer: context.referrer,
        utmSource: context.utmSource,
        utmMedium: context.utmMedium,
        utmCampaign: context.utmCampaign,
      });

      await trackEvent("site_visit_popup_submitted", {
        sourcePage: context.path,
        propertyType: form.propertyType,
      });

      toast({
        title: "Site visit booked",
        description: "Thank you. Our solar expert will contact you shortly.",
      });

      setForm({ name: "", phone: "", city: "", pinCode: "", propertyType: "", bill: "", note: "" });
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-0 bg-white p-0 shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:rounded-2xl">
        <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
          <div className="relative flex min-h-full flex-col overflow-hidden bg-[#10231b] p-6 text-white md:p-7">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(19,111,50,0.92),rgba(16,35,27,0.98))]" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,rgba(245,158,11,0.32),transparent)]" />
            <div className="relative z-10 flex min-h-full flex-col">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/12">
                <CalendarCheck className="h-6 w-6 text-[#f7b733]" />
              </div>
              <DialogHeader className="mt-6 text-left">
                <DialogTitle className="text-3xl font-extrabold leading-tight text-white">Book a Free Site Visit</DialogTitle>
                <DialogDescription className="text-base leading-7 text-white/72">
                  Share a few essentials and our solar expert will call you with the right next step.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 space-y-4">
                {[
                  "Rooftop feasibility check",
                  "Savings and subsidy guidance",
                  "System size recommendation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white/88">
                    <CheckCircle2 className="h-5 w-5 text-[#f7b733]" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="relative mt-8 min-h-64 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
                <img src={heroHomeBanner} alt="Solar panels on a rooftop" className="h-full min-h-64 w-full object-cover object-center" loading="lazy" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,35,24,0.04),rgba(8,35,24,0.68))]" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 p-4 text-[#10231b] shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                      <Zap className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold">Free rooftop survey</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-600">Savings plan after site visit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 md:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <UserRound className="h-3.5 w-3.5" />
                  Name
                </span>
                <input
                  className={inputClass}
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  WhatsApp
                </span>
                <input
                  className={inputClass}
                  required
                  inputMode="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10-digit number"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }))}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  City
                </span>
                <select
                  className={inputClass}
                  required
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  <option value="Pune">Pune</option>
                  <option value="PCMC">PCMC</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  PIN Code
                </span>
                <input
                  className={inputClass}
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="6-digit pincode"
                  value={form.pinCode}
                  onChange={(event) => setForm((current) => ({ ...current, pinCode: event.target.value.replace(/\D/g, "").slice(0, 6) }))}
                />
              </label>
            </div>

            <div>
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                <Building2 className="h-3.5 w-3.5" />
                Customer Type
              </span>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypes.map((type) => {
                  const selected = form.propertyType === type.label;
                  const TypeIcon = type.icon;

                  return (
                    <button
                      key={type.label}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, propertyType: type.label }))}
                      className={`flex min-h-16 items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm font-bold transition-all ${
                        selected
                          ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-white/18 text-white" : "bg-white text-primary shadow-sm"}`}>
                        <TypeIcon className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0 leading-5">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                <IndianRupee className="h-3.5 w-3.5" />
                Monthly Electricity Bill
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                {billRanges.map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, bill: range.value }))}
                    className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-bold transition-all ${
                      form.bill === range.value
                        ? "border-[#f59e0b] bg-[#f59e0b] text-slate-950 shadow-lg shadow-[#f59e0b]/20"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#f59e0b]/50 hover:bg-[#f59e0b]/8"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                <Zap className="h-3.5 w-3.5" />
                Note
              </span>
              <textarea
                className={`${inputClass} min-h-20 resize-none`}
                placeholder="Society name, preferred visit time, or roof details"
                value={form.note}
                onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="gradient-cta shine flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-extrabold text-slate-950 shadow-lg shadow-secondary/25 transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Booking..." : "Book Site Visit"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SiteVisitDialog;
