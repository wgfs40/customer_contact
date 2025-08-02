interface ProjectItemProps {
  project: {
    id: number;
    title: string;
    client: string;
    status: "active" | "completed" | "pending";
    progress: number;
    deadline: string;
    budget: number;
  };
  getStatusColor: (status: string) => string;
}

const ProjectItem = ({ project, getStatusColor }: ProjectItemProps) => {
  return (
    <div
      key={project.id}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            project.status
          )}`}
        >
          {project.status === "active"
            ? "Activo"
            : project.status === "completed"
            ? "Completado"
            : "Pendiente"}
        </span>
        <button className="text-gray-400 hover:text-[#F9A825] transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      <h3 className="font-heading text-lg font-bold text-gray-800 mb-2">
        {project.title}
      </h3>
      <p className="text-gray-600 mb-4">Cliente: {project.client}</p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progreso</span>
          <span className="text-sm font-semibold text-[#F9A825]">
            {project.progress}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F9A825] to-[#FF8F00] transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <span>📅 {project.deadline}</span>
        <span className="font-semibold text-green-600">
          ${project.budget.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-[#F9A825] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#FF8F00] transition-colors">
          Ver Detalles
        </button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          📝
        </button>
      </div>
    </div>
  );
};

export default ProjectItem;
