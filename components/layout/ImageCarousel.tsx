"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
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
  autoplayDelay?: number; // Tiempo en ms para cambio automático
}

const ImageCarousel = ({
  images,
  className,
  height,
  background,
  autoplayDelay = 4000, // 4 segundos por defecto
}: ImageCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Configurar el API del carrusel
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Función para ir a la siguiente imagen
  const goToNext = useCallback(() => {
    if (!api) return;
    api.scrollNext();
  }, [api]);

  // Función para ir a una imagen específica
  const goToSlide = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  // Autoplay
  useEffect(() => {
    if (!api || !autoplayDelay) return;

    const autoplay = setInterval(() => {
      goToNext();
    }, autoplayDelay);

    // Pausar autoplay cuando el usuario interactúa
    const handleUserInteraction = () => {
      clearInterval(autoplay);
      // Reiniciar autoplay después de 2 segundos de inactividad
      setTimeout(() => {
        const newAutoplay = setInterval(() => {
          goToNext();
        }, autoplayDelay);

        // Limpiar el interval cuando el componente se desmonte
        return () => clearInterval(newAutoplay);
      }, 2000);
    };

    // Event listeners para pausar autoplay
    api.on("pointerDown", handleUserInteraction);

    return () => {
      clearInterval(autoplay);
      api.off("pointerDown", handleUserInteraction);
    };
  }, [api, autoplayDelay, goToNext]);

  return (
    <div
      className={`relative w-full overflow-hidden ${height || "h-screen"} ${
        className || ""
      }`}
    >
      <Carousel
        setApi={setApi}
        className={`w-full relative ${height || "h-screen"}`}
        opts={{
          align: "start",
          loop: true, // Permite loop infinito
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="w-full h-full">
              <Card
                className={`w-full h-full relative overflow-hidden border-0`}
                style={{ height: height || "700px" }}
              >
                <CardContent className="p-0 h-full relative">
                  {background ? (
                    <div
                      className="absolute  w-full h-full"
                      style={{
                        backgroundImage: `url(${image.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  ) : (
                    <div className="absolute  w-full h-full">
                      <Image
                        src={image.src}
                        alt={image.text || `Image ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 hover:scale-105"
                        priority={index === 0} // Solo primera imagen con priority
                      />
                    </div>
                  )}

                  {/* Texto superpuesto */}
                  <div className="absolute bottom-0 left-0 w-full flex items-end justify-center z-10 pb-6">
                    <span className="bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-lg md:text-xl font-semibold max-w-4xl text-center mx-4">
                      {image.text || " "}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Botones de navegación mejorados */}
        <CarouselPrevious
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-300"
          onClick={() => {
            /* El API maneja esto automáticamente */
            api?.scrollPrev();
          }}
        />
        <CarouselNext
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-300"
          onClick={() => {
            /* El API maneja esto automáticamente */
            api?.scrollNext();
          }}
        />

        {/* Indicadores de puntos mejorados */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index + 1
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>

        {/* Contador de slides (opcional) */}
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {current} / {count}
          </span>
        </div>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
