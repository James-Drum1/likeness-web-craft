import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="w-full bg-background px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-foreground">TRUSTED WORKS</span>
        </div>
        
        <Button variant="login" size="sm">
          Login
        </Button>
      </div>
    </header>
  );
};

export default Header;