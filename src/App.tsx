import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import QRGeneration from "./pages/QRGeneration";
import QRMemory from "./pages/QRMemory";

import Shop from "./pages/Shop";
import PaymentSuccess from "./pages/PaymentSuccess";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import MyMemorials from "./pages/MyMemorials";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartDrawer />
          <CookieConsent />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/qr-generation" element={<QRGeneration />} />
            
            <Route path="/shop" element={<Shop />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-memorials" element={<MyMemorials />} />
            
            <Route path="/qr/:qrCode" element={<QRMemory />} />
            <Route path="/memory/:qrCode" element={<QRMemory />} />
            <Route path="/test-qr/:qrCode" element={<div style={{padding: '20px'}}><h1>Test QR Route Working!</h1><p>QR Code: {window.location.pathname.split('/').pop()}</p></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
