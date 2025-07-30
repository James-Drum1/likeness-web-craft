import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonVariant: "customer" | "worker";
  onClick?: () => void;
}

const ServiceCard = ({ title, description, buttonText, buttonVariant, onClick }: ServiceCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 text-white max-w-md">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-white/90 mb-6 leading-relaxed">
        {description}
      </p>
      <Button 
        variant={buttonVariant} 
        size="lg" 
        className="w-full font-semibold"
        onClick={onClick}
      >
        {buttonText}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ServiceCard;