import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // You could add analytics tracking here
    console.log('Payment successful, session ID:', sessionId);
  }, [sessionId]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto py-20 px-6">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600 mb-2">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Thank you for your order! Your memorial plaque payment has been processed successfully.
            </p>
            
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">What happens next?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div className="text-left">
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email confirmation with your order details and tracking information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-1" />
                  <div className="text-left">
                    <p className="font-medium">Production & Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      Your custom memorial plaque will be crafted and shipped within 5-7 business days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <div className="text-left">
                    <p className="font-medium">QR Code Activation</p>
                    <p className="text-sm text-muted-foreground">
                      Once you receive your plaque, scan the QR code to set up your digital memorial.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {sessionId && (
              <div className="text-xs text-muted-foreground">
                Order Reference: {sessionId}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/')} variant="outline">
                Return Home
              </Button>
              <Button onClick={() => navigate('/shop')}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;