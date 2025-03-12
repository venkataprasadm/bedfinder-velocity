
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      {children}
      <Toaster />
    </BrowserRouter>
  );
}
