import { Phone, MessageCircle, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-8 md:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
          {/* Logo and Company Info */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center mb-3 md:mb-4">
              <img 
                src="/lovable-uploads/2bd22362-5e04-465b-b40f-d5c0c26db7b9.png" 
                alt="Workers Mate" 
                className="h-8 md:h-10 w-auto"
              />
            </div>
            
            <p className="text-muted-foreground mb-4 md:mb-6 text-xs md:text-sm leading-relaxed">
              Connecting customers with quality, verified workers across Ireland.
            </p>
            
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <a href="tel:+353858156521" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <Phone className="h-3 md:h-4 w-3 md:w-4" />
                <span className="text-xs md:text-sm">085 8156521</span>
              </a>
              <a href="https://wa.me/353858156521" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <MessageCircle className="h-3 md:h-4 w-3 md:w-4" />
                <span className="text-xs md:text-sm">WhatsApp</span>
              </a>
            </div>
            
            <div className="flex gap-3 md:gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61577973839738" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 md:h-5 w-4 md:w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              </a>
            </div>
          </div>
          
          {/* For Customers */}
          <div>
            <h3 className="font-semibold text-foreground mb-2 md:mb-4 text-xs md:text-sm uppercase tracking-wide">
              FOR CUSTOMERS
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="/find-workers" className="text-muted-foreground hover:text-primary text-xs md:text-sm">
                  Find a Worker
                </a>
              </li>
            </ul>
          </div>
          
          {/* For Businesses */}
          <div>
            <h3 className="font-semibold text-foreground mb-2 md:mb-4 text-xs md:text-sm uppercase tracking-wide">
              FOR BUSINESSES
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="/pricing" className="text-muted-foreground hover:text-primary text-xs md:text-sm">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="/join-as-worker" className="text-muted-foreground hover:text-primary text-xs md:text-sm">
                  Join as a Worker
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-foreground mb-2 md:mb-4 text-xs md:text-sm uppercase tracking-wide">
              COMPANY
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary text-xs md:text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-border pt-4 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-muted-foreground text-xs md:text-sm">
              © 2025 WorkersMate Ltd. All rights reserved.
            </p>
            
            <div className="flex gap-4 md:gap-6">
              <a href="/privacy-policy" className="text-muted-foreground hover:text-primary text-xs md:text-sm">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-muted-foreground hover:text-primary text-xs md:text-sm">
                Terms of Service
              </a>
              <a href="/cookie-policy" className="text-muted-foreground hover:text-primary text-xs md:text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;