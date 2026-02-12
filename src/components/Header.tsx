import { Button } from "./ui/button";
import { Home, User, LogOut, Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
const CartButton = () => {
  const { totalItems, setIsCartOpen } = useCart();
  return (
    <Button variant="ghost" size="sm" className="relative" onClick={() => setIsCartOpen(true)}>
      <ShoppingCart className="h-5 w-5 text-primary-foreground" />
      {totalItems > 0 &&
      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      }
    </Button>);

};

const Header = () => {
  const {
    user,
    isAdmin,
    signOut
  } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const navigationLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    showIcon: true
  },
  {
    href: "/shop",
    label: "Shop"
  },
  {
    href: "/contact",
    label: "Contact Us"
  },
  ...(user ?
  [{ href: "/my-memorials", label: "My Memorials" }] :
  []),
  ...(user ? [] : [{ href: "/login", label: "Sign In" }])];

  const adminLinks = user && isAdmin ? [{
    href: "/admin",
    label: "Admin Dashboard"
  }, {
    href: "/qr-generation",
    label: "Generate QR Codes"
  }] : [];
  const NavLink = ({
    href,
    label,
    icon: Icon,
    showIcon = false,
    className = ""






  }: {href: string;label: string;icon?: any;showIcon?: boolean;className?: string;}) => <Link to={href} className={`flex items-center gap-2 transition-colors ${className.includes('block') ? `text-foreground hover:text-primary ${isActive(href) ? "text-primary font-medium" : ""}` : `text-primary-foreground/80 hover:text-primary-foreground ${isActive(href) ? "text-primary-foreground font-medium" : ""}`} ${className}`} onClick={() => setIsMobileMenuOpen(false)}>
      {showIcon && Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>;
  return <header className="w-full bg-primary px-6 py-2 border-b border-primary-foreground/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/lovable-uploads/heart-logo-new.png" alt="Heart of Stories" className="h-16 md:h-20 w-auto max-w-[220px] md:max-w-[300px] object-contain" />

        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navigationLinks.map((link) => <NavLink key={link.href} {...link} />)}
          
          {/* Admin links for authenticated users */}
          {user && adminLinks.map((link) => <NavLink key={link.href} {...link} />)}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <CartButton />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
                {user && <Button variant="outline" onClick={signOut} className="w-fit mt-2 self-start" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>}
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Main Navigation */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Main Menu
                  </h3>
                  {navigationLinks.map((link) => <NavLink key={link.href} {...link} className="block py-2" />)}
                </div>
                
                {/* Admin Links */}
                {user && adminLinks.length > 0 && <div className="space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                      Admin Panel
                    </h3>
                    {adminLinks.map((link) => <NavLink key={link.href} {...link} className="block py-2" />)}
                  </div>}
                
                {/* Auth Section */}
                <div className="pt-6 border-t space-y-3">
                  {user ? <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        Logged in
                      </div>
                      <Button variant="outline" onClick={signOut} className="w-full justify-start">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div> : <div className="space-y-3">
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link to="/login">Get Started</Link>
                      </Button>
                    </div>}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-4">
          <CartButton />
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuItem asChild>
                   <Link to="/my-memorials">My Memorials</Link>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={signOut}>
                   <LogOut className="h-4 w-4 mr-2" />
                   Logout
                 </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu> : <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>}
        </div>
      </div>
    </header>;
};
export default Header;