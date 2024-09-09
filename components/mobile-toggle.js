import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SidebarNav from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";

export const MobileToggle = ({ serverId }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 flex gap-0" side="left">
        <div className="w-[72px]">
          <SidebarNav />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
