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
                className={`${
                  height || "h-[700px]"
                } w-full relative overflow-hidden`}
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
                    <Image
                      src={image.src}
                      alt={image.text || `Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-105"
                    />
                  )}

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
                  <div className="absolute inset-0 flex items-center justify-center z-2">
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
