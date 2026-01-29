import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { Field, FieldLabel } from "@/components/ui/field";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4">
      <Field>
        <FieldLabel>MongoDB Connection String</FieldLabel>
        <div className="flex flex-row items-center justify-center gap-4">
          <Input placeholder="mongodb://username:password@host:port" />
        </div>
      </Field>
    </div>
  );
}
