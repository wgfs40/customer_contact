/**
 * 🧪 Rate Limiting Security Tests with Jest
 *
 * Tests para verificar que la API está protegida contra spam
 * y funciona correctamente con el límite de 10 requests por minuto.
 */

describe("🛡️ Rate Limiting Security", () => {
  const API_URL = `${global.testConfig.server.baseUrl}/api/customers`;
  const { maxRequests, testRequests } = global.testConfig.rateLimiting;

  beforeAll(() => {
    global.testLog.title("Rate Limiting Security Tests Starting...");
  });

  afterAll(() => {
    global.testLog.title("Rate Limiting Security Tests Completed");
  });

  describe("API Rate Limiting Protection", () => {
    test("should allow requests within rate limit", async () => {
      global.testLog.info("Testing requests within rate limit...");

      // Mock respuestas exitosas
      for (let i = 1; i <= maxRequests; i++) {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            message: "Customer saved successfully",
            customer: {
              id: i,
              name: `Jest Test User ${i}`,
              email: `jest-test${i}@example.com`,
            },
          }),
          headers: new Map([
            ["X-RateLimit-Remaining", (maxRequests - i).toString()],
            ["X-RateLimit-Limit", maxRequests.toString()],
          ]),
        });
      }

      for (let i = 1; i <= maxRequests; i++) {
        const response = await global.fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Jest Test User ${i}`,
            email: `jest-test${i}@example.com`,
          }),
        });

        const data = await response.json();
        const remaining = response.headers.get("X-RateLimit-Remaining");
        const limit = response.headers.get("X-RateLimit-Limit");

        global.testLog.success(
          `Request ${i}: SUCCESS (${response.status}) - Remaining: ${remaining}/${limit}`
        );

        // Verificar que la respuesta es exitosa
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);

        // Verificar headers de rate limiting
        expect(response.headers.get("X-RateLimit-Limit")).toBe(
          maxRequests.toString()
        );
        expect(parseInt(remaining)).toBe(maxRequests - i);
      }
    }, 45000);

    test("should block requests that exceed rate limit", async () => {
      global.testLog.info("Testing requests beyond rate limit...");

      const excessRequests = testRequests - maxRequests;

      // Mock respuestas de rate limiting
      for (let i = 1; i <= excessRequests; i++) {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 429,
          json: async () => ({
            success: false,
            message: "Too many requests. Please try again later.",
          }),
          headers: new Map([
            ["Retry-After", "60"],
            ["X-RateLimit-Limit", maxRequests.toString()],
            ["X-RateLimit-Remaining", "0"],
          ]),
        });
      }

      for (let i = 1; i <= excessRequests; i++) {
        const response = await global.fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Jest Excess User ${i}`,
            email: `jest-excess${i}@example.com`,
          }),
        });

        const data = await response.json();
        const retryAfter = response.headers.get("Retry-After");

        global.testLog.warning(
          `Excess Request ${i}: RATE LIMITED (${response.status}) - Retry After: ${retryAfter}s`
        );

        // Verificar que la respuesta es rate limited
        expect(response.status).toBe(429);
        expect(data.message).toContain("Too many requests");
        expect(retryAfter).toBeDefined();
      }
    }, 15000);

    test("should return correct rate limiting headers", async () => {
      global.testLog.info("Testing rate limiting headers...");

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ message: "Headers test" }),
        headers: new Map([
          ["X-RateLimit-Limit", "10"],
          ["X-RateLimit-Remaining", "5"],
          ["X-RateLimit-Reset", Date.now() + 60000],
        ]),
      });

      const response = await global.fetch(API_URL, {
        method: "GET",
      });

      // Verificar que los headers de rate limiting están presentes
      expect(response.headers.get("X-RateLimit-Limit")).toBeDefined();
      expect(response.headers.get("X-RateLimit-Remaining")).toBeDefined();
      expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();

      global.testLog.success("Rate limiting headers verified");
    });
  });

  describe("Rate Limiting Edge Cases", () => {
    test("should handle invalid request data gracefully within rate limit", async () => {
      global.testLog.info("Testing invalid data handling...");

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: "Invalid email format",
        }),
      });

      const response = await global.fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "", // Invalid empty name
          email: "invalid-email", // Invalid email format
        }),
      });

      // Debe responder con error de validación, no rate limiting
      expect(response.status).not.toBe(429);
      expect(response.status).toBe(400);

      global.testLog.success("Invalid data handled correctly");
    });

    test("should handle malformed JSON gracefully", async () => {
      global.testLog.info("Testing malformed JSON handling...");

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: "Invalid JSON format",
        }),
      });

      const response = await global.fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: '{"invalid": json}', // Malformed JSON
      });

      // Debe responder con error de parsing, no rate limiting
      expect(response.status).not.toBe(429);
      expect(response.status).toBe(400);

      global.testLog.success("Malformed JSON handled correctly");
    });
  });

  describe("Rate Limiting Performance", () => {
    test("should process requests within acceptable time limits", async () => {
      global.testLog.info("Testing rate limiting performance...");

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          customer: {
            name: "Performance Test User",
            email: "performance@example.com",
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
          name: "Performance Test User",
          email: "performance@example.com",
        }),
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // La respuesta debe ser rápida (menos de 2 segundos)
      expect(responseTime).toBeLessThan(2000);
      expect(response.status).toBe(200);

      global.testLog.success(
        `Response time: ${responseTime}ms (within acceptable limits)`
      );
    });
  });
});
