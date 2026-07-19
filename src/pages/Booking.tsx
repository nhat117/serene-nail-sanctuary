import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { addMinutes, format, isBefore, isToday, startOfDay } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarIcon, Check, Clock, Loader2, Search, X } from "lucide-react";

import { supabase, TENANT_ID } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { bookingCustomerSchema, escapeHtml, validateField } from "@/lib/validation";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";

type Service = {
  id: string;
  name: string;
  description?: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  category?: string | null;
  price_label?: string | null;
  disclaimer?: string | null;
  sort_order?: number;
};

// A day can now have zero, one, or several independent shift blocks (a
// split shift) instead of one row with its own break window — the break
// is just the gap between two blocks, never stored.
type WeeklyShiftBlock = {
  day_of_week: number;
  start_minute: number;
  end_minute: number;
};

function formatMinutesHHMM(mins: number): string {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

type Therapist = {
  id: string;
  name: string;
  is_active: boolean;
  therapist_weekly_hours: WeeklyShiftBlock[];
};

function getTherapistDayBlocks(therapist: Therapist, dayOfWeek: number): WeeklyShiftBlock[] {
  return therapist.therapist_weekly_hours?.filter((r) => r.day_of_week === dayOfWeek) ?? [];
}

function fitsInAnyBlock(startMins: number, endMins: number, blocks: WeeklyShiftBlock[]): boolean {
  return blocks.some((b) => startMins >= b.start_minute && endMins <= b.end_minute);
}

const BUFFER_MINUTES = 15;

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);

const displayPrice = (s: { price: number; price_label?: string | null }) =>
  s.price_label && s.price_label.trim() ? s.price_label : formatPrice(s.price);

const CATEGORY_ORDER = [
  "Face Wax",
  "Body Wax",
  "Nail Extension / Acrylic",
  "SNS",
  "Nail Enhancement",
  "Add-ons",
  "Hands — Normal Polish",
  "Hands — Shellac",
  "Nail Art",
  "Feet — Normal Polish",
  "Feet — Shellac & Enhancement",
];

const groupByCategory = (items: Service[]) => {
  const map = new Map<string, Service[]>();
  for (const s of items) {
    const cat = s.category ?? "Other";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(s);
  }
  const ordered: Array<{ category: string; items: Service[] }> = [];
  for (const cat of CATEGORY_ORDER) {
    const list = map.get(cat);
    if (list?.length) ordered.push({ category: cat, items: list });
    map.delete(cat);
  }
  for (const [cat, list] of map) ordered.push({ category: cat, items: list });
  return ordered;
};

type BookingProps = {
  /** When true, skips outer TopBar/Navbar chrome and full-page sizing — for use inside a dialog. */
  compact?: boolean;
  /** Optional callback fired when the booking flow completes (so a parent dialog can react). */
  onComplete?: () => void;
};

// Edit this line to change the wait-time disclaimer shown during booking.
const WAIT_TIME_DISCLAIMER =
  "Your booking is confirmed, but during busy periods there may be a short wait — usually around 10 minutes. Thanks so much for your patience!";

// Edit this line to change the confirmation-screen disclaimer shown after a booking is submitted.
const CONFIRMATION_PENDING_DISCLAIMER =
  "Your booking request has been received — please wait for confirmation from our staff before your appointment.";

const Booking = ({ compact = false, onComplete }: BookingProps = {}) => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    searchParams.get("service") ? [searchParams.get("service") as string] : [],
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState("any");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [assignedTherapistName, setAssignedTherapistName] = useState("");
  const [redirectingToPayment, setRedirectingToPayment] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serviceSearch, setServiceSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<string[] | null>(null);

  const handleBlur = useCallback(
    (field: "customerName" | "customerPhone" | "customerEmail", value: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setFieldErrors((prev) => ({ ...prev, [field]: validateField(bookingCustomerSchema, field, value) }));
    },
    [],
  );

  const handleFieldChange = useCallback(
    (field: "customerName" | "customerPhone" | "customerEmail", value: string) => {
      if (touched[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: validateField(bookingCustomerSchema, field, value) }));
      }
    },
    [touched],
  );

  const isStep3Valid = useMemo(
    () => bookingCustomerSchema.safeParse({ customerName, customerPhone, customerEmail }).success,
    [customerName, customerPhone, customerEmail],
  );

  const { data: stripeEnabled } = useQuery({
    queryKey: ["stripe-enabled-public"],
    queryFn: async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "stripe_payment_enabled")
        .single();
      return data?.value === "true";
    },
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Service[];
    },
  });

  const { data: therapists } = useQuery({
    queryKey: ["therapists"],
    queryFn: async () => {
      const { data, error } = await supabase.from("therapists").select("*, therapist_weekly_hours(*)").eq("is_active", true);
      if (error) throw error;
      return (data ?? []) as Therapist[];
    },
  });

  const { data: randomEnabled } = useQuery({
    queryKey: ["random-therapist-setting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "random_therapist_enabled")
        .single();
      if (error) return true;
      return data?.value === "true";
    },
  });

  const { data: unavailability } = useQuery({
    queryKey: ["therapist-unavailability", selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return [];
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("therapist_unavailability")
        .select("therapist_id")
        .eq("unavailable_date", dateStr);
      if (error) throw error;
      return (data ?? []).map((d: { therapist_id: string }) => d.therapist_id);
    },
    enabled: !!selectedDate,
  });

  const { data: shopHolidays } = useQuery({
    queryKey: ["shop-holidays-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_holidays").select("*");
      if (error) throw error;
      return (data ?? []) as Array<{ holiday_date: string; early_close_hour: number | null }>;
    },
  });

  const { data: holidaySettings } = useQuery({
    queryKey: ["holiday-booking-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("key, value")
        .in("key", ["show_holiday_closed", "shop_state", "open_days"]);
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: { key: string; value: string }) => {
        map[r.key] = r.value;
      });
      return map;
    },
  });

  const blockPublicHolidays = holidaySettings?.show_holiday_closed === "true";
  const shopState = holidaySettings?.shop_state || "VIC";
  const openDays: number[] = holidaySettings?.open_days ? JSON.parse(holidaySettings.open_days) : [1, 2, 3, 4, 5, 6, 7];

  const { data: publicHolidays } = useQuery({
    queryKey: ["public-holidays-booking", shopState],
    queryFn: async () => {
      const year = new Date().getFullYear();
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/AU`);
      if (!res.ok) return [];
      const holidays: Array<{ date: string; localName: string; name: string; counties: string[] | null }> =
        await res.json();
      const stateCode = `AU-${shopState}`;
      return holidays.filter((h) => !h.counties || h.counties.includes(stateCode));
    },
    enabled: blockPublicHolidays,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const publicHolidayDates = useMemo(() => {
    if (!publicHolidays) return new Set<string>();
    return new Set(publicHolidays.map((h) => h.date));
  }, [publicHolidays]);

  const todayHoliday = selectedDate
    ? shopHolidays?.find((h) => h.holiday_date === format(selectedDate, "yyyy-MM-dd"))
    : null;
  const isShopHoliday = !!todayHoliday && !todayHoliday.early_close_hour;
  const earlyCloseHour = todayHoliday?.early_close_hour as number | undefined;
  const isPublicHoliday = selectedDate ? publicHolidayDates.has(format(selectedDate, "yyyy-MM-dd")) : false;
  const publicHolidayName =
    selectedDate && isPublicHoliday
      ? publicHolidays?.find((h) => h.date === format(selectedDate, "yyyy-MM-dd"))?.localName
      : "";

  const { data: existingBookings } = useQuery({
    queryKey: ["bookings-availability", selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return [];
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_date", dateStr)
        .neq("status", "cancelled");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!selectedDate,
  });

  const currentServices = services?.filter((s) => selectedServices.includes(s.id)) || [];
  const totalDuration = currentServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalPrice = currentServices.reduce((sum, s) => sum + s.price, 0);
  const combinedServiceName = currentServices.map((s) => s.name).join(" + ");

  const getAvailableTherapists = (timeStr: string, duration: number) => {
    if (!therapists || !selectedDate) return [];
    const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay();
    const endStr = format(addMinutes(new Date(`2000-01-01T${timeStr}`), duration), "HH:mm");

    return therapists.filter((t) => {
      if (unavailability?.includes(t.id)) return false;
      const dayBlocks = getTherapistDayBlocks(t, dayOfWeek);
      if (dayBlocks.length === 0) return false;
      const slotStartMin = parseInt(timeStr.split(":")[0]) * 60 + parseInt(timeStr.split(":")[1]);
      const slotEndMin = parseInt(endStr.split(":")[0]) * 60 + parseInt(endStr.split(":")[1]);
      if (!fitsInAnyBlock(slotStartMin, slotEndMin, dayBlocks)) return false;
      const isBooked = existingBookings?.some((b: any) => {
        if (b.therapist_id !== t.id) return false;
        const [bsh, bsm] = b.start_time.split(":");
        const [beh, bem] = b.end_time.split(":");
        const bStartMin = parseInt(bsh) * 60 + parseInt(bsm);
        const bEndMin = parseInt(beh) * 60 + parseInt(bem);
        return slotStartMin < bEndMin + BUFFER_MINUTES && slotEndMin > bStartMin - BUFFER_MINUTES;
      });
      return !isBooked;
    });
  };

  const availableSlots = useMemo(() => {
    if (currentServices.length === 0 || !selectedDate || !therapists || isShopHoliday) return [];
    const duration = totalDuration;
    const slots: { time: string; therapistCount: number }[] = [];
    const now = new Date();
    const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay();

    const workingTherapists = therapists.filter((t) => getTherapistDayBlocks(t, dayOfWeek).length > 0);
    if (workingTherapists.length === 0) return [];

    const allBlocks = workingTherapists.flatMap((t) => getTherapistDayBlocks(t, dayOfWeek));
    const minStartMin = Math.min(...allBlocks.map((b) => b.start_minute));
    const maxEndMin = Math.max(...allBlocks.map((b) => b.end_minute));
    const effectiveMaxEndMin = earlyCloseHour ? Math.min(maxEndMin, earlyCloseHour * 60) : maxEndMin;

    for (let mins = minStartMin; mins < maxEndMin; mins += 30) {
      const slotStart = new Date(selectedDate);
      slotStart.setHours(0, 0, 0, 0);
      slotStart.setMinutes(mins);

      if (mins + duration > effectiveMaxEndMin) continue;
      if (isToday(selectedDate) && isBefore(slotStart, now)) continue;

      const startStr = format(slotStart, "HH:mm");
      const available = getAvailableTherapists(startStr, duration);

      if (selectedTherapist !== "any") {
        const isAvail = available.some((t) => t.id === selectedTherapist);
        if (isAvail) slots.push({ time: startStr, therapistCount: 1 });
      } else {
        if (available.length > 0) slots.push({ time: startStr, therapistCount: available.length });
      }
    }
    return slots;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentServices,
    selectedDate,
    existingBookings,
    selectedTherapist,
    therapists,
    unavailability,
    earlyCloseHour,
    isShopHoliday,
    totalDuration,
  ]);

  const handleSubmit = async () => {
    if (currentServices.length === 0 || !selectedDate || !selectedTime) return;
    setIsSubmitting(true);

    const startTime = selectedTime + ":00";
    const endDate = addMinutes(new Date(`2000-01-01T${selectedTime}`), totalDuration);
    const endTime = format(endDate, "HH:mm") + ":00";

    let therapistId = selectedTherapist;
    if (selectedTherapist === "any") {
      const available = getAvailableTherapists(selectedTime, totalDuration);
      if (available.length === 0) {
        toast({
          title: "Error",
          description: "No therapists available. Please pick another time.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      const bookingCounts: Record<string, number> = {};
      existingBookings?.forEach((b: any) => {
        if (b.status !== "cancelled") {
          bookingCounts[b.therapist_id] = (bookingCounts[b.therapist_id] || 0) + 1;
        }
      });
      const sorted = [...available].sort((a, b) => {
        const diff = (bookingCounts[a.id] || 0) - (bookingCounts[b.id] || 0);
        if (diff !== 0) return diff;
        return a.id.localeCompare(b.id);
      });
      therapistId = sorted[0].id;
      setAssignedTherapistName(sorted[0].name);
    } else {
      const th = therapists?.find((t) => t.id === therapistId);
      setAssignedTherapistName(th?.name || "");
    }

    const bookingId = crypto.randomUUID();
    const bookingDateStr = format(selectedDate, "yyyy-MM-dd");
    const therapistName = therapists?.find((t) => t.id === therapistId)?.name || "";

    const { error } = await supabase.from("bookings").insert({
      id: bookingId,
      service_id: currentServices[0].id,
      therapist_id: therapistId,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim(),
      booking_date: bookingDateStr,
      start_time: startTime,
      end_time: endTime,
      status: "confirmed",
      notes: null,
      ...(TENANT_ID ? { tenant_id: TENANT_ID } : {}),
    });

    if (!error) {
      await supabase.from("booking_services").insert(
        currentServices.map((s, i) => ({
          booking_id: bookingId,
          service_id: s.id,
          service_name: s.name,
          duration_minutes: s.duration_minutes,
          price: s.price,
          is_primary: i === 0,
          ...(TENANT_ID ? { tenant_id: TENANT_ID } : {}),
        })),
      );
      await supabase.from("notifications").insert({
        tenant_id: TENANT_ID || null,
        type: "new_booking",
        // Stored as the same translation key the admin dashboard's realtime
        // toast uses ('Lịch hẹn mới!'), rendered through t() on the admin
        // side — never English/Vietnamese hardcoded, so it matches whatever
        // language the admin has selected instead of always being English.
        title: "Lịch hẹn mới!",
        body: `${customerName.trim()} — ${combinedServiceName} — ${bookingDateStr} ${selectedTime}`,
        booking_id: bookingId,
      });
    }

    setIsSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Could not create booking. Please try again.", variant: "destructive" });
      return;
    }

    if (stripeEnabled && totalPrice > 0) {
      setRedirectingToPayment(true);
      try {
        const origin = window.location.origin;
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
          "create-stripe-checkout",
          {
            body: {
              booking_id: bookingId,
              service_name: combinedServiceName,
              total_amount: totalPrice,
              customer_email: customerEmail.trim() || undefined,
              customer_name: customerName.trim(),
              success_url: `${origin}/booking/success`,
              cancel_url: `${origin}/booking/cancel`,
            },
          },
        );

        const checkoutUrl: unknown = checkoutData?.url;
        if (
          checkoutError ||
          typeof checkoutUrl !== "string" ||
          !checkoutUrl.startsWith("https://checkout.stripe.com/")
        ) {
          setRedirectingToPayment(false);
          setBookingComplete(true);
          toast({
            title: "Booking confirmed",
            description: "Could not redirect to payment. Please pay in-store.",
          });
        } else {
          window.location.href = checkoutUrl;
          return;
        }
      } catch {
        setRedirectingToPayment(false);
        setBookingComplete(true);
      }
    } else {
      setBookingComplete(true);
    }

    if (customerEmail.trim()) {
      const esc = escapeHtml;
      const emailHtml = `
        <div style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1a1a1a; font-size: 24px; font-family: 'Noto Serif', serif; font-weight: 400;">Your booking is confirmed</h1>
          <p style="color: #555; font-size: 14px; line-height: 1.7;">Hi <strong>${esc(customerName.trim())}</strong>, thank you for booking with ESTIQUE.</p>
          <div style="background: #faf7f4; border: 1px solid #eadfd4; border-radius: 2px; padding: 20px; margin: 24px 0;">
            <p style="margin: 6px 0;"><strong>Service:</strong> ${esc(combinedServiceName)}</p>
            <p style="margin: 6px 0;"><strong>Date:</strong> ${format(selectedDate, "dd MMM yyyy")}</p>
            <p style="margin: 6px 0;"><strong>Time:</strong> ${selectedTime} – ${format(endDate, "HH:mm")}</p>
            <p style="margin: 6px 0;"><strong>Technician:</strong> ${esc(therapistName)}</p>
          </div>
          <p style="color: #555; font-size: 14px;">We look forward to seeing you.</p>
        </div>
      `;
      supabase.functions
        .invoke("send-email-resend", {
          body: {
            to: customerEmail.trim(),
            subject: `Booking confirmed — ${combinedServiceName}`,
            html: emailHtml,
          },
        })
        .catch(() => {});
    }
  };

  const selectedTherapistName =
    selectedTherapist === "any"
      ? assignedTherapistName || "Auto-assigned"
      : therapists?.find((t) => t.id === selectedTherapist)?.name || "";

  const stepLabels = ["Service", "Date & Time", "Details", "Confirm"];

  if (redirectingToPayment) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-4",
          compact ? "min-h-[60vh]" : "min-h-screen bg-background",
        )}
      >
        <div className="max-w-md w-full text-center space-y-6">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h1 className="text-2xl font-light" style={{ fontFamily: "'Noto Serif', serif" }}>
            Redirecting to secure payment…
          </h1>
          <p className="text-muted-foreground text-sm">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-4",
          compact ? "min-h-[60vh]" : "min-h-screen bg-background",
        )}
      >
        <div className="max-w-md w-full text-center space-y-8">
          <div className="mx-auto w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
            <Check className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "'Noto Serif', serif" }}>
              Your booking is confirmed
            </h1>
            <p className="text-muted-foreground text-sm">We'll be in touch shortly.</p>
          </div>
          <div className="text-left border border-border/60 p-5 space-y-3 text-sm">
            <p className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{combinedServiceName}</span></p>
            <div className="h-px bg-border/40" />
            <p className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate && format(selectedDate, "dd MMM yyyy")}</span></p>
            <div className="h-px bg-border/40" />
            <p className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedTime}</span></p>
            <div className="h-px bg-border/40" />
            <p className="flex justify-between"><span className="text-muted-foreground">Technician</span><span className="font-medium">{assignedTherapistName || selectedTherapistName}</span></p>
            <div className="h-px bg-border/40" />
            <p className="flex justify-between"><span className="text-muted-foreground">Guest</span><span className="font-medium">{customerName}</span></p>
            {customerEmail && (
              <>
                <div className="h-px bg-border/40" />
                <p className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{customerEmail}</span></p>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground/80">{CONFIRMATION_PENDING_DISCLAIMER}</p>
          {compact ? (
            <Button
              onClick={onComplete}
              className="rounded-lg text-xs tracking-[0.2em] uppercase px-10 h-11"
            >
              Done
            </Button>
          ) : (
            <Link to="/">
              <Button className="rounded-lg text-xs tracking-[0.2em] uppercase px-10 h-11">
                Return home
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(!compact && "min-h-screen bg-background")}>
      {!compact && (
        <>
          <TopBar />
          <Navbar />
        </>
      )}

      <div
        className={cn(
          "max-w-lg mx-auto",
          compact ? "px-1 pb-2" : "pt-8 sm:pt-12 pb-16 px-4 sm:px-6",
        )}
      >
        {!compact && (
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
        )}

        <div className={compact ? "mb-6" : "mb-10"}>
          <h1
            className={cn(
              "font-light leading-tight mb-2",
              compact ? "text-2xl" : "text-3xl sm:text-4xl",
            )}
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Reserve your appointment
          </h1>
          <p className="text-muted-foreground text-sm">Complete the steps below.</p>
        </div>

        <div className="flex items-center gap-1 mb-10">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "h-0.5 w-full transition-colors duration-300",
                  i + 1 <= step ? "bg-primary" : "bg-border",
                )}
              />
              <span
                className={cn(
                  "text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-colors",
                  i + 1 <= step ? "text-foreground" : "text-muted-foreground/50",
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <ServicePicker
              services={services}
              selectedServices={selectedServices}
              onToggle={(id) =>
                setSelectedServices((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                )
              }
              search={serviceSearch}
              setSearch={setServiceSearch}
              openCategories={openCategories}
              setOpenCategories={setOpenCategories}
            />

            {selectedServices.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="text-sm text-muted-foreground">
                  {totalDuration} min · {formatPrice(totalPrice)}
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="rounded-lg text-xs tracking-[0.2em] uppercase px-6 h-10"
                >
                  Continue <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-light rounded-lg h-11 border-border/60",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {
                      setSelectedDate(d);
                      setSelectedTime("");
                    }}
                    disabled={(date) => {
                      if (isBefore(startOfDay(date), startOfDay(new Date()))) return true;
                      const dateStr = format(date, "yyyy-MM-dd");
                      const holiday = shopHolidays?.find((h) => h.holiday_date === dateStr);
                      if (holiday && !holiday.early_close_hour) return true;
                      if (blockPublicHolidays && publicHolidayDates.has(dateStr)) return true;
                      const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
                      if (!openDays.includes(dayOfWeek)) return true;
                      if (therapists) {
                        const hasWorking = therapists.some((th) => getTherapistDayBlocks(th, dayOfWeek).length > 0);
                        if (!hasWorking) return true;
                      }
                      return false;
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {(isShopHoliday || (blockPublicHolidays && isPublicHoliday)) && (
                <p className="text-sm text-destructive mt-2">
                  Closed on this date.{publicHolidayName ? ` (${publicHolidayName})` : ""} Please pick another day.
                </p>
              )}
              {earlyCloseHour && !isShopHoliday && (
                <p className="text-sm text-amber-600 mt-2">Early close at {earlyCloseHour}:00 today.</p>
              )}
            </div>

            {selectedDate && (
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Technician</p>
                <Select
                  value={selectedTherapist}
                  onValueChange={(v) => {
                    setSelectedTherapist(v);
                    setSelectedTime("");
                  }}
                >
                  <SelectTrigger className="rounded-lg h-11 border-border/60 font-light">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    {randomEnabled !== false && <SelectItem value="any">Auto-assign (any available)</SelectItem>}
                    {therapists
                      ?.filter((t) => !unavailability?.includes(t.id))
                      .map((t) => {
                        const dow = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay();
                        const dayBlocks = [...getTherapistDayBlocks(t, dow)].sort((a, b) => a.start_minute - b.start_minute);
                        const blocksLabel = dayBlocks.length
                          ? ` (${dayBlocks.map((b) => `${formatMinutesHHMM(b.start_minute)}–${formatMinutesHHMM(b.end_minute)}`).join(", ")})`
                          : "";
                        return (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}{blocksLabel}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedDate && (
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Time</p>
                {availableSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No slots available. Please choose a different date or technician.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTime(slot.time)}
                        className={cn(
                          "h-10 text-sm font-light border transition-all duration-200 relative",
                          selectedTime === slot.time
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/60 hover:border-primary/40",
                        )}
                      >
                        {slot.time}
                        {selectedTherapist === "any" && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[8px] bg-muted text-muted-foreground flex items-center justify-center rounded-full">
                            {slot.therapistCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedDate && selectedTime && (
              <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200/60 rounded-lg p-3">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{WAIT_TIME_DISCLAIMER}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border/40">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="rounded-lg text-xs tracking-[0.2em] uppercase h-10 border-border/60"
              >
                Back
              </Button>
              <Button
                className="flex-1 rounded-lg text-xs tracking-[0.2em] uppercase h-10"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Full name <span className="text-destructive">*</span>
              </p>
              <Input
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  handleFieldChange("customerName", e.target.value);
                }}
                onBlur={() => handleBlur("customerName", customerName)}
                placeholder="Your name"
                className={cn(
                  "rounded-lg h-11 border-border/60 font-light",
                  touched.customerName && fieldErrors.customerName && "border-destructive",
                )}
              />
              {touched.customerName && fieldErrors.customerName && (
                <p className="text-xs text-destructive mt-1.5">{fieldErrors.customerName}</p>
              )}
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Phone <span className="text-destructive">*</span>
              </p>
              <Input
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  handleFieldChange("customerPhone", e.target.value);
                }}
                onBlur={() => handleBlur("customerPhone", customerPhone)}
                placeholder="04XX XXX XXX"
                className={cn(
                  "rounded-lg h-11 border-border/60 font-light",
                  touched.customerPhone && fieldErrors.customerPhone && "border-destructive",
                )}
              />
              {touched.customerPhone && fieldErrors.customerPhone && (
                <p className="text-xs text-destructive mt-1.5">{fieldErrors.customerPhone}</p>
              )}
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Email <span className="text-destructive">*</span>
              </p>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  handleFieldChange("customerEmail", e.target.value);
                }}
                onBlur={() => handleBlur("customerEmail", customerEmail)}
                placeholder="you@example.com"
                className={cn(
                  "rounded-lg h-11 border-border/60 font-light",
                  touched.customerEmail && fieldErrors.customerEmail && "border-destructive",
                )}
              />
              {touched.customerEmail && fieldErrors.customerEmail && (
                <p className="text-xs text-destructive mt-1.5">{fieldErrors.customerEmail}</p>
              )}
            </div>
            <div className="flex gap-3 pt-4 border-t border-border/40">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="rounded-lg text-xs tracking-[0.2em] uppercase h-10 border-border/60"
              >
                Back
              </Button>
              <Button
                className="flex-1 rounded-lg text-xs tracking-[0.2em] uppercase h-10"
                disabled={!isStep3Valid}
                onClick={() => {
                  const result = bookingCustomerSchema.safeParse({ customerName, customerPhone, customerEmail });
                  if (!result.success) {
                    const errors: Record<string, string | null> = {};
                    const allTouched: Record<string, boolean> = {};
                    result.error.errors.forEach((err) => {
                      const field = err.path[0] as string;
                      errors[field] = err.message;
                      allTouched[field] = true;
                    });
                    setFieldErrors((prev) => ({ ...prev, ...errors }));
                    setTouched((prev) => ({ ...prev, ...allTouched }));
                    return;
                  }
                  setStep(4);
                }}
              >
                Continue <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border border-border/60 p-5 space-y-3 text-sm">
              <p className="flex justify-between"><span className="text-muted-foreground">Service{currentServices.length > 1 ? "s" : ""}</span><span className="font-light text-right">{combinedServiceName}</span></p>
              <div className="h-px bg-border/40" />
              <p className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-light">{selectedDate && format(selectedDate, "dd MMM yyyy")}</span></p>
              <div className="h-px bg-border/40" />
              <p className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-light">{selectedTime}</span></p>
              <div className="h-px bg-border/40" />
              <p className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-light">{totalDuration} min</span></p>
              <div className="h-px bg-border/40" />
              <p className="flex justify-between"><span className="text-muted-foreground">Technician</span><span className="font-light">{selectedTherapistName}</span></p>
              <div className="h-px bg-border/40" />
              <p className="flex justify-between"><span className="text-muted-foreground">Guest</span><span className="font-light">{customerName}</span></p>
              <div className="h-px bg-border/40" />
              <p className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-light">{customerPhone}</span></p>
              {customerEmail && (
                <>
                  <div className="h-px bg-border/40" />
                  <p className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-light">{customerEmail}</span></p>
                </>
              )}
              <div className="h-px bg-border/40" />
              <p className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-medium">{formatPrice(totalPrice)}</span></p>
            </div>

            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200/60 rounded-lg p-3">
              <Clock className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{WAIT_TIME_DISCLAIMER}</span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="rounded-lg text-xs tracking-[0.2em] uppercase h-10 border-border/60"
              >
                Back
              </Button>
              <Button
                className="flex-1 rounded-lg text-xs tracking-[0.2em] uppercase h-10"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing…" : "Confirm booking"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

type ServicePickerProps = {
  services: Service[] | undefined;
  selectedServices: string[];
  onToggle: (id: string) => void;
  search: string;
  setSearch: (v: string) => void;
  openCategories: string[] | null;
  setOpenCategories: (v: string[] | null) => void;
};

const ServicePicker = ({
  services,
  selectedServices,
  onToggle,
  search,
  setSearch,
  openCategories,
  setOpenCategories,
}: ServicePickerProps) => {
  const trimmed = search.trim().toLowerCase();
  const isSearching = trimmed.length > 0;

  const filteredGroups = useMemo(() => {
    if (!services) return [];
    const filtered = isSearching
      ? services.filter(
          (s) =>
            s.name.toLowerCase().includes(trimmed) ||
            (s.category ?? "").toLowerCase().includes(trimmed),
        )
      : services;
    return groupByCategory(filtered);
  }, [services, isSearching, trimmed]);

  const expandedValue = useMemo(() => {
    if (isSearching) return filteredGroups.map((g) => g.category);
    if (openCategories !== null) return openCategories;
    if (selectedServices.length > 0 && services) {
      const sel = services.find((s) => selectedServices.includes(s.id));
      if (sel?.category) return [sel.category];
    }
    return filteredGroups[0] ? [filteredGroups[0].category] : [];
  }, [isSearching, filteredGroups, openCategories, selectedServices, services]);

  if (!services) {
    return (
      <div className="text-sm text-muted-foreground py-6 text-center">Loading services…</div>
    );
  }

  return (
    <div>
      <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
        Services — select one or more
      </p>

      <div className="relative mb-4">
        <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services…"
          className="pl-9 pr-9 h-10 rounded-lg border-border/60 font-light"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border/60 rounded-lg">
          No services match "{search}".
        </div>
      ) : (
        <Accordion
          type="multiple"
          value={expandedValue}
          onValueChange={(v) => {
            if (!isSearching) setOpenCategories(v);
          }}
          className="space-y-2"
        >
          {filteredGroups.map((group) => {
            const containsSelected = group.items.some((s) => selectedServices.includes(s.id));
            return (
              <AccordionItem
                key={group.category}
                value={group.category}
                className="border border-border/60 rounded-lg overflow-hidden data-[state=open]:border-primary/40"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/30 [&[data-state=open]]:bg-accent/20">
                  <div className="flex items-center justify-between w-full pr-2 gap-3">
                    <span className="text-sm font-medium tracking-wide text-left">
                      {group.category}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {containsSelected && (
                        <span className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold">
                          Selected
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground tabular-nums">
                        ({group.items.length})
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 pt-1">
                  <div className="space-y-1.5">
                    {group.items.map((service) => {
                      const isSelected = selectedServices.includes(service.id);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => onToggle(service.id)}
                          className={cn(
                            "w-full text-left p-3 sm:p-4 border rounded-md transition-all duration-200 flex items-center gap-3",
                            isSelected
                              ? "border-primary bg-primary/[0.04]"
                              : "border-border/60 hover:border-primary/40",
                          )}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 border flex items-center justify-center shrink-0",
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground/30",
                            )}
                          >
                            {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                          </div>
                          <div className="flex-1 flex justify-between items-start gap-3">
                            <div className="space-y-1 min-w-0">
                              <div className="text-sm font-light leading-tight">{service.name}</div>
                              {service.disclaimer && (
                                <div className="text-[11px] text-muted-foreground italic leading-relaxed">
                                  {service.disclaimer}
                                </div>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-sm font-light tabular-nums">
                                {displayPrice(service)}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {service.duration_minutes} min
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default Booking;
