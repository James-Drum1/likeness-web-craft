import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="w-full bg-background px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/2bd22362-5e04-465b-b40f-d5c0c26db7b9.png" 
            alt="Workers Mate" 
            className="h-10 w-auto"
          />
        </div>
        
        <Button variant="login" size="sm" asChild>
          <a href="/login">Login</a>
        </Button>
      </div>
    </header>
  );
};

export default Header;