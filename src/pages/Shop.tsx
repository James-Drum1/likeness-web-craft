import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, Star, Clock, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Shop = () => {
  const products = [
    {
      id: 1,
      name: "Gold Heart Memorial Plaque",
      price: "€49.0",
      image: "/lovable-uploads/memorial-card-gold-new.jpeg",
      description: "Elegant gold finished memorial plaque featuring a beautiful heart design with 'Test Not more Forgotten' inscription. The QR code is aesthetically integrated within the heart shape for a touching tribute.",
      features: [
        "Premium gold finish coating",
        "Heart-shaped design with QR code integration",
        "Laser-engraved 'Test Not more Forgotten' text",
        "Weather resistant materials suitable for outdoor use",
        "Easy installation with mounting hardware included",
        "High contrast QR code for easy scanning",
        "Stunning black for easy readability"
      ]
    },
    {
      id: 2,
      name: "Black Heart Memorial Plaque",
      price: "€49.0",
      image: "/lovable-uploads/memorial-card-dark.jpeg",
      description: "Sophisticated black memorial plaque with silver heart design that'll last but never forgotten inscription. Elegant Text Loving Memorial text and integrated QR code for eternal remembrance.",
      features: [
        "Elegant black finish with silver heart accent",
        "Heart-shaped design with QR code integration",
        "Text inscription: 'Last but never forgotten' and 'He Loving Memorial'",
        "Premium materials for outdoor durability",
        "Interactive feature's elegant memorial and text",
        "High contrast QR code for reliable scanning",
        "Professional appearance for memorial installations"
      ]
    }
  ];

  const qualityFeatures = [
    "High grade aluminium base with protective coating",
    "UV-resistant finish prevents fading",
    "Waterproof and corrosion resistant",
    "Suitable for all weather conditions"
  ];

  const installationFeatures = [
    "Easy mounting with included hardware",
    "Perfect for headstones, benches, or memorial gardens",
    "QR code scannable from 1-2 meters distance",
    "Compatible with all smartphones"
  ];

  const howItWorks = [
    {
      step: 1,
      title: "We create a unique QR Code and",
      description: "Each plaque gets a unique QR code"
    },
    {
      step: 2,
      title: "Your memorial plaque arrives",
      description: "Professional installation ready"
    },
    {
      step: 3,
      title: "Scan the QR code to access and",
      description: "Connect to digital memories"
    },
    {
      step: 4,
      title: "Add photos, videos, and tributes",
      description: "Share lasting memories"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Memorial Heart Plaques</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Beautiful heart-shaped memorial plaques with integrated QR codes. Each plaque 
            connects to a personalized digital memorial page to honor and remember your loved 
            ones.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {products.map((product) => (
            <Card key={product.id} className="shadow-lg">
              <CardHeader className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl text-primary">{product.name}</CardTitle>
                <CardDescription className="text-2xl font-bold text-primary">{product.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{product.description}</p>
                
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Order Now - €49.0
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Material & Quality + Installation & Use */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Material & Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {qualityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center gap-2">
                <Star className="h-5 w-5" />
                Installation & Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {installationFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* How Your Memorial Plaque Works */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-8">How Your Memorial Plaque Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardContent className="p-8">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-4">Honor Their Memory Forever</h3>
              <p className="text-muted-foreground mb-6">
                Create a lasting tribute that connects the physical and digital worlds, 
                allowing family and friends to share memories for generations to come.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Order Your Memorial Plaque Today
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shop;