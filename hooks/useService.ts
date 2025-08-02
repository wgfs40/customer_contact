import {
  getServiceCategoriesAction,
  getServicesAction,
} from "@/actions/services_actions";
import Service, { ServiceCategory } from "@/types/home/service";
import { useEffect, useState } from "react";

export function useService() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Estados de loading
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await getServiceCategoriesAction();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const data = await getServicesAction({
          category: selectedCategory === "all" ? undefined : selectedCategory,
        });
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoadingServices(false);
        setIsInitialLoad(false);
      }
    };

    fetchCategories();
    fetchServices();
  }, [selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedService,
    setSelectedService,
    categories,
    services,
    isInitialLoad,
    isLoadingCategories,
    isLoadingServices,
  };
}
