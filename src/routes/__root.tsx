import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/appsidebar";
import StatusBar from "@/components/statusbar";
import { useAtomValue, useSetAtom } from "jotai";
import {
  databasesAtom,
  dbConnectionStatusAtom,
  dbConnectionStringAtom,
  dbErrorAtom,
  dbLoadingAtom,
} from "@/store/settings.store";
import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const dbConnectionString = useAtomValue(dbConnectionStringAtom);
  const setDbConnectionStatus = useSetAtom(dbConnectionStatusAtom);
  const setDbLoading = useSetAtom(dbLoadingAtom);
  const setDbError = useSetAtom(dbErrorAtom);
  const setDatabases = useSetAtom(databasesAtom);
  const connectionVersionRef = useRef(0);

  async function handleConnect(connStr: string) {
    if (!connStr || !connStr.startsWith("mongodb")) {
      console.log("Skipping connection: Invalid URL");
      setDbConnectionStatus(false);
      setDbError(null);
      setDatabases([]);
      return;
    }

    const currentVersion = ++connectionVersionRef.current;

    try {
      setDbLoading(true);
      setDbError(null);
      const message = await invoke("connect_to_db", {
        connectionString: connStr,
      });

      // Avoid updating state if a newer connection attempt has started
      if (currentVersion === connectionVersionRef.current) {
        console.log("Connected to database:", message);
        setDbConnectionStatus(true);
        await fetchDatabases(currentVersion);
      }
    } catch (error) {
      if (currentVersion === connectionVersionRef.current) {
        console.error("Failed to connect to database:", error);
        setDbConnectionStatus(false);
        setDbError(error instanceof Error ? error.message : String(error));
        setDatabases([]);
      }
    } finally {
      if (currentVersion === connectionVersionRef.current) {
        setDbLoading(false);
      }
    }
  }

  async function fetchDatabases(version: number) {
    try {
      setDbLoading(true);
      const dbs = await invoke<string[]>("list_databases");
      if (version === connectionVersionRef.current) {
        setDatabases(dbs);
      }
    } catch (error) {
      if (version === connectionVersionRef.current) {
        console.error("Failed to fetch databases:", error);
      }
    } finally {
      if (version === connectionVersionRef.current) {
        setDbLoading(false);
      }
    }
  }

  // Effect to reconnect when the stored connection string changes
  useEffect(() => {
    if (dbConnectionString) {
      handleConnect(dbConnectionString);
    } else {
      setDbConnectionStatus(false);
      setDbLoading(false);
      setDbError(null);
      setDatabases([]);
    }

    return () => {
      // Increment version on unmount or cleanup to cancel pending async updates
      connectionVersionRef.current++;
    };
  }, [dbConnectionString]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <div className="flex flex-1 flex-row overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
        <StatusBar />
      </div>
    </SidebarProvider>
  );
}
