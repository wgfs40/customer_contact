"use client";
const HeaderAdmin = () => {
  return (
    // Header
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F9A825] to-[#FF8F00] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-gray-800">
                Panel de Administración
              </h1>
              <p className="text-gray-500 font-medium">Dosis de Marketing</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-[#F9A825] transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5-5-5h5v-12"
                />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
              <div className="w-8 h-8 bg-[#F9A825] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">M</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Marisol Muñoz</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
