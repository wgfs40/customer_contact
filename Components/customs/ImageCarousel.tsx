import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";

interface ImageCarouselProps {
  images: string[];
}
const ImageCarousel = ({ images }: ImageCarouselProps) => {
  return (
    <div>
      <Carousel className="w-full h-[400px]">
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <span className="sr-only">Previous</span>
        </CarouselPrevious>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="w-full h-full">
              <Card className="h-full">
                <CardContent className="p-0">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <span className="sr-only">Next</span>
        </CarouselNext>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
