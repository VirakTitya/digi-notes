
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Palette, LogOut } from "lucide-react";

export const Settings = ({ onClose }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");

  const handleLogout = () => {
    setIsSignedIn(false);
    console.log("Logged out");
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    console.log("Theme changed to:", theme);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Settings
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="theme" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="theme">Theme</TabsTrigger>
            </TabsList>
            
            <TabsContent value="theme" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Choose Theme
                  </Label>
                  <Select value={currentTheme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
