import { createFileRoute } from "@tanstack/react-router";
import Topbar from "@/components/topbar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  return (
    <div className="flex flex-col h-full bg-background">
      <Topbar>
        <div className="flex items-center gap-2 text-sm ml-2">
          <span className="font-medium text-foreground">Settings</span>
        </div>
      </Topbar>

      <div className="flex-1 overflow-auto p-0">
        <div className="max-w-3xl mx-auto">
          <div className="divide-y border-b border-border">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Customize the look and feel of the application.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Theme</Label>
                    <p className="text-xs text-muted-foreground">
                      Select the color theme for the interface.
                    </p>
                  </div>
                  <Select defaultValue="dark">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Reduce spacing to fit more content on screen.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium">Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Configure the code and data editor settings.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Font Size</Label>
                    <p className="text-xs text-muted-foreground">
                      Adjust the font size for the data viewer.
                    </p>
                  </div>
                  <Select defaultValue="14">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12px</SelectItem>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Word Wrap</Label>
                    <p className="text-xs text-muted-foreground">
                      Wrap long lines of text in the editor.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 flex justify-end gap-3">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
