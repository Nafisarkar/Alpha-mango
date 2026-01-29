import TerminalDrawer from "./terminaldrawer";
import { Terminal, Bell } from "lucide-react";

function StatusBar() {
  return (
    <div className="h-6 w-full bg-sidebar border-t text-[10px] flex items-center  justify-between text-muted-foreground select-none">
      <div className="flex items-center gap-0 h-full">
        <TerminalDrawer>
          <button className="flex items-center gap-1.5 hover:bg-accent hover:text-accent-foreground px-3 h-full transition-colors border-r">
            <Terminal className="size-3" />
            <span>Terminal</span>
          </button>
        </TerminalDrawer>
      </div>

      <div className="flex items-center gap-0 h-full">
        <button className="flex items-center gap-1.5 hover:bg-accent hover:text-accent-foreground px-3 h-full transition-colors border-l">
          <Bell className="size-3" />
          <span>Notifications</span>
        </button>

        <div className="px-3 h-full flex items-center border-l">
          <span>v0.1.0</span>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
