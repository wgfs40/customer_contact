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
  background?: boolean; // Optional prop to handle background images
  className?: string; // Optional prop for additional styling
  height?: string; // Optional prop to set height
}
const ImageCarousel = ({
  images,
  className,
  height,
  background,
}: ImageCarouselProps) => {
  return (
    <div
      className={`relative w-full overflow-hidden ${height || "h-screen"} ${
        className || ""
      }`}
    >
      <Carousel className={`w-full relative ${height || "h-screen"}`}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="w-full h-full">
              <Card className="h-[700px] w-full relative overflow-hidden">
                <CardContent className="p-0 h-full relative">
                  {background ? (
                    <div
                      className="absolute inset-0 w-full h-full rounded-lg"
                      style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  ) : (
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-105"
                    />
                  )}
                  {/* Botones centrados verticalmente y horizontalmente */}
                  <CarouselPrevious
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                    style={{ transform: "translateY(-50%)" }}
                  >
                    <span className="sr-only">Previous</span>
                  </CarouselPrevious>
                  <CarouselNext
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                    style={{ transform: "translateY(-50%)" }}
                  >
                    <span className="sr-only">Next</span>
                  </CarouselNext>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
