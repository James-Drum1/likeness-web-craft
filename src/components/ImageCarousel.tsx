import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  className?: string;
}

export const ImageCarousel = ({ images, className = "" }: ImageCarouselProps) => {
  if (!images || images.length === 0) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No photos have been added yet</p>
      </Card>
    );
  }

  if (images.length === 1) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <img
          src={images[0]}
          alt="Memorial photo"
          className="w-full h-64 md:h-80 object-cover"
        />
      </Card>
    );
  }

  return (
    <div className={className}>
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden">
                <img
                  src={image}
                  alt={`Memorial photo ${index + 1}`}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};