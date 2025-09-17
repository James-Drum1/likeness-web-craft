import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import ContactUs from "./pages/ContactUs";
import FindWorkers from "./pages/FindWorkers";

import Browse from "./pages/Browse";
import BrowseWorkers from "./pages/BrowseWorkers";
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerProfile from "./pages/WorkerProfile";
import AdminDashboard from "./pages/AdminDashboard";
import CookiePolicy from "./pages/CookiePolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import WorkerSignup from "./pages/WorkerSignup";
import QRGeneration from "./pages/QRGeneration";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CookieConsent />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/find-workers" element={<FindWorkers />} />
          <Route path="/join-as-worker" element={<Pricing />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/browse-workers" element={<BrowseWorkers />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/:workerId" element={<WorkerProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
           <Route path="/terms-of-service" element={<TermsOfService />} />
           <Route path="/worker-signup" element={<WorkerSignup />} />
           <Route path="/qr-generation" element={<QRGeneration />} />
           <Route path="/shop" element={<Shop />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
