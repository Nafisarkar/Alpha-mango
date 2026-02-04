import { databaseCollectionsAtom } from "@/store/settings.store";
import { invoke } from "@tauri-apps/api/core";
import { useAtom } from "jotai";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import { ChevronRight, Plus } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { Link } from "@tanstack/react-router";

export function DatabaseItem({ dbName }: { dbName: string }) {
  const [collections, setCollections] = useAtom(databaseCollectionsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const dbCollections = collections[dbName] || [];

  const handleToggle = async (open: boolean) => {
    if (open && dbCollections.length === 0) {
      setIsLoading(true);
      try {
        const result = await invoke<string[]>("list_collections", {
          dbName,
        });
        setCollections((prev) => ({ ...prev, [dbName]: result }));
      } catch (error) {
        console.error(`Failed to fetch collections for ${dbName}:`, error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Collapsible className="group/collapsible" onOpenChange={handleToggle}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={dbName}>
            {isLoading ? (
              <Spinner className="size-3 animate-spin" />
            ) : (
              <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            )}
            <span className="flex-1 truncate font-medium">{dbName}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <SidebarMenuAction showOnHover>
          <Plus />
          <span className="sr-only">Add Collection</span>
        </SidebarMenuAction>
        <CollapsibleContent>
          <SidebarMenuSub>
            {dbCollections.length > 0 ? (
              dbCollections.map((collection) => (
                <SidebarMenuSubItem key={`${dbName}-${collection}`}>
                  <SidebarMenuSubButton asChild>
                    <Link to="/" search={{ database: dbName, collection }}>
                      <span>{collection}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))
            ) : !isLoading ? (
              <div className="px-8 py-1.5 text-xs text-muted-foreground italic">
                Empty
              </div>
            ) : null}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
