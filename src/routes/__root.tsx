import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/appsidebar";
import StatusBar from "@/components/statusbar";
import { useAtomValue, useSetAtom } from "jotai";
import {
  clusterInfoAtom,
  databaseCollectionsAtom,
  databasesAtom,
  dataFromTheCollectionAtom,
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
  const setDatabaseCollections = useSetAtom(databaseCollectionsAtom);
  const setClusterInfo = useSetAtom(clusterInfoAtom);
  const getDataFromTheCollection = useSetAtom(dataFromTheCollectionAtom);
  const connectionVersionRef = useRef(0);

  async function handleConnect(connStr: string) {
    if (!connStr || !connStr.startsWith("mongodb")) {
      console.log("Skipping connection: Invalid URL");
      setDbConnectionStatus(false);
      setDbError(null);
      setDatabases([]);
      setDatabaseCollections({});
      setClusterInfo({ hosts: [], app_name: "" });
      getDataFromTheCollection({});
      return;
    }

    const currentVersion = ++connectionVersionRef.current;

    try {
      setDbLoading(true);
      setDbError(null);
      const message: {
       hosts: string[];
       app_name: string;
      } = await invoke("connect_to_db", {
        connectionString: connStr,
      });

      // Avoid updating state if a newer connection attempt has started
      if (currentVersion === connectionVersionRef.current) {
        console.log("Connected to database:", message);
        setClusterInfo({
          hosts: message.hosts,
          app_name: message.app_name,
        });
        setDbConnectionStatus(true);
        await fetchDatabases(currentVersion);
      }
    } catch (error) {
      if (currentVersion === connectionVersionRef.current) {
        console.error("Failed to connect to database:", error);
        setDbConnectionStatus(false);
        setDbError(error instanceof Error ? error.message : String(error));
        setDatabases([]);
        setDatabaseCollections({});
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

        // 1. Create an array of Promises for all collection lists
        const collectionPromises = dbs.map(async (dbname) => {
          const collections = await invoke<string[]>("list_collections", {
            dbName: dbname,
          });
          return { dbname, collections };
        });

        // 2. Resolve all promises in parallel
        const results = await Promise.all(collectionPromises);

        // 3. Convert the results array back into your Record object
        const collectionsmap = results.reduce(
          (acc, { dbname, collections }) => {
            acc[dbname] = collections;
            return acc;
          },
          {} as Record<string, string[]>,
        );

        if (version === connectionVersionRef.current) {
          setDatabaseCollections(collectionsmap);
          console.log("Collections Map Resolved:", collectionsmap);
        }
      }
    } catch (error) {
      if (version === connectionVersionRef.current) {
        console.error("Failed to fetch databases/collections:", error);
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
      setDatabaseCollections({});
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
