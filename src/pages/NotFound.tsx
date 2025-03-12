
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-velocity-50 p-4">
      <div className="text-center max-w-md animate-scale-in">
        <h1 className="text-7xl font-bold text-velocity-600 mb-4">404</h1>
        <p className="text-2xl font-semibold text-velocity-800 mb-4">Page not found</p>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you were looking for.
        </p>
        <Button 
          className="btn-velocity"
          onClick={() => navigate("/")}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
