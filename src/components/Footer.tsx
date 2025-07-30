import { Phone, MessageCircle, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/2bd22362-5e04-465b-b40f-d5c0c26db7b9.png" 
                alt="Workers Mate" 
                className="h-10 w-auto"
              />
            </div>
            
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Connecting customers with quality, verified workers across Ireland and the UK.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm">085 8156521</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">WhatsApp</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>
          
          {/* For Customers */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
              FOR CUSTOMERS
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Find a Worker
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-muted-foreground hover:text-primary text-sm">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          
          {/* For Businesses */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
              FOR BUSINESSES
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/pricing" className="text-muted-foreground hover:text-primary text-sm">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Join as a Worker
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Business FAQ
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
              COMPANY
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 WorkersMate Ltd. All rights reserved.
            </p>
            
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">
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