import { Phone, Clock } from "lucide-react";
import { useBranches } from "@/hooks/useBranches";

const TopBar = () => {
  const { data: branches } = useBranches();
  const primary = branches?.[0];
  const firstHours = primary?.branch_trading_hours?.[0];

  return (
    <div className="bg-foreground text-background text-xs py-2.5 tracking-wide">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 text-primary" />
          {primary?.phone ? (
            <a
              href={`tel:${primary.phone.replace(/\s+/g, "")}`}
              className="hover:text-primary transition-colors"
            >
              {primary.phone}
            </a>
          ) : (
            <span className="opacity-50">—</span>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Clock className="h-3 w-3 text-primary" />
          {firstHours ? (
            <span>
              {firstHours.days_label}: {firstHours.hours_label}
            </span>
          ) : (
            <span className="opacity-50">View hours</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
