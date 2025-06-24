
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Palette, LogOut } from "lucide-react";

interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: SettingsProps) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");

  const handleLogout = () => {
    setIsSignedIn(false);
    console.log("Logged out");
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    // In a real app, this would apply the theme
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
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4">
              {isSignedIn ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-medium text-slate-800">Account Information</h3>
                    <p className="text-sm text-slate-600">user@example.com</p>
                  </div>
                  
                  <Button 
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">Please sign in to view account settings</p>
                </div>
              )}
            </TabsContent>
            
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
