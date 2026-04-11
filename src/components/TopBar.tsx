import { Phone, Clock } from "lucide-react";

const TopBar = () => (
  <div className="bg-primary text-primary-foreground text-sm py-2.5">
    <div className="container mx-auto flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Phone className="h-3.5 w-3.5" />
        <span>(123) 456-7890</span>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <Clock className="h-3.5 w-3.5" />
        <span>Mon – Sat: 9am – 7pm</span>
      </div>
    </div>
  </div>
);

export default TopBar;
