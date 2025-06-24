
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Palette, LogOut, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: SettingsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [userEmail, setUserEmail] = useState("");
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Load theme and auth state from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedUser = localStorage.getItem("user");
    
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsSignedIn(true);
      setUserEmail(user.email);
    }
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate login - store user data
    const userData = { email: loginForm.email };
    localStorage.setItem("user", JSON.stringify(userData));
    
    setIsSignedIn(true);
    setUserEmail(loginForm.email);
    
    toast({
      title: "Success",
      description: "Signed in successfully!",
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    // Simulate signup - store user data
    const userData = { email: signupForm.email };
    localStorage.setItem("user", JSON.stringify(userData));
    
    setIsSignedIn(true);
    setUserEmail(signupForm.email);
    
    toast({
      title: "Success",
      description: "Account created successfully!",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsSignedIn(false);
    setUserEmail("");
    setLoginForm({ email: "", password: "" });
    setSignupForm({ email: "", password: "", confirmPassword: "" });
    
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme);
    applyTheme(theme);
    
    toast({
      title: "Theme Updated",
      description: `Switched to ${theme} theme`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
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
          <Tabs defaultValue={isSignedIn ? "account" : "auth"} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="auth">Auth</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
            </TabsList>
            
            <TabsContent value="auth" className="space-y-4">
              {!isSignedIn ? (
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            className="pl-10 pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password (min 6 chars)"
                            value={signupForm.password}
                            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                            className="pl-10 pr-10"
                            required
                            minLength={6}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            value={signupForm.confirmPassword}
                            onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Sign Up
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 font-medium">Signed in successfully!</p>
                    <p className="text-green-600 dark:text-green-300 text-sm">{userEmail}</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="account" className="space-y-4">
              {isSignedIn ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <h3 className="font-medium text-slate-800 dark:text-slate-200">Account Information</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{userEmail}</p>
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
                  <p className="text-slate-500 dark:text-slate-400">Please sign in to view account settings</p>
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
                    <SelectContent className="bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Theme Preview</h4>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded"></div>
                    <div className="w-8 h-8 bg-slate-800 dark:bg-slate-200 rounded"></div>
                    <div className="w-8 h-8 bg-emerald-600 rounded"></div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Current: {currentTheme === "light" ? "Light" : currentTheme === "dark" ? "Dark" : "System"}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
