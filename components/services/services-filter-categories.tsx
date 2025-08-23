import { getAllCategories } from "@/lib/blog/blogApi";
import ServicesFilterClient from "./services-filter-client";

const ServicesFilterCategories = async () => {
  let categories;
  try {
    categories = await getAllCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
  

  if (!categories || !categories.data || categories.data.length === 0) {
    return null;
  }

  return (
    <>
      {/* Filter Categories */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Encuentra el Servicio Perfecto para tu Negocio
        </h2>

        {/* Componente cliente para manejar interacciones */}
        <ServicesFilterClient categories={categories.data} />
      </div>
    </>
  );
};

export default ServicesFilterCategories;
