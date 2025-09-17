import { Button } from "./ui/button";
import { Home, User, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navigationLinks = [
    { href: "/", label: "Home", icon: Home, showIcon: true },
    { href: "/pricing", label: "Pricing" },
    { href: "/browse-workers", label: "Discover Stories" },
    { href: "/browse", label: "Browse" },
    { href: "/contact", label: "Contact" },
  ];
  
  const workerLinks = [
    { href: "/join-as-worker", label: "Join as Storyteller" },
    { href: "/worker-signup", label: "Storyteller Signup" },
  ];
  
  const dashboardLinks = user ? [
    { href: "/worker-dashboard", label: "Storyteller Dashboard" },
    { href: "/admin", label: "Admin Dashboard" },
  ] : [];

  const NavLink = ({ href, label, icon: Icon, showIcon = false, className = "" }: {
    href: string;
    label: string;
    icon?: any;
    showIcon?: boolean;
    className?: string;
  }) => (
    <Link
      to={href}
      className={`flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ${
        isActive(href) ? "text-primary font-medium" : ""
      } ${className}`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {showIcon && Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );

  return (
    <header className="w-full bg-background px-6 py-4 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/2bd22362-5e04-465b-b40f-d5c0c26db7b9.png" 
            alt="Heart of Stories" 
            className="h-16 w-auto"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navigationLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
          
          {/* Dashboard links for authenticated users */}
          {user && dashboardLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
                {user && (
                  <Button 
                    variant="outline" 
                    onClick={signOut} 
                    className="w-fit mt-2 self-start"
                    size="sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Main Navigation */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Main Menu
                  </h3>
                  {navigationLinks.map((link) => (
                    <NavLink key={link.href} {...link} className="block py-2" />
                  ))}
                </div>
                
                {/* Worker Links */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    For Storytellers
                  </h3>
                  {workerLinks.map((link) => (
                    <NavLink key={link.href} {...link} className="block py-2" />
                  ))}
                </div>
                
                {/* Dashboard Links */}
                {user && dashboardLinks.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                      Dashboard
                    </h3>
                    {dashboardLinks.map((link) => (
                      <NavLink key={link.href} {...link} className="block py-2" />
                    ))}
                  </div>
                )}
                
                {/* Auth Section */}
                <div className="pt-6 border-t space-y-3">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        Logged in
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={signOut} 
                        className="w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link to="/join-as-worker">Get Started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/join-as-worker">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;