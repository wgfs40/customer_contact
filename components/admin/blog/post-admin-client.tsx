"use client";

import { useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Types
interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  featured_image: File | null;
  meta_title: string;
  meta_description: string;
  tags: string[];
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
  existingPost?: Partial<FormData & { featured_image?: string }> | null;
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

const ImageUpload = ({
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
            name="featured_image"
          />
        </label>
      )}
    </div>
  </div>
);

const TagsManager = ({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}: {
  tags: string[];
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
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Tag key={`${tag}-${index}`} tag={tag} onRemove={onRemoveTag} />
          ))}
        </div>
      )}
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
  const [formData, setFormData] = useState<FormData>({
    title: existingPost?.title || "",
    slug: existingPost?.slug || "",
    excerpt: existingPost?.excerpt || "",
    content: existingPost?.content || "",
    category_id: existingPost?.category_id || "",
    status: existingPost?.status || "draft",
    featured: existingPost?.featured || false,
    featured_image: null,
    meta_title: existingPost?.meta_title || "",
    meta_description: existingPost?.meta_description || "",
    tags: existingPost?.tags || [],
  });

  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof existingPost?.featured_image === "string"
      ? existingPost.featured_image
      : null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Format options
  const formatOptions = useMemo(
    () => ({
      bold: (text: string) => `**${text}**`,
      italic: (text: string) => `*${text}*`,
      h1: (text: string) => `# ${text}`,
      h2: (text: string) => `## ${text}`,
      h3: (text: string) => `### ${text}`,
      list: (text: string) => `- ${text}`,
      link: (text: string) => `[${text}](https://)`,
      quote: (text: string) => `> ${text}`,
    }),
    []
  );

  // Event handlers
  const updateStats = useCallback(() => {
    const content =
      (document.getElementById("content") as HTMLTextAreaElement)?.value || "";
    const { words, chars, readTime } = calculateStats(content);

    const updateElement = (id: string, value: string) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };

    updateElement("word-count", words.toString());
    updateElement("char-count", chars.toString());
    updateElement("read-time", `${readTime} min`);
  }, []);

  const handleSave = useCallback(
    async (status: FormData["status"]) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        // Get form data
        const formElement = document.querySelector("form") as HTMLFormElement;
        if (!formElement) throw new Error("Formulario no encontrado");

        const formDataToSend = new FormData(formElement);
        formDataToSend.set("status", status);
        formDataToSend.set("tags", JSON.stringify(formData.tags));

        // TODO: Replace with actual API call
        console.log("Guardando post:", {
          status,
          data: Object.fromEntries(formDataToSend),
        });

        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (status === "published") {
          router.push("/admin?tab=posts");
        }
      } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error al guardar el post");
      } finally {
        setIsLoading(false);
      }
    },
    [formData.tags, isLoading, router]
  );

  const handleFormat = useCallback(
    (type: FormatType) => {
      const textarea = document.getElementById(
        "content"
      ) as HTMLTextAreaElement;
      if (!textarea || !formatOptions[type]) return;

      const { selectionStart: start, selectionEnd: end, value } = textarea;
      const selectedText = value.substring(start, end);
      const replacement = formatOptions[type](selectedText);

      textarea.setRangeText(replacement, start, end, "end");
      textarea.focus();
    },
    [formatOptions]
  );

  const handleClick = useCallback(async () => {
    if (isLoading) return;

    switch (action) {
      case "goBack":
        router.back();
        break;
      case "saveDraft":
        await handleSave("draft");
        break;
      case "publish":
        await handleSave("published");
        break;
      case "format":
        if (data?.type) handleFormat(data.type);
        break;
    }
  }, [action, data, isLoading, router, handleSave, handleFormat]);

  const handleAddTag = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && tagInput.trim()) {
        e.preventDefault();
        const newTag = tagInput.trim().toLowerCase();

        if (!formData.tags.includes(newTag) && formData.tags.length < 10) {
          setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
          setTagInput("");
        }
      }
    },
    [tagInput, formData.tags]
  );

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, featured_image: file }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleImageRemove = useCallback(() => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, featured_image: null }));

    // Clear file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }, []);

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
  }, [action, updateStats]);

  useEffect(() => {
    if (!isEditing) {
      const titleInput = document.getElementById("title") as HTMLInputElement;
      const slugInput = document.getElementById("slug") as HTMLInputElement;

      if (titleInput && slugInput) {
        const handleTitleChange = () => {
          slugInput.value = generateSlug(titleInput.value);
        };

        titleInput.addEventListener("input", handleTitleChange);
        return () => titleInput.removeEventListener("input", handleTitleChange);
      }
    }
  }, [isEditing]);

  // Render specific components
  if (action === "imageUpload") {
    return (
      <ImageUpload
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onImageRemove={handleImageRemove}
      />
    );
  }

  if (action === "tags") {
    return (
      <TagsManager
        tags={formData.tags}
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
