import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import FeatureBadge from "@/components/FeatureBadge";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div 
        className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(231, 60%, 45%), hsl(231, 60%, 35%))"
        }}
      >
        {/* Background pattern/overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
          {/* Main heading */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight max-w-4xl mx-auto">
              Connecting trusted workers with customers across Ireland
            </h1>
          </div>
          
          {/* Service Cards */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-stretch mb-20">
            <ServiceCard
              title="I Need a Worker"
              description="Find verified plumbers, electricians, builders and more in your area. Browse reviews and connect with trusted workers."
              buttonText="Find workers"
              buttonVariant="customer"
            />
            
            <ServiceCard
              title="I'm a Worker"
              description="Grow your business by showcasing your services, receiving job inquiries, and building your online reputation."
              buttonText="Join as a Worker"
              buttonVariant="worker"
            />
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <FeatureBadge text="Verified Workers" />
            <FeatureBadge text="Trusted Reviews" />
            <FeatureBadge text="Free To Use" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;