
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Home, Building, BedDouble, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface User {
  username: string;
  type: "owner" | "tenant";
}

export function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (location.pathname !== "/") {
      navigate("/");
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const NavItems = () => (
    <div className={cn("flex", isMobile ? "flex-col space-y-4" : "items-center space-x-4")}>
      {user?.type === "owner" ? (
        <>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/hostel-owner")}
            className="flex items-center gap-2"
          >
            <Building className="h-4 w-4" />
            <span>My Hostels</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/manage-beds")}
            className="flex items-center gap-2"
          >
            <BedDouble className="h-4 w-4" />
            <span>Manage Beds</span>
          </Button>
        </>
      ) : user?.type === "tenant" ? (
        <>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/tenant")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/search")}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </>
      ) : null}
      {user && (
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      )}
    </div>
  );

  return (
    <header className="fixed top-0 w-full bg-white bg-opacity-80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold text-velocity-800 tracking-tight cursor-pointer"
            onClick={() => user ? (user.type === "owner" ? navigate("/hostel-owner") : navigate("/tenant")) : navigate("/")}
          >
            Velocity
          </h1>
          {user && (
            <div className="ml-2 px-2 py-1 bg-velocity-100 text-velocity-800 text-xs font-medium rounded-full">
              {user.type === "owner" ? "Hostel Owner" : "Tenant"}
            </div>
          )}
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-8">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <NavItems />
        )}
      </div>
    </header>
  );
}
