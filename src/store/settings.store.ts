import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const dbConnectionStatusAtom = atom<boolean>(false);
export const dbConnectionStringAtom = atomWithStorage<string | null>(
  "db_connection_string",
  null,
);
export const dbLoadingAtom = atom<boolean>(false);
export const dbErrorAtom = atom<string | null>(null);
export const databasesAtom = atom<string[]>([]);
export const clusterInfoAtom = atom<{
  hosts: string[];
  app_name: string;
}>();
export const databaseCollectionsAtom = atom<Record<string, string[]>>({});
export const dataFromTheCollectionAtom = atom<{}>({});
