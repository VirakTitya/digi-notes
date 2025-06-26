
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut } from "lucide-react";

export const Settings = ({ onClose, currentUser, onLogout }) => {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Logged in as
                </Label>
                <div className="p-3 bg-slate-100 rounded-md">
                  <p className="text-sm font-medium text-slate-700">
                    {currentUser || 'Not logged in'}
                  </p>
                </div>
              </div>
              
              {/* Logout Button */}
              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="w-full flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
