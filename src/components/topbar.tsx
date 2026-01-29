import { ArrowLeft, ArrowRight, Menu, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { useSidebar } from "./ui/sidebar";
import ApiConnectionDialog from "./apiconnectiondialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import TerminalDrawer from "./terminaldrawer";
import { useAtom } from "jotai";
import { dbLoadingAtom } from "@/store/settings.store";

function Topbar() {
  const { toggleSidebar } = useSidebar();
  const [dbLoading] = useAtom(dbLoadingAtom);
  return (
    <div className="h-12 w-full px-4 flex flex-row items-center justify-between border-b">
      <div className="flex flex-row gap-4 items-center">
        <Button variant="outline" size="icon-sm" onClick={toggleSidebar}>
          <Menu />
        </Button>
        <TerminalDrawer />
        <ButtonGroup>
          <Button variant="outline" size="icon-sm">
            <ArrowLeft />
          </Button>
          <Button variant="outline" size="icon-sm">
            <ArrowRight />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Select defaultValue="25">
          <SelectTrigger size="sm" className="h-10">
            <SelectValue placeholder="25" className="h-10" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <ButtonGroup>
          <ApiConnectionDialog />
          <Button variant="outline" size="icon-sm">
            <RefreshCcw className={dbLoading ? "animate-spin" : ""} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default Topbar;
