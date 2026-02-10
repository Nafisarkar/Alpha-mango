import { ArrowLeft, ArrowRight, Menu, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { useSidebar } from "./ui/sidebar";
import ApiConnectionDialog from "./apiconnectiondialog";
import { useAtom } from "jotai";
import { dbLoadingAtom } from "@/store/settings.store";
import { useLocation } from "@tanstack/react-router";

function Topbar({ children }: { children?: React.ReactNode }) {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  const [dbLoading] = useAtom(dbLoadingAtom);
  return (
    <div className="h-12 w-full px-4 flex flex-row items-center justify-between border-b gap-4">
      <div className="flex flex-row gap-4 items-center shrink-0">
        <Button variant="ghost" size="icon-sm" onClick={toggleSidebar}>
          <Menu className="size-4" />
        </Button>

        {location.pathname !== "/settings" && (
          <ButtonGroup>
            <Button variant="outline" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon-sm">
              <ArrowRight className="size-4" />
            </Button>
          </ButtonGroup>
        )}
      </div>

      <div className="flex-1 flex items-center min-w-0 overflow-hidden">
        {children}
      </div>

      <div className="flex flex-row items-center gap-4 shrink-0">
        <ButtonGroup>
          <ApiConnectionDialog />
          <Button variant="outline" size="icon-sm">
            <RefreshCcw
              className={`size-3.5 ${dbLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default Topbar;
