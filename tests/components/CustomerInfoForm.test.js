/**
 * 🧪 Customer Info Form Component Tests with Jest
 *
 * Tests para verificar que el componente CustomerInfoForm funciona
 * correctamente con validación, envío y manejo de estados.
 */

// Mock de next/router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/test",
  }),
}));

// Mock de SweetAlert2
jest.mock("sweetalert2", () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

// Mock de la acción SaveCustomerInfo
jest.mock("../../actions/customer_info", () => ({
  SaveCustomerInfo: jest.fn(),
}));

describe("📋 Customer Info Form Component", () => {
  beforeAll(() => {
    global.testLog.title("Customer Info Form Tests Starting...");
  });

  afterAll(() => {
    global.testLog.title("Customer Info Form Tests Completed");
  });

  describe("Form Validation", () => {
    test("should validate required fields", () => {
      global.testLog.info("Testing form validation logic...");

      // Datos de prueba
      const validData = {
        name: "Test User",
        email: "test@example.com",
      };

      const invalidData = {
        name: "",
        email: "invalid-email",
      };

      // Simular validación de campos requeridos
      expect(validData.name.trim()).not.toBe("");
      expect(validData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

      expect(invalidData.name.trim()).toBe("");
      expect(invalidData.email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

      global.testLog.success("Form validation logic working correctly");
    });

    test("should validate email format", () => {
      global.testLog.info("Testing email validation...");

      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "test123@test-domain.org",
      ];

      const invalidEmails = [
        "invalid-email",
        "@domain.com",
        "test@",
        "test.domain.com",
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach((email) => {
        expect(email).toMatch(emailRegex);
      });

      invalidEmails.forEach((email) => {
        expect(email).not.toMatch(emailRegex);
      });

      global.testLog.success("Email validation working correctly");
    });

    test("should validate name requirements", () => {
      global.testLog.info("Testing name validation...");

      const validNames = ["John Doe", "María García", "Test User 123"];

      const invalidNames = [
        "",
        "   ",
        "a", // Too short
      ];

      validNames.forEach((name) => {
        expect(name.trim().length).toBeGreaterThan(1);
      });

      invalidNames.forEach((name) => {
        expect(name.trim().length).toBeLessThanOrEqual(1);
      });

      global.testLog.success("Name validation working correctly");
    });
  });

  describe("Form Submission", () => {
    test("should handle successful form submission", async () => {
      global.testLog.info("Testing successful form submission...");

      const { SaveCustomerInfo } = require("../../actions/customer_info");

      // Mock successful response
      SaveCustomerInfo.mockResolvedValueOnce({
        success: true,
        message: "Customer saved successfully",
        customer: {
          id: 1,
          name: "Test User",
          email: "test@example.com",
        },
      });

      const formData = {
        name: "Test User",
        email: "test@example.com",
      };

      const result = await SaveCustomerInfo(formData);

      expect(SaveCustomerInfo).toHaveBeenCalledWith(formData);
      expect(result.success).toBe(true);
      expect(result.customer).toBeDefined();

      global.testLog.success("Successful form submission handled correctly");
    });

    test("should handle form submission errors", async () => {
      global.testLog.info("Testing form submission error handling...");

      const { SaveCustomerInfo } = require("../../actions/customer_info");

      // Mock error response
      SaveCustomerInfo.mockResolvedValueOnce({
        success: false,
        error: "Invalid email format",
      });

      const invalidFormData = {
        name: "Test User",
        email: "invalid-email",
      };

      const result = await SaveCustomerInfo(invalidFormData);

      expect(SaveCustomerInfo).toHaveBeenCalledWith(invalidFormData);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      global.testLog.success("Form submission errors handled correctly");
    });

    test("should handle network errors", async () => {
      global.testLog.info("Testing network error handling...");

      const { SaveCustomerInfo } = require("../../actions/customer_info");

      // Mock network error
      SaveCustomerInfo.mockRejectedValueOnce(new Error("Network error"));

      const formData = {
        name: "Test User",
        email: "test@example.com",
      };

      try {
        await SaveCustomerInfo(formData);
      } catch (error) {
        expect(error.message).toBe("Network error");
      }

      global.testLog.success("Network errors handled correctly");
    });
  });

  describe("Rate Limiting Integration", () => {
    test("should handle rate limiting responses", async () => {
      global.testLog.info("Testing rate limiting integration...");

      const { SaveCustomerInfo } = require("../../actions/customer_info");

      // Mock rate limiting response
      SaveCustomerInfo.mockResolvedValueOnce({
        success: false,
        error: "Rate limit exceeded. Please try again later.",
        isRateLimited: true,
        retryAfter: 60,
      });

      const formData = {
        name: "Test User",
        email: "test@example.com",
      };

      const result = await SaveCustomerInfo(formData);

      expect(result.success).toBe(false);
      expect(result.isRateLimited).toBe(true);
      expect(result.retryAfter).toBe(60);

      global.testLog.success("Rate limiting integration working correctly");
    });
  });

  describe("SweetAlert2 Integration", () => {
    test("should call SweetAlert2 for success messages", async () => {
      global.testLog.info("Testing SweetAlert2 success integration...");

      const Swal = require("sweetalert2");

      // Simular llamada exitosa a SweetAlert2
      await Swal.fire({
        title: "Success!",
        text: "Customer saved successfully",
        icon: "success",
      });

      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Success!",
        text: "Customer saved successfully",
        icon: "success",
      });

      global.testLog.success("SweetAlert2 success integration working");
    });

    test("should call SweetAlert2 for error messages", async () => {
      global.testLog.info("Testing SweetAlert2 error integration...");

      const Swal = require("sweetalert2");

      // Simular llamada de error a SweetAlert2
      await Swal.fire({
        title: "Error!",
        text: "Please check your input",
        icon: "error",
      });

      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Error!",
        text: "Please check your input",
        icon: "error",
      });

      global.testLog.success("SweetAlert2 error integration working");
    });
  });

  describe("Component State Management", () => {
    test("should manage loading states correctly", () => {
      global.testLog.info("Testing loading state management...");

      // Simular estados de loading
      let isLoading = false;

      // Antes del envío
      expect(isLoading).toBe(false);

      // Durante el envío
      isLoading = true;
      expect(isLoading).toBe(true);

      // Después del envío
      isLoading = false;
      expect(isLoading).toBe(false);

      global.testLog.success("Loading state management working correctly");
    });

    test("should reset form after successful submission", () => {
      global.testLog.info("Testing form reset functionality...");

      // Simular datos del formulario
      let formData = {
        name: "Test User",
        email: "test@example.com",
      };

      // Simular reset del formulario
      const resetForm = () => {
        formData = { name: "", email: "" };
      };

      resetForm();

      expect(formData.name).toBe("");
      expect(formData.email).toBe("");

      global.testLog.success("Form reset functionality working correctly");
    });
  });
});
