import Topbar from "@/components/topbar";
import {
  dbConnectionStatusAtom,
  dbErrorAtom,
  dbLoadingAtom,
} from "@/store/settings.store";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Database } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SearchParams = {
  database?: string;
  collection?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      database: search.database as string | undefined,
      collection: search.collection as string | undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { database, collection } = Route.useSearch();
  const dbconnectionstatus = useAtomValue(dbConnectionStatusAtom);
  const dbLoading = useAtomValue(dbLoadingAtom);
  const dbError = useAtomValue(dbErrorAtom);

  return (
    <div className="flex flex-col h-full bg-background">
      <Topbar />

      <div className="flex-1 flex flex-col">
        {dbLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <Spinner className="size-8 text-primary" />
            <div className="text-center">
              <p className="text-sm font-medium">Connecting to Database</p>
              <p className="text-xs text-muted-foreground animate-pulse">
                Please wait while we establish a connection...
              </p>
            </div>
          </div>
        ) : dbError ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription className="mt-2 text-xs font-mono bg-destructive/10 p-2 rounded border border-destructive/20 overflow-auto max-h-40 text-left">
                {dbError}
              </AlertDescription>
            </Alert>
          </div>
        ) : dbconnectionstatus ? (
          database && collection ? (
            <div className="flex-1 flex flex-col pt-4">
              <div className="flex items-center gap-2 mb-4 ml-6">
                <Database className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">{database} </span>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm font-bold">{collection}</span>
              </div>
              <div className="flex-1 border-t bg-card flex items-center justify-center">
                <p className="text-muted-foreground text-sm italic">
                  Data explorer for {collection} coming soon...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Database className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Connected to Cluster</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Successfully connected to the MongoDB instance. Select a
                  collection from the sidebar to start exploring.
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <Database className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold opacity-50">
                Not Connected
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                No database connection is active. Use the connection dialog to
                get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
