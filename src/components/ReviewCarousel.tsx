import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { TestimonialItem } from "@/lib/default-content";
import { cn } from "@/lib/utils";

type ReviewCarouselProps = {
  testimonials: TestimonialItem[];
  variant?: "light" | "dark";
  className?: string;
  itemClassName?: string;
};

const ReviewCarousel = ({ testimonials, variant = "light", className, itemClassName }: ReviewCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateState = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateState();
    api.on("select", updateState);
    api.on("reInit", updateState);

    return () => {
      api.off("select", updateState);
      api.off("reInit", updateState);
    };
  }, [api]);

  if (testimonials.length === 0) {
    return null;
  }

  const isDark = variant === "dark";

  return (
    <div className={cn("w-full", className)}>
      <Carousel setApi={setApi} opts={{ align: "start", loop: testimonials.length > 4 }}>
        <CarouselContent className="items-stretch">
          {testimonials.map((testimonial, index) => (
            <CarouselItem
              key={testimonial.sourceId || `${testimonial.name}-${index}`}
              className={cn("md:basis-1/2", itemClassName)}
            >
              <article
                className={cn(
                  "flex h-full flex-col rounded-[2rem] border p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] md:p-7",
                  isDark
                    ? "border-white/10 bg-white/[0.08] text-primary-foreground backdrop-blur-xl"
                    : "border-border bg-card text-foreground",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
                      isDark ? "bg-white/10 text-primary-foreground/80" : "bg-primary/10 text-primary",
                    )}
                  >
                    {testimonial.sourceLabel || "Customer Review"}
                  </div>
                  {testimonial.reviewedAt ? (
                    <div className={cn("text-xs font-medium", isDark ? "text-primary-foreground/65" : "text-muted-foreground")}>
                      {new Date(testimonial.reviewedAt).toLocaleDateString()}
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-solar-yellow text-solar-yellow" />
                  ))}
                </div>

                <p className={cn("mt-5 flex-1 text-sm leading-7", isDark ? "text-primary-foreground/78" : "text-muted-foreground")}>
                  "{testimonial.text}"
                </p>

                <div className={cn("mt-6 flex items-center gap-3 border-t pt-5", isDark ? "border-white/10" : "border-border")}>
                  {testimonial.imageUrl ? (
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      loading="lazy"
                      className={cn(
                        "h-12 w-12 rounded-full object-cover",
                        isDark ? "border border-white/10" : "border border-border",
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold",
                        isDark ? "gradient-cta text-foreground" : "bg-primary text-primary-foreground",
                      )}
                    >
                      {testimonial.initials || testimonial.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className={cn("font-bold", isDark ? "text-primary-foreground" : "text-foreground")}>{testimonial.name}</div>
                    <div className={cn("text-sm", isDark ? "text-primary-foreground/65" : "text-muted-foreground")}>{testimonial.role}</div>
                  </div>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {count > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to review ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  current === index
                    ? isDark
                      ? "w-8 bg-solar-yellow"
                      : "w-8 bg-primary"
                    : isDark
                      ? "w-2.5 bg-white/25 hover:bg-white/45"
                      : "w-2.5 bg-primary/20 hover:bg-primary/40",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
              className={cn(
                "h-10 w-10 rounded-full",
                isDark
                  ? "border-white/15 bg-white/10 text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous review</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
              className={cn(
                "h-10 w-10 rounded-full",
                isDark
                  ? "border-white/15 bg-white/10 text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next review</span>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ReviewCarousel;
