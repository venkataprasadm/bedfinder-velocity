
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      // Redirect to appropriate page based on user type
      if (userData.type === "owner") {
        navigate("/hostel-owner");
      } else {
        navigate("/tenant");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-velocity-50 p-4">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8 page-transition">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-velocity-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-velocity-800 to-velocity-600">
                Velocity
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-velocity-800 mb-2">
              Find your perfect hostel
            </h2>
            <p className="text-muted-foreground max-w-md">
              Seamlessly manage your hostel property or find the perfect accommodation as a tenant.
            </p>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Designed by</span> Spanar Systems
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 page-transition">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
