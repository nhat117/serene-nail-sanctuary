import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Booking from "@/pages/Booking";
import { cn } from "@/lib/utils";

type BookOnlineButtonProps = {
  children?: ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "subtle";
  fullWidth?: boolean;
};

const VARIANT_CLASSES: Record<NonNullable<BookOnlineButtonProps["variant"]>, string> = {
  primary:
    "btn-shimmer rounded-lg bg-primary text-primary-foreground text-sm tracking-wider px-7 py-3 hover:bg-primary transition-all duration-500 shadow-soft",
  outline:
    "rounded-lg border border-foreground/30 text-foreground px-10 py-6 text-base tracking-[0.1em] font-medium hover:bg-foreground hover:text-background transition-all duration-500",
  subtle:
    "rounded-lg text-xs tracking-[0.2em] uppercase px-6 h-10",
};

export const BookOnlineButton = ({
  children = "Book Online",
  className,
  variant = "primary",
  fullWidth = false,
}: BookOnlineButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(VARIANT_CLASSES[variant], fullWidth && "w-full", className)}
        >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full p-0 max-h-[92vh] overflow-hidden flex flex-col gap-0">
        <div className="overflow-y-auto scrollbar-none p-6 sm:p-8">
          <Booking compact onComplete={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookOnlineButton;
