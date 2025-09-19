import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Heart, QrCode, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const Shop = () => {
  const products = [
    {
      id: 1,
      name: "Gold Heart Memorial Plaque",
      price: "£49.99",
      image: "/lovable-uploads/memorial-plaque-gold.jpeg",
      description: "Beautiful heart-shaped memorial plaque with integrated QR code. Each plaque connects to a permanent digital memorial page to honor and remember your loved ones.",
      features: [
        "Premium gold finish",
        "Weather resistant coating",
        "Custom QR code integration",
        "Heart-shaped design",
        "Includes digital memorial setup",
        "Permanent hosting included"
      ]
    },
    {
      id: 2,
      name: "Black Heart Memorial Plaque", 
      price: "£49.99",
      image: "/lovable-uploads/memorial-plaque-black.jpeg",
      description: "Elegant black heart-shaped memorial plaque with integrated QR code. Each plaque connects to a permanent digital memorial page to honor and remember your loved ones.",
      features: [
        "Elegant black finish",
        "Weather resistant coating", 
        "Custom QR code integration",
        "Heart-shaped design",
        "Includes digital memorial setup",
        "Permanent hosting included"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Memorial Heart Plaques
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Beautiful heart-shaped memorial plaques with integrated QR codes. Each plaque connects to a permanent digital memorial page to honor and remember your loved ones.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Weather Resistant
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <QrCode className="w-4 h-4 mr-2" />
              Custom QR Codes
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              Permanent Memorials
            </Badge>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <div className="text-2xl font-bold text-primary">{product.price}</div>
                  </div>
                  <CardDescription className="text-base mb-6">
                    {product.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Features & Benefits:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full" size="lg" asChild>
                    <Link to="/login">Order Now - {product.price}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Material & Quality Section */}
      <section className="py-16 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Material & Quality</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">High quality aluminium with protective coating</h3>
              <p className="text-muted-foreground text-sm">UV resistant and extremely durable</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Precision QR codes that will not fade over time</h3>
              <p className="text-muted-foreground text-sm">Laser-etched for permanent clarity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">All with compatible with outdoor placement</h3>
              <p className="text-muted-foreground text-sm">Weather resistant and long-lasting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation & Use Section */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Installation & Use</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Easy installation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Perfect for headstones, benches, or memorial gardens</li>
                <li>• Strong adhesive backing for secure attachment</li>
                <li>• All tools are accessible from any modern smartphone</li>
                <li>• Compatible with all mobile devices</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Digital Memorial Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Upload unlimited photos and videos</li>
                <li>• Share memories and stories</li>
                <li>• Family members can contribute</li>
                <li>• Secure and private access controls</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How Your Memorial Plaque Works */}
      <section className="py-16 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">How Your Memorial Plaque Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Order your plaque online</h3>
              <p className="text-muted-foreground text-sm">Choose your design and place your order securely online</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Receive your plaque with unique QR code</h3>
              <p className="text-muted-foreground text-sm">Your custom memorial plaque arrives ready to install</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Install at your chosen memorial location</h3>
              <p className="text-muted-foreground text-sm">Attach securely to headstone, bench, or memorial site</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Scan the QR code to create and access your memorial</h3>
              <p className="text-muted-foreground text-sm">Build your digital memorial with photos and memories</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;