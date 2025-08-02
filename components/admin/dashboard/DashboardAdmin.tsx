"use client";

import { Stat } from "@/types/admin/Stat";
import RecentActivityAdmin from "./RecentActivityAdmin";
import StatAdmin from "./StatAdmin";

interface HeaderAdminProps {
  stats: Stat[];
}
const DashboardAdmin = ({ stats }: HeaderAdminProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Grid */}
        {stats.map((stat, index) => (
          <StatAdmin key={index} stat={stat} />
        ))}
      </div>
      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-xl font-bold text-gray-800">
              Ingresos Mensuales
            </h3>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-br from-[#F9A825]/10 to-[#FF8F00]/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600">Gráfico de ingresos aquí</p>
              <p className="text-sm text-gray-500">
                Integrar con Chart.js o similar
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
            Acciones Rápidas
          </h3>
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300">
              + Nuevo Cliente
            </button>
            <button className="w-full border-2 border-[#F9A825] text-[#F9A825] font-semibold py-3 px-4 rounded-lg hover:bg-[#F9A825] hover:text-white transition-all duration-300">
              + Nuevo Proyecto
            </button>
            <button className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300">
              📧 Enviar Reporte
            </button>
            <button className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300">
              💰 Generar Factura
            </button>
          </div>
        </div>
      </div>
      {/* Recent Activity Section */}
      <RecentActivityAdmin />
    </div>
  );
};

export default DashboardAdmin;
