import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-50 animate-in slide-in-from-bottom-2">
      <Card className="bg-background border border-border shadow-lg max-w-md mx-auto md:mx-0 md:max-w-sm">
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 mt-0.5">
              <Cookie className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                We use cookies
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use cookies to improve your experience and analyze site usage. 
                By continuing, you accept our use of cookies.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto w-auto flex-shrink-0"
              onClick={handleClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1.5 h-auto"
              onClick={handleAcceptAll}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1.5 h-auto"
              onClick={handleRejectAll}
            >
              Reject
            </Button>
            <a
              href="/cookie-policy"
              className="text-xs text-blue-600 hover:text-blue-700 underline self-center"
            >
              Learn more
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;