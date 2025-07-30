/**
 * 🧪 Jest Setup File
 *
 * Este archivo se ejecuta antes de cada suite de pruebas
 * y configura el entorno de testing global.
 */

// Configurar timeouts globales
jest.setTimeout(30000);

// Configurar variables de entorno para testing
process.env.NODE_ENV = "test";
process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "test-url";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "test-key";

// Mocks globales
global.fetch = jest.fn();

// Console utilities para tests
global.testLog = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  title: (msg) => console.log(`🧪 ${msg}`),
};

// Configuración de test data
global.testConfig = {
  server: {
    baseUrl: "http://localhost:3001",
    timeout: 10000,
  },
  rateLimiting: {
    maxRequests: 10,
    windowMs: 60000,
    testRequests: 12,
  },
  testData: {
    customers: [
      {
        name: "Test User Jest 1",
        email: "jest-test1@example.com",
      },
      {
        name: "Test User Jest 2",
        email: "jest-test2@example.com",
      },
    ],
  },
};

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

// Hook para debugging en caso de fallos
afterAll(() => {
  if (process.env.DEBUG_TESTS) {
    console.log("🏁 Jest testing session completed");
  }
});
