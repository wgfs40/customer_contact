#!/usr/bin/env node

/**
 * 🧪 Jest Test Runner - Ejecutor de todas las pruebas del proyecto con Jest
 *
 * Este script ejecuta todas las pruebas Jest disponibles en el proyecto
 * de manera organizada y con reportes claros.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuración de colores para console
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg) =>
    console.log(`${colors.bright}${colors.magenta}🧪 ${msg}${colors.reset}`),
  subtitle: (msg) =>
    console.log(`${colors.bright}${colors.blue}📋 ${msg}${colors.reset}`),
};

// Función para verificar si el servidor está ejecutándose
async function checkServer() {
  try {
    const { default: fetch } = await import("node-fetch");
    const response = await fetch("http://localhost:3001/api/customers", {
      method: "GET",
      timeout: 5000,
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Función para ejecutar Jest con configuración específica
function runJestTests(testPattern = "", watchMode = false) {
  try {
    const jestCommand = [
      "npx jest",
      testPattern,
      watchMode ? "--watch" : "",
      "--verbose",
      "--no-cache",
      "--detectOpenHandles",
      "--forceExit",
    ]
      .filter(Boolean)
      .join(" ");

    log.info(`Ejecutando: ${jestCommand}`);
    console.log("─".repeat(50));

    execSync(jestCommand, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    return { status: "PASS", error: null };
  } catch (error) {
    return { status: "FAIL", error: error.message };
  }
}

// Función principal
async function runAllTests() {
  log.title("INICIANDO SUITE DE PRUEBAS CON JEST");
  console.log("");

  // Verificar que Jest esté instalado
  try {
    execSync("npx jest --version", { stdio: "pipe" });
    log.success("Jest detectado e instalado correctamente");
  } catch (error) {
    log.error("Jest no está instalado. Ejecuta: npm install --save-dev jest");
    process.exit(1);
  }

  // Verificar que el servidor esté ejecutándose
  log.subtitle("Verificando precondiciones...");

  const serverRunning = await checkServer();
  if (!serverRunning) {
    log.warning("Servidor no detectado en localhost:3001");
    log.info("Asegúrate de ejecutar: npm run dev");
    log.info("Continuando con las pruebas que no requieren servidor...");
  } else {
    log.success("Servidor detectado en localhost:3001");
  }

  console.log("");

  // Configuración de suites de pruebas
  const testSuites = [
    {
      name: "Pruebas de Componentes",
      pattern: "tests/components/",
      requiresServer: false,
      description: "Tests de componentes React y lógica de UI",
    },
    {
      name: "Pruebas de API",
      pattern: "tests/api/",
      requiresServer: true,
      description: "Tests de endpoints y validación de API",
    },
    {
      name: "Pruebas de Seguridad",
      pattern: "tests/security/",
      requiresServer: true,
      description: "Tests de rate limiting y medidas de seguridad",
    },
  ];

  const results = [];

  // Ejecutar cada suite de pruebas
  for (const suite of testSuites) {
    log.subtitle(`${suite.name}: ${suite.description}`);
    console.log("");

    if (suite.requiresServer && !serverRunning) {
      log.warning(`Saltando ${suite.name} (requiere servidor)`);
      results.push({
        name: suite.name,
        status: "SKIP",
        error: "Servidor no disponible",
      });
      console.log("");
      continue;
    }

    const result = runJestTests(suite.pattern);
    results.push({
      name: suite.name,
      status: result.status,
      error: result.error,
    });

    console.log("");
  }

  // Opción para ejecutar todas las pruebas juntas
  if (serverRunning) {
    log.subtitle("Ejecutando TODAS las pruebas juntas...");
    console.log("");

    const allTestsResult = runJestTests("tests/");
    results.push({
      name: "Suite Completa",
      status: allTestsResult.status,
      error: allTestsResult.error,
    });
  }

  // Mostrar resumen
  log.title("RESUMEN DE PRUEBAS JEST");
  console.log("");

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const skipped = results.filter((r) => r.status === "SKIP").length;

  results.forEach((result) => {
    switch (result.status) {
      case "PASS":
        log.success(`${result.name}`);
        break;
      case "FAIL":
        log.error(`${result.name}: ${result.error}`);
        break;
      case "SKIP":
        log.warning(`${result.name}: ${result.error}`);
        break;
    }
  });

  console.log("");
  console.log("─".repeat(50));
  log.info(
    `Total: ${results.length} | Exitosas: ${passed} | Fallidas: ${failed} | Saltadas: ${skipped}`
  );

  // Mostrar información adicional
  console.log("");
  log.subtitle("Comandos Jest disponibles:");
  log.info("npm test                    - Ejecutar todas las pruebas");
  log.info("npm run test:watch          - Ejecutar en modo watch");
  log.info("npm run test:coverage       - Ejecutar con coverage");
  log.info("npm run test:security       - Solo pruebas de seguridad");
  log.info("npm run test:api            - Solo pruebas de API");
  log.info("npm run test:components     - Solo pruebas de componentes");

  if (failed > 0) {
    log.error("Algunas pruebas fallaron. Revisar logs arriba.");
    process.exit(1);
  } else {
    log.success("Todas las pruebas pasaron exitosamente!");
    process.exit(0);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAllTests().catch((error) => {
    log.error(`Error ejecutando pruebas: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runAllTests };
