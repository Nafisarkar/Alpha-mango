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
import { Server, Database } from "lucide-react";
import { useAtomValue } from "jotai";
import { databasesAtom, dbLoadingAtom } from "@/store/settings.store";
import { Spinner } from "./ui/spinner";

function AppSidebar() {
  const databases = useAtomValue(databasesAtom);
  const isLoading = useAtomValue(dbLoadingAtom);

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
                <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
                  <span className=" truncate">Cluster</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Databases</span>
            {isLoading && <Spinner className="size-3" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {databases.map((db) => (
                <SidebarMenuItem key={db}>
                  <SidebarMenuButton size="sm">
                    <Database className="size-4 text-muted-foreground" />
                    <span>{db}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {!isLoading && databases.length === 0 && (
                <div className="px-4 py-2 text-xs text-muted-foreground italic">
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
