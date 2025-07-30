/**
 * Mock para node-fetch
 *
 * Este mock permite que Jest funcione correctamente con node-fetch
 * sin problemas de ES modules.
 */

// Mock básico de fetch que retorna respuestas simuladas
const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        success: true,
        message: "Mock response",
        customer: {
          id: 1,
          name: "Mock User",
          email: "mock@example.com",
        },
      }),
    headers: new Map([
      ["X-RateLimit-Remaining", "9"],
      ["X-RateLimit-Limit", "10"],
      ["X-RateLimit-Reset", Date.now() + 60000],
      ["Content-Type", "application/json"],
      ["Access-Control-Allow-Origin", "*"],
    ]),
  })
);

// Headers mock que simula el API de headers del fetch real
mockFetch.Headers = Map;

module.exports = mockFetch;
module.exports.default = mockFetch;
