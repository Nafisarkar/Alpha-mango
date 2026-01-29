import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Terminal as TerminalIcon } from "lucide-react";
import Terminal from "./terminal";

function TerminalDrawer({ children }: { children?: React.ReactNode }) {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        {children || (
          <Button variant="outline" size="icon-sm">
            <TerminalIcon className="h-4 w-4" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-[60vh]">
        <div className="flex flex-col h-full overflow-hidden bg-background">
          <div className="flex-1 p-2">
            <Terminal />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default TerminalDrawer;
