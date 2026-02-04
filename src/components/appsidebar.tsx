import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Server } from "lucide-react";
import { useAtomValue } from "jotai";
import {
  clusterInfoAtom,
  databasesAtom,
  dbConnectionStatusAtom,
  dbLoadingAtom,
} from "@/store/settings.store";
import { Spinner } from "./ui/spinner";
import { DatabaseItem } from "./databaseitem";

function AppSidebar() {
  const databases = useAtomValue(databasesAtom);
  const isGlobalLoading = useAtomValue(dbLoadingAtom);
  const clusterInfo = useAtomValue(clusterInfoAtom);
  const dbConnectionStatus = useAtomValue(dbConnectionStatusAtom);

  return (
    <Sidebar variant="sidebar" className="border-r h-full">
      <SidebarHeader className="h-12 p-0 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              asChild
              className="h-12 rounded-none w-full"
              variant={"outline"}
            >
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg hover:bg-transparent">
                  <Server className="size-4 text-muted-foreground " />
                </div>
                <div className="flex flex-col gap-0.5 leading-none overflow-hidden text-left">
                  <span className="truncate font-semibold text-sm">
                    {dbConnectionStatus
                      ? clusterInfo
                        ? clusterInfo.app_name || "MongoDB Cluster"
                        : "MongoDB Cluster"
                      : "Not Connected"}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {dbConnectionStatus
                      ? clusterInfo
                        ? clusterInfo.hosts[0].split(".")[0]
                        : "Unknown Host"
                      : "Disconnected"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2 h-8">
            <span className="text-[10px] uppercase tracking-wider font-bold">
              Databases
            </span>
            {isGlobalLoading && <Spinner className="size-3" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {databases.map((db) => (
                <DatabaseItem key={db} dbName={db} />
              ))}
              {!isGlobalLoading && databases.length === 0 && (
                <div className="px-4 py-3 text-xs text-muted-foreground italic text-center">
                  No databases found
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
