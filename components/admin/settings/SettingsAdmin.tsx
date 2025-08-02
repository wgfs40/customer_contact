"use client";
const SettingsAdmin = () => {
  return (
    <div>
      <div>
        <h2 className="font-heading text-2xl font-bold text-gray-800 mb-2">
          Configuración del Sistema
        </h2>
        <p className="text-gray-600">
          Ajustes generales y configuración de la aplicación
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
            Configuración General
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                defaultValue="Dosis de Marketing"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contacto
              </label>
              <input
                type="email"
                defaultValue="contacto@dosisdemarketing.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                defaultValue="+34 123 456 789"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">
            Configuración de Seguridad
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">
                  Autenticación de Dos Factores
                </h4>
                <p className="text-sm text-gray-600">
                  Protege tu cuenta con 2FA
                </p>
              </div>
              <button className="bg-[#F9A825] text-white px-4 py-2 rounded-lg hover:bg-[#FF8F00] transition-colors">
                Activar
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Backup Automático</h4>
                <p className="text-sm text-gray-600">
                  Respaldo diario de datos
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F9A825]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F9A825]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-[#F9A825] to-[#FF8F00] text-white font-semibold px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default SettingsAdmin;
