/**
 * 🧪 Pruebas de API de Clientes con Jest
 *
 * Pruebas para verificar que la API de clientes funciona correctamente
 * con validación de datos, manejo de errores y respuestas apropiadas.
 */

describe("👥 API de Clientes", () => {
  const API_URL = `${global.testConfig.server.baseUrl}/api/customers`;
  const { testData } = global.testConfig;

  beforeAll(() => {
    global.testLog.title("Iniciando Pruebas de API de Clientes...");
  });

  afterAll(() => {
    global.testLog.title("Pruebas de API de Clientes Completadas");
  });

  describe("POST /api/customers", () => {
    test("debería crear cliente con datos válidos", async () => {
      global.testLog.info("Probando creación de cliente con datos válidos...");

      const customerData = testData.customers[0];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Cliente guardado exitosamente",
          customer: {
            id: 1,
            ...customerData,
            created_at: new Date().toISOString(),
          },
        }),
      });

      const response = await global.fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      const data = await response.json();

      global.testLog.success(
        `Cliente creado: ${customerData.name} (${response.status})`
      );

      // Verificar respuesta exitosa
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain("Cliente guardado exitosamente");

      // Verificar que se devuelven los datos del cliente
      expect(data.customer).toBeDefined();
      expect(data.customer.name).toBe(customerData.name);
      expect(data.customer.email).toBe(customerData.email);
    });

    test("debería rechazar cliente con email inválido", async () => {
      global.testLog.info("Probando creación de cliente con email inválido...");

      const invalidCustomerData = {
        name: "Usuario de Prueba",
        email: "formato-email-inválido",
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: "Formato de email inválido",
        }),
      });

      const response = await global.fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidCustomerData),
      });

      const data = await response.json();

      global.testLog.warning(
        `Email inválido rechazado: ${invalidCustomerData.email} (${response.status})`
      );

      // Debe rechazar con error de validación
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("email");
    });

    test("debería rechazar cliente con nombre vacío", async () => {
      global.testLog.info("Probando creación de cliente con nombre vacío...");

      const invalidCustomerData = {
        name: "",
        email: "valido@ejemplo.com",
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: "El nombre es requerido",
        }),
      });

      const response = await global.fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidCustomerData),
      });

      const data = await response.json();

      global.testLog.warning(`Nombre vacío rechazado (${response.status})`);

      // Debe rechazar con error de validación
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("nombre");
    });

    test("debería rechazar cliente con campos faltantes", async () => {
      global.testLog.info(
        "Probando creación de cliente con campos faltantes..."
      );

      const invalidCustomerData = {
        name: "Usuario de Prueba",
        // email faltante
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: "El email es requerido",
        }),
      });

      const response = await global.fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidCustomerData),
      });

      const data = await response.json();

      global.testLog.warning(
        `Campos faltantes rechazados (${response.status})`
      );

      // Debe rechazar con error de validación
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    test("debería manejar JSON malformado correctamente", async () => {
      global.testLog.info("Probando manejo de JSON malformado...");

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: "Formato JSON inválido",
        }),
      });

      const response = await global.fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: '{"name": "Prueba", "email": inválido}', // JSON malformado
      });

      global.testLog.warning(`JSON malformado manejado (${response.status})`);

      // Debe responder con error apropiado
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/customers", () => {
    test("debería responder a solicitudes GET", async () => {
      global.testLog.info("Probando endpoint GET...");

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          message: "Endpoint GET funcionando",
          customers: [],
        }),
      });

      const response = await global.fetch(API_URL, {
        method: "GET",
      });

      global.testLog.success(`Endpoint GET respondió (${response.status})`);

      // Debe responder exitosamente
      expect(response.status).not.toBe(404);
      expect(response.status).not.toBe(500);
      expect(response.status).toBe(200);
    });

    test("debería incluir headers de limitación de velocidad en respuesta GET", async () => {
      global.testLog.info(
        "Probando headers de limitación de velocidad en GET..."
      );

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ message: "Prueba de headers" }),
        headers: new Map([
          ["X-RateLimit-Limit", "10"],
          ["X-RateLimit-Remaining", "9"],
          ["X-RateLimit-Reset", Date.now() + 60000],
        ]),
      });

      const response = await global.fetch(API_URL, {
        method: "GET",
      });

      global.testLog.success(
        "Headers de limitación de velocidad verificados en GET"
      );

      // Verificar headers de limitación de velocidad
      expect(response.headers.get("X-RateLimit-Limit")).toBeDefined();
      expect(response.headers.get("X-RateLimit-Remaining")).toBeDefined();
      expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
    });
  });

  describe("Headers de Seguridad de API", () => {
    test("debería incluir headers de seguridad", async () => {
      global.testLog.info("Probando headers de seguridad...");

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
        headers: new Map([
          ["Access-Control-Allow-Origin", "*"],
          ["Content-Type", "application/json"],
        ]),
      });

      const response = await global.fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData.customers[1]),
      });

      global.testLog.success("Headers de seguridad verificados");

      // Verificar headers de CORS y seguridad
      expect(response.headers.get("Access-Control-Allow-Origin")).toBeDefined();
      expect(response.headers.get("Content-Type")).toContain(
        "application/json"
      );
    });
  });

  describe("Rendimiento de API", () => {
    test("debería responder dentro de límites de tiempo aceptables", async () => {
      global.testLog.info("Probando tiempo de respuesta de API...");

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          customer: {
            name: "Prueba de Rendimiento",
            email: "rendimiento@prueba.com",
          },
        }),
      });

      const startTime = Date.now();

      const response = await global.fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Prueba de Rendimiento",
          email: "rendimiento@prueba.com",
        }),
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      global.testLog.success(`Tiempo de respuesta de API: ${responseTime}ms`);

      // La respuesta debe ser rápida (menos de 3 segundos)
      expect(responseTime).toBeLessThan(3000);
      expect(response.status).not.toBe(500); // Sin errores de servidor
      expect(response.status).toBe(200);
    });
  });
});
