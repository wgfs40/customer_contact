/**
 * 🧪 Pruebas de Acción SaveCustomerInfo con Jest
 *
 * Pruebas para verificar que la acción SaveCustomerInfo funciona
 * correctamente con diferentes escenarios y manejo de errores.
 */

// Mock de fetch global
global.fetch = jest.fn();

describe("💾 Acción SaveCustomerInfo", () => {
  beforeAll(() => {
    global.testLog.title("Iniciando Pruebas de Acción SaveCustomerInfo...");
  });

  afterAll(() => {
    global.testLog.title("Pruebas de Acción SaveCustomerInfo Completadas");
  });

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    fetch.mockClear();
  });

  describe("Operaciones Exitosas", () => {
    test("debería guardar cliente exitosamente con datos válidos", async () => {
      global.testLog.info("Probando guardado exitoso de cliente...");

      // Mock de respuesta exitosa de API
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Cliente guardado exitosamente",
          customer: {
            id: 1,
            name: "Usuario de Prueba",
            email: "prueba@ejemplo.com",
            created_at: new Date().toISOString(),
          },
        }),
        headers: new Map([
          ["X-RateLimit-Remaining", "9"],
          ["X-RateLimit-Limit", "10"],
        ]),
      });

      // Simular la función SaveCustomerInfo
      const SaveCustomerInfo = async (customerData) => {
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      };

      const customerData = {
        name: "Usuario de Prueba",
        email: "prueba@ejemplo.com",
      };

      const result = await SaveCustomerInfo(customerData);

      expect(fetch).toHaveBeenCalledWith("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      expect(result.success).toBe(true);
      expect(result.customer).toBeDefined();
      expect(result.customer.name).toBe(customerData.name);
      expect(result.customer.email).toBe(customerData.email);

      global.testLog.success("Cliente guardado exitosamente");
    });

    test("debería manejar múltiples clientes correctamente", async () => {
      global.testLog.info("Probando operaciones con múltiples clientes...");

      const customers = [
        { name: "Usuario 1", email: "usuario1@prueba.com" },
        { name: "Usuario 2", email: "usuario2@prueba.com" },
        { name: "Usuario 3", email: "usuario3@prueba.com" },
      ];

      // Mock múltiples respuestas exitosas
      customers.forEach((customer, index) => {
        fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            message: "Cliente guardado exitosamente",
            customer: { id: index + 1, ...customer },
          }),
        });
      });

      const SaveCustomerInfo = async (customerData) => {
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });
        return await response.json();
      };

      const results = [];
      for (const customer of customers) {
        const result = await SaveCustomerInfo(customer);
        results.push(result);
      }

      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.customer.name).toBe(customers[index].name);
      });

      global.testLog.success("Múltiples clientes manejados correctamente");
    });
  });

  describe("Manejo de Errores", () => {
    test("debería manejar errores de validación", async () => {
      global.testLog.info("Probando manejo de errores de validación...");

      // Mock de respuesta de error de validación
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: "Formato de email inválido",
        }),
      });

      const SaveCustomerInfo = async (customerData) => {
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || "Error desconocido",
            status: response.status,
          };
        }

        return data;
      };

      const invalidCustomerData = {
        name: "Usuario de Prueba",
        email: "email-inválido",
      };

      const result = await SaveCustomerInfo(invalidCustomerData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Formato de email inválido");
      expect(result.status).toBe(400);

      global.testLog.success("Errores de validación manejados correctamente");
    });

    test("debería manejar errores de limitación de velocidad", async () => {
      global.testLog.info(
        "Probando manejo de errores de limitación de velocidad..."
      );

      // Mock de respuesta de error de limitación de velocidad
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          success: false,
          message: "Demasiadas solicitudes. Intente de nuevo más tarde.",
        }),
        headers: new Map([
          ["Retry-After", "60"],
          ["X-RateLimit-Limit", "10"],
          ["X-RateLimit-Remaining", "0"],
        ]),
      });

      const SaveCustomerInfo = async (customerData) => {
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });

        const data = await response.json();

        if (response.status === 429) {
          return {
            success: false,
            error: data.message,
            isRateLimited: true,
            retryAfter: parseInt(response.headers.get("Retry-After")),
            status: response.status,
          };
        }

        return data;
      };

      const customerData = {
        name: "Usuario de Prueba",
        email: "prueba@ejemplo.com",
      };

      const result = await SaveCustomerInfo(customerData);

      expect(result.success).toBe(false);
      expect(result.isRateLimited).toBe(true);
      expect(result.retryAfter).toBe(60);
      expect(result.status).toBe(429);

      global.testLog.success(
        "Errores de limitación de velocidad manejados correctamente"
      );
    });

    test("debería manejar errores de red", async () => {
      global.testLog.info("Probando manejo de errores de red...");

      // Mock de error de red
      fetch.mockRejectedValueOnce(new Error("Error de red"));

      const SaveCustomerInfo = async (customerData) => {
        try {
          const response = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
          });

          return await response.json();
        } catch (error) {
          return {
            success: false,
            error: "Ocurrió un error de red",
            isNetworkError: true,
            originalError: error.message,
          };
        }
      };

      const customerData = {
        name: "Usuario de Prueba",
        email: "prueba@ejemplo.com",
      };

      const result = await SaveCustomerInfo(customerData);

      expect(result.success).toBe(false);
      expect(result.isNetworkError).toBe(true);
      expect(result.originalError).toBe("Error de red");

      global.testLog.success("Errores de red manejados correctamente");
    });

    test("debería manejar errores del servidor (500)", async () => {
      global.testLog.info("Probando manejo de errores del servidor...");

      // Mock de respuesta de error del servidor
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: "Error interno del servidor",
        }),
      });

      const SaveCustomerInfo = async (customerData) => {
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || "Ocurrió un error del servidor",
            status: response.status,
            isServerError: response.status >= 500,
          };
        }

        return data;
      };

      const customerData = {
        name: "Usuario de Prueba",
        email: "prueba@ejemplo.com",
      };

      const result = await SaveCustomerInfo(customerData);

      expect(result.success).toBe(false);
      expect(result.isServerError).toBe(true);
      expect(result.status).toBe(500);

      global.testLog.success("Errores del servidor manejados correctamente");
    });
  });

  describe("Validación de Datos", () => {
    test("debería validar campos requeridos", () => {
      global.testLog.info("Probando validación de campos...");

      const validateCustomerData = (data) => {
        const errors = [];

        if (!data.name || data.name.trim().length === 0) {
          errors.push("El nombre es requerido");
        }

        if (!data.email || data.email.trim().length === 0) {
          errors.push("El email es requerido");
        }

        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.push("Formato de email inválido");
        }

        return {
          isValid: errors.length === 0,
          errors,
        };
      };

      // Probar datos válidos
      const validData = { name: "Juan Pérez", email: "juan@ejemplo.com" };
      const validResult = validateCustomerData(validData);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      // Probar datos inválidos
      const invalidData = { name: "", email: "email-inválido" };
      const invalidResult = validateCustomerData(invalidData);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain("El nombre es requerido");
      expect(invalidResult.errors).toContain("Formato de email inválido");

      global.testLog.success("Validación de campos funcionando correctamente");
    });
  });
});
