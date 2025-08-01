import { Button } from "./ui/button";
import { Home, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full bg-background px-6 py-4 border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/2bd22362-5e04-465b-b40f-d5c0c26db7b9.png" 
            alt="Workers Mate" 
            className="h-10 w-auto"
          />
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4" />
            Home
          </a>
          <a href="/how-it-works" className="text-muted-foreground hover:text-foreground">How It Works</a>
          <a href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</a>
          <a href="/about" className="text-muted-foreground hover:text-foreground">About Us</a>
          <a href="/browse-workers" className="text-muted-foreground hover:text-foreground">Find Workers</a>
          {user && (
            <a href="/worker-dashboard" className="text-muted-foreground hover:text-foreground">My Dashboard</a>
          )}
        </nav>
        
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
          <Button variant="outline" size="sm" asChild>
            <a href="/login">Login</a>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;