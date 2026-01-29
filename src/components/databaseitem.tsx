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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import { ChevronRight, Database } from "lucide-react";
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
            <Database className="size-4 text-muted-foreground" />
            <span className="flex-1 truncate font-medium">{dbName}</span>
            {isLoading ? (
              <Spinner className="size-3 animate-spin" />
            ) : (
              <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-row itemsitems-start justify-center">
          <SidebarMenuSub className="w-full">
            {dbCollections.length > 0 ? (
              dbCollections.map((collection) => (
                <SidebarMenuSubItem key={`${dbName}-${collection}`}>
                  <SidebarMenuSubButton asChild>
                    <Link
                      to="/"
                      search={{ database: dbName, collection }}
                      className="flex items-center gap-2 w-full justify-center"
                    >
                      <span className="w-full items-center justify-center">
                        {collection}
                      </span>
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
