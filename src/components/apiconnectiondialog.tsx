import { Plug } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useAtom, useAtomValue } from "jotai";
import {
  dbConnectionStatusAtom,
  dbConnectionStringAtom,
} from "@/store/settings.store";
import { useState, useEffect } from "react";

function ApiConnectionDialog() {
  const [dbConnectionString, setDbConnectionString] = useAtom(
    dbConnectionStringAtom,
  );
  const dbconnectionstatus = useAtomValue(dbConnectionStatusAtom);
  const [input, setInput] = useState(dbConnectionString || "");

  // Update input when dbConnectionString changes (e.g. when loaded from storage)
  useEffect(() => {
    if (dbConnectionString !== null) {
      setInput(dbConnectionString);
    }
  }, [dbConnectionString]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setInput(dbConnectionString || "");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={
            dbconnectionstatus ? "text-green-700 " : "text-destructive"
          }
          size="icon-sm"
        >
          <Plug className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setup Database</DialogTitle>
          <DialogDescription>Connection String</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            {/* <Label htmlFor="username-1">Connection String</Label> */}
            <Input
              id="collectionString-1"
              name="collectionString"
              placeholder="mongodb+srv://"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={input === dbConnectionString}
              onClick={() => {
                if (input !== dbConnectionString) {
                  setDbConnectionString(input);
                  console.log("Saved connection string:", input);
                }
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ApiConnectionDialog;
