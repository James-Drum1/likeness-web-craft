import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsLoading(true);

    try {
      const lineItems = items.map((item) => ({
        priceId: item.stripePriceId,
        quantity: item.quantity,
        productName: item.name,
      }));

      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { lineItems },
      });

      if (error) throw new Error(error.message || "Failed to create payment session");
      if (!data?.url) throw new Error("No checkout URL returned");

      clearCart();
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to process checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-sm text-primary font-semibold">{item.price}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Checkout - €${totalPrice.toFixed(2)}`
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
