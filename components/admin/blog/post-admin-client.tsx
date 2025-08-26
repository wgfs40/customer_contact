"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createBlogPostAction,
  updateBlogPostAction,
} from "@/actions/blog_actions";
import Swal from "sweetalert2";

// Types
interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  featured: boolean;
  image_url: File | null;
  meta_title: string;
  meta_description: string;  
}

type FormatType =
  | "bold"
  | "italic"
  | "h1"
  | "h2"
  | "h3"
  | "list"
  | "link"
  | "quote";
type ActionType =
  | "goBack"
  | "saveDraft"
  | "publish"
  | "format"
  | "stats"
  | "seoPreview"
  | "imageUpload"
  | "tags";

interface PostsAdminClientProps {
  children: ReactNode;
  action?: ActionType;
  data?: { type?: FormatType };
  categories?: Array<{ id: string; name: string }>;
  existingPost?: Partial<FormData & { image_url?: string; id?: string }> | null;
  isEditing?: boolean;
}

// Utility functions
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const calculateStats = (text: string) => {
  const words = text.split(/\s+/).filter((word) => word.length > 0).length;
  const chars = text.length;
  const readTime = Math.ceil(words / 200);
  return { words, chars, readTime };
};

const formatOptions = {
  bold: (text: string) => `**${text}**`,
  italic: (text: string) => `*${text}*`,
  h1: (text: string) => `# ${text}`,
  h2: (text: string) => `## ${text}`,
  h3: (text: string) => `### ${text}`,
  list: (text: string) => `- ${text}`,
  link: (text: string) => `[${text}](https://)`,
  quote: (text: string) => `> ${text}`,
};

// Helper functions
const updateElement = (id: string, value: string) => {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
};

const getElementValue = (id: string): string => {
  const element = document.getElementById(id) as
    | HTMLInputElement
    | HTMLTextAreaElement;
  return element?.value || "";
};

const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

const createFileReader = (onLoad: (result: string) => void): FileReader => {
  const reader = new FileReader();
  reader.onload = (e) => onLoad(e.target?.result as string);
  return reader;
};

// Sub-components
const Tag = ({
  tag,
  onRemove,
}: {
  tag: string;
  onRemove: (tag: string) => void;
}) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F9A825]/10 text-[#F9A825] rounded-full text-sm font-medium">
    #{tag}
    <button
      type="button"
      onClick={() => onRemove(tag)}
      className="w-4 h-4 text-[#F9A825] hover:text-red-600 transition-colors"
      aria-label={`Eliminar etiqueta ${tag}`}
    >
      ×
    </button>
  </span>
);

const ImageUploadComponent = ({
  imagePreview,
  onImageChange,
  onImageRemove,
}: {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Imagen Destacada</h3>
      <p className="text-gray-600 text-sm">Imagen principal del artículo</p>
    </div>

    <div className="space-y-4">
      {imagePreview ? (
        <div className="relative group">
          <Image
            src={imagePreview}
            alt="Preview de imagen destacada"
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-xl"
            priority
          />
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            aria-label="Eliminar imagen"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#F9A825] transition-colors cursor-pointer group">
          <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-[#F9A825] transition-colors">
            <svg
              className="w-12 h-12 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-sm font-medium">Subir imagen</span>
            <span className="text-xs mt-1">PNG, JPG hasta 5MB</span>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onImageChange}
            className="hidden"
            name="image_url"
          />
        </label>
      )}
    </div>
  </div>
);

const TagsManagerComponent = ({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}: {
  tags?: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Etiquetas</h3>
      <p className="text-gray-600 text-sm">Palabras clave para tu artículo</p>
    </div>

    <div className="space-y-4">
      <input
        type="text"
        value={tagInput}
        onChange={(e) => onTagInputChange(e.target.value)}
        onKeyDown={onAddTag}
        placeholder="Escribe una etiqueta y presiona Enter"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors"
        maxLength={30}
      />
     
    </div>
  </div>
);

// Main component
const PostsAdminClient = ({
  children,
  action,
  data,
  existingPost = null,
  isEditing = false,
}: PostsAdminClientProps) => {
  const router = useRouter();

  // State
  const [formData, setFormData] = useState<FormData>(() => ({
    title: existingPost?.title || "",
    slug: existingPost?.slug || "",
    excerpt: existingPost?.excerpt || "",
    content: existingPost?.content || "",
    category_id: existingPost?.category_id || "",
    featured: existingPost?.featured || false,
    image_url: null,
    meta_title: existingPost?.meta_title || "",
    meta_description: existingPost?.meta_description || "",    
  }));

  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof existingPost?.image_url === "string" ? existingPost.image_url : null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Event handlers
  const updateStats = () => {
    const content = getElementValue("content");
    const { words, chars, readTime } = calculateStats(content);

    updateElement("word-count", words.toString());
    updateElement("char-count", chars.toString());
    updateElement("read-time", `${readTime} min`);
  };

  const updateSeoPreview = () => {
    const values = {
      title: getElementValue("title"),
      metaTitle: getElementValue("meta_title"),
      slug: getElementValue("slug"),
      excerpt: getElementValue("excerpt"),
      metaDescription: getElementValue("meta_description"),
      content: getElementValue("content"),
    };

    // Update preview elements
    const previewTitle = document.getElementById("seo-preview-title");
    const previewUrl = document.getElementById("seo-preview-url");
    const previewDescription = document.getElementById(
      "seo-preview-description"
    );

    if (previewTitle) {
      previewTitle.textContent =
        values.metaTitle || values.title || "Título del artículo";
    }
    if (previewUrl) {
      previewUrl.textContent = `tudominio.com › blog › ${
        values.slug || "url-del-articulo"
      }`;
    }
    if (previewDescription) {
      previewDescription.textContent =
        values.metaDescription ||
        values.excerpt ||
        "Descripción del artículo que aparecerá en los resultados de búsqueda...";
    }

    // Update character counts
    const metaTitleCount = document.getElementById("meta-title-count");
    const metaDescCount = document.getElementById("meta-description-count");

    if (metaTitleCount) {
      const count = values.metaTitle.length;
      metaTitleCount.textContent = `${count}/60`;
      metaTitleCount.className = `text-sm font-medium ${
        count > 60
          ? "text-red-500"
          : count > 50
          ? "text-yellow-500"
          : "text-gray-400"
      }`;
    }

    if (metaDescCount) {
      const count = values.metaDescription.length;
      metaDescCount.textContent = `${count}/160`;
      metaDescCount.className = `text-sm font-medium ${
        count > 160
          ? "text-red-500"
          : count > 140
          ? "text-yellow-500"
          : "text-gray-400"
      }`;
    }

    // Update SEO checks
    updateSeoChecks(values);
  };

  const updateSeoChecks = (values: any) => {
    const checks = [
      {
        id: "seo-title-check",
        condition: values.metaTitle.length > 0 && values.metaTitle.length <= 60,
      },
      {
        id: "seo-description-check",
        condition:
          values.metaDescription.length > 0 &&
          values.metaDescription.length <= 160,
      },
      {
        id: "seo-slug-check",
        condition: values.slug.length > 0,
      },
      {
        id: "seo-content-check",
        condition:
          values.content.split(/\s+/).filter((word: string) => word.length > 0)
            .length >= 300,
      },
    ];

    checks.forEach((check) => {
      const element = document.getElementById(check.id);
      if (element) {
        element.className = `w-2 h-2 rounded-full ${
          check.condition ? "bg-green-500" : "bg-gray-300"
        }`;
      }
    });

    // Update overall score
    const passedChecks = checks.filter((check) => check.condition).length;
    const seoScore = document.getElementById("seo-score");

    if (seoScore) {
      const scoreConfig = {
        4: { text: "Excelente", class: "text-sm font-medium text-green-600" },
        3: { text: "Bueno", class: "text-sm font-medium text-yellow-600" },
        2: { text: "Bueno", class: "text-sm font-medium text-yellow-600" },
        default: {
          text: "Mejorable",
          class: "text-sm font-medium text-red-600",
        },
      };

      const config =
        scoreConfig[passedChecks as keyof typeof scoreConfig] ||
        scoreConfig.default;
      seoScore.textContent = config.text;
      seoScore.className = config.class;
    }
  };

  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const formElement = document.querySelector("form") as HTMLFormElement;
      if (!formElement) throw new Error("Formulario no encontrado");

      const formDataToSend = new FormData(formElement);   

      console.log("Guardando post:", {
        data: Object.fromEntries(formDataToSend),
      });

      let result;
      //validar si es una actualizacion de datos
      if (isEditing) {
        const updateData = Object.fromEntries(formDataToSend) as any;
        result = await updateBlogPostAction(updateData?.id || "", updateData);
        console.log("Resultado de la edición del post:", result);
      } else {
        result = await createBlogPostAction(
          Object.fromEntries(formDataToSend) as any
        );
      }

      console.log("Resultado de la creación del post:", result);

      if (result.success) {
        Swal.fire({
          title: "Éxito!",
          text: `¡Post guardado exitosamente!`,
          icon: "success",
          confirmButtonText: "OK",
        });

        if (result.success) {
          router.push("/admin?tab=posts");
        }
      } else {
        console.error("Error al guardar el post:", result);
        throw new Error(result.error || "Error al guardar el post");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        title: "Error",
        text: "Error al guardar el post",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormat = (type: FormatType) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea || !formatOptions[type]) return;

    const { selectionStart: start, selectionEnd: end, value } = textarea;
    const selectedText = value.substring(start, end);
    const replacement = formatOptions[type](selectedText);

    textarea.setRangeText(replacement, start, end, "end");
    textarea.focus();
  };

  const handleClick = async () => {
    if (isLoading) return;

    const actionHandlers = {
      goBack: () => router.back(),
      saveDraft: () => handleSave("draft"),
      publish: () => handleSave("published"),
      format: () => data?.type && handleFormat(data.type),
    };

    const handler = actionHandlers[action as keyof typeof actionHandlers];
    if (handler) {
      await handler();
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();

      
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
   
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileSize(file)) {
      alert("La imagen debe ser menor a 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, image_url: file }));

    const reader = createFileReader((result) => setImagePreview(result));
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: null }));

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleTitleChange = () => {
    const titleInput = document.getElementById("title") as HTMLInputElement;
    const slugInput = document.getElementById("slug") as HTMLInputElement;

    if (titleInput && slugInput) {
      slugInput.value = generateSlug(titleInput.value);
    }
  };

  // Effects
  useEffect(() => {
    if (action === "stats") {
      const contentTextarea = document.getElementById("content");
      if (contentTextarea) {
        contentTextarea.addEventListener("input", updateStats);
        updateStats();
        return () => contentTextarea.removeEventListener("input", updateStats);
      }
    }
  }, [action]);

  useEffect(() => {
    if (action === "seoPreview") {
      const inputIds = [
        "title",
        "meta_title",
        "slug",
        "excerpt",
        "meta_description",
        "content",
      ];
      const elements = inputIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      elements.forEach((el) => {
        el?.addEventListener("input", updateSeoPreview);
      });

      updateSeoPreview();

      return () => {
        elements.forEach((el) => {
          el?.removeEventListener("input", updateSeoPreview);
        });
      };
    }
  }, [action]);

  useEffect(() => {
    if (!isEditing) {
      const titleInput = document.getElementById("title") as HTMLInputElement;

      if (titleInput) {
        titleInput.addEventListener("input", handleTitleChange);
        return () => titleInput.removeEventListener("input", handleTitleChange);
      }
    }
  }, [isEditing]);

  // Render specific components
  if (action === "imageUpload") {
    return (
      <ImageUploadComponent
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onImageRemove={handleImageRemove}
      />
    );
  }

  if (action === "tags") {
    return (
      <TagsManagerComponent        
        tagInput={tagInput}
        onTagInputChange={setTagInput}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={isLoading ? "pointer-events-none opacity-75" : ""}
    >
      {children}
    </div>
  );
};

export default PostsAdminClient;
