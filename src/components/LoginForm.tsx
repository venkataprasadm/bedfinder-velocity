import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface User {
  username: string;
  password: string;
  type: "owner" | "tenant";
}

// Mock users for demo
const MOCK_USERS: User[] = [
  { username: "owner", password: "password", type: "owner" },
  { username: "tenant", password: "password", type: "tenant" },
];

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
      );
      
      if (user) {
        // Store user info in local storage
        localStorage.setItem("user", JSON.stringify(user));
        
        // Redirect based on user type
        if (user.type === "owner") {
          navigate("/hostel-owner");
        } else {
          navigate("/tenant");
        }
        
        toast.success("Logged in successfully!");
      } else {
        toast.error("Invalid username or password");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    toast.info("Password reset link has been sent to your email.");
  };

  return (
    <Card className="w-full max-w-md glass-card animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-focus-ring"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-velocity-600 hover:text-velocity-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-focus-ring"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full btn-velocity" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="mt-2 text-center text-sm text-muted-foreground">
          <span>Demo accounts: </span>
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">
            owner/password
          </code>
          <span> or </span>
          <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">
            tenant/password
          </code>
        </div>
      </CardFooter>
    </Card>
  );
}
