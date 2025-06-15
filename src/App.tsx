
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Inquiries from "./pages/Inquiries";
import InquiriesNew from "./pages/InquiriesNew";
import InquiryDetails from "./pages/InquiryDetails";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import UpdatePassword from "./pages/UpdatePassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/admin/users"
              element={<Admin initialTab="users" />}
            />
            <Route
              path="/admin/inquiries"
              element={<Admin initialTab="inquiries" />}
            />
            <Route
              path="/admin/orders"
              element={<Admin initialTab="orders" />}
            />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/inquiries/new" element={<InquiriesNew />} />
            <Route path="/inquiries/:id" element={<InquiryDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
