"use client";

import { Project } from "@/types/admin/Project";

interface ProjectsAdminProps {
  projects?: Project[];
  getStatusColor: (status: string) => string;
}

const ProjectsAdmin = ({
  projects = [],
  getStatusColor,
}: ProjectsAdminProps) => {
  // Filtro para mostrar solo proyectos activos
  const projectsToShow = projects.filter(
    (project) => project.status === "active" || project.status === "completed"
  );
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "completed":
        return "Completado";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-800">
            Gestión de Proyectos
          </h2>
          <p className="text-gray-600">
            Supervisa y gestiona todos los proyectos activos
          </p>
        </div>
        <button className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
          + Nuevo Proyecto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar proyectos..."
            className="flex-1 min-w-64 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Completado</option>
            <option>Pendiente</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent">
            <option>Todos los clientes</option>
            <option>TechCorp</option>
            <option>StartupXYZ</option>
            <option>PymeLocal</option>
            <option>Empresa ABC</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Project Header */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  project.status
                )}`}
              >
                {getStatusText(project.status)}
              </span>
              <button className="text-gray-400 hover:text-[#F9A825] transition-colors opacity-0 group-hover:opacity-100">
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

            {/* Project Info */}
            <div className="mb-4">
              <h3 className="font-heading text-lg font-bold text-gray-800 mb-2 group-hover:text-[#F9A825] transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Cliente:</span> {project.client}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 font-medium">
                  Progreso
                </span>
                <span className="text-sm font-bold text-[#F9A825]">
                  {project.progress}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F9A825] to-[#FF8F00] transition-all duration-1000 ease-out"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Project Details */}
            <div className="flex justify-between items-center text-sm mb-4">
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {project.deadline}
              </div>
              <div className="flex items-center font-bold text-green-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                ${project.budget.toLocaleString()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 bg-[#F9A825] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#FF8F00] transition-all duration-300 transform hover:scale-105">
                Ver Detalles
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-[#F9A825]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>

            {/* Project Tags */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {project.status === "active" && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    En progreso
                  </span>
                )}
                {project.progress >= 75 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Casi completo
                  </span>
                )}
                {project.budget >= 10000 && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Alto valor
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
          Resumen de Proyectos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F9A825] mb-1">
              {projects.length}
            </div>
            <div className="text-sm text-gray-600">Total Proyectos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {projects.filter((p) => p.status === "active").length}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {projects.filter((p) => p.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F9A825] mb-1">
              $
              {projectsToShow
                .reduce((total, p) => total + p.budget, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Valor Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsAdmin;
