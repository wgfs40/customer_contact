"use client";

import { useState } from "react";
import UserTable from "./UserTable";

interface UsersManagementProps {
  users: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
  }>;
  getStatusColor: (status: string) => string;
}

const UsersManagement = ({ users, getStatusColor }: UsersManagementProps) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const handleUserSelect = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-800">
            Gestión de Usuarios
          </h2>
          <p className="text-gray-600">
            Administra clientes y usuarios del sistema
          </p>
        </div>
        <button className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
          + Agregar Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="flex-1 min-w-64 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>Todos los roles</option>
            <option>Cliente</option>
            <option>VIP</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <UserTable
            users={users}
            selectedUsers={selectedUsers}
            handleUserSelect={handleUserSelect}
            getColor={getStatusColor}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
