import { Check } from "lucide-react";

interface FeatureBadgeProps {
  text: string;
}

const FeatureBadge = ({ text }: FeatureBadgeProps) => {
  return (
    <div className="flex items-center gap-2 text-white">
      <div className="bg-green-500 rounded-full p-1">
        <Check className="h-4 w-4 text-white" />
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
};

export default FeatureBadge;