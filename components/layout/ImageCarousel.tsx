import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";

interface ImageItem {
  src: string;
  text: string;
}

interface ImageCarouselProps {
  images: ImageItem[];
  background?: boolean;
  className?: string;
  height?: string;
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
              <Card
              className={`w-full h-full relative overflow-hidden`}
              style={{ height: height || "700px" }}
              >
              <CardContent className="p-0 h-full relative">
                {background ? (
                <div
                  className="absolute inset-0 w-full h-full rounded-lg"
                  style={{
                  backgroundImage: `url(${image.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  }}
                />
                ) : (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                  src={image.src}
                  alt={image.text || `Image ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                  priority
                  />
                </div>
                )}

                <CarouselPrevious
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                >
                <span className="sr-only">Previous</span>
                </CarouselPrevious>
                <CarouselNext
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                >
                <span className="sr-only">Next</span>
                </CarouselNext>
                <div className="absolute bottom-0 left-0 w-full flex items-end justify-center z-2 pb-6">
                <span className="bg-black bg-opacity-60 text-white px-6 py-3 rounded-lg text-xl font-semibold">
                  {image.text || " "}
                </span>
                </div>
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
