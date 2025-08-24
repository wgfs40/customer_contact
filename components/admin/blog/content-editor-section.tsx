import PostsAdminClient from "./post-admin-client";


interface BlogPost {
  content?: string;
}

interface ContentEditorSectionProps {
  existingPost: BlogPost | null;
}

const TOOLBAR_ITEMS = [
  { icon: "B", title: "Negrita", action: "bold" as const },
  { icon: "I", title: "Cursiva", action: "italic" as const },
  // { icon: "U", title: "Subrayado", action: "underline" as const }, // Removed because "underline" is not assignable to FormatType
  { icon: "—", title: "Separador" },
  { icon: "H1", title: "Título 1", action: "h1" as const },
  { icon: "H2", title: "Título 2", action: "h2" as const },
  { icon: "H3", title: "Título 3", action: "h3" as const },
  { icon: "—", title: "Separador" },
  { icon: "📝", title: "Lista", action: "list" as const },
  { icon: "🔗", title: "Enlace", action: "link" as const },
  // { icon: "📷", title: "Imagen", action: "image" as const }, // Removed because "image" is not assignable to FormatType
  { icon: "💬", title: "Cita", action: "quote" as const },
];

export const ContentEditorSection = ({
  existingPost,
}: ContentEditorSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-[#F9A825] to-[#FF8F00] rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Contenido del Artículo
          </h2>
        </div>
        <p className="text-gray-600">
          Escribe el contenido principal de tu artículo
        </p>
      </div>

      {/* Toolbar */}
      <div className="border border-gray-300 rounded-t-xl bg-gray-50 p-3 flex flex-wrap gap-2">
        {TOOLBAR_ITEMS.map((tool, index) =>
          tool.icon === "—" ? (
            <div
              key={`separator-${index}`}
              className="w-px h-6 bg-gray-300 mx-1"
            />
          ) : (
            <PostsAdminClient
              key={`tool-${tool.action || index}`}
              action="format"
              data={{ type: tool.action }}
            >
              <button
                type="button"
                title={tool.title}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-[#F9A825] hover:bg-[#F9A825]/10 rounded transition-colors"
              >
                {tool.icon}
              </button>
            </PostsAdminClient>
          )
        )}
      </div>

      {/* Content Textarea */}
      <textarea
        id="content"
        name="content"
        defaultValue={existingPost?.content || ""}
        rows={20}
        placeholder={`Escribe aquí el contenido de tu artículo...

Puedes usar Markdown para formatear:
- **texto en negrita**
- *texto en cursiva*
- # Títulos
- - Listas
- [enlaces](https://ejemplo.com)

¡Empieza a escribir tu contenido increíble!`}
        className="w-full px-4 py-4 border-x border-b border-gray-300 rounded-b-xl focus:ring-2 focus:ring-[#F9A825]/50 focus:border-[#F9A825] transition-colors resize-none font-mono text-sm"
        required
      />
    </div>
  );
};
