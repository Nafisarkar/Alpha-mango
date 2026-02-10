import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Server, Settings } from "lucide-react";
import { useAtomValue } from "jotai";
import {
  clusterInfoAtom,
  databasesAtom,
  dbConnectionStatusAtom,
  dbLoadingAtom,
} from "@/store/settings.store";
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
              variant={"ghost"}
            >
              <Link to="/">
                <div className="relative flex aspect-square size-8 items-center justify-center rounded-none hover:bg-transparent">
                  <Server className="size-4 text-muted-foreground" />
                  {dbConnectionStatus && (
                    <div className="absolute right-1.5 bottom-1.5 size-2 rounded-full bg-green-500 ring-2 ring-sidebar" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 leading-none overflow-hidden text-left">
                  <span className="truncate font-semibold text-sm">
                    {dbConnectionStatus
                      ? clusterInfo?.hosts?.[0]?.split(":")[0] ||
                        "MongoDB Cluster"
                      : "Not Connected"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
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
      <SidebarFooter className="p-0 border-t">
        <SidebarMenu  >
          <SidebarMenuItem>
            <SidebarMenuButton asChild variant="ghost" size="sm" className="border-none">
              <Link to={"/settings"}>
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
