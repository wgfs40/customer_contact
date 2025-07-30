# 🧪 Jest Testing Infrastructure

## 📊 Resumen del Proyecto

Este proyecto implementa una infraestructura completa de testing usando **Jest** para realizar pruebas automatizadas y optimizadas del sistema de información de clientes.

## 🎯 Objetivos Completados

✅ **Migración a Jest**: Conversión completa de tests legacy a Jest moderno  
✅ **Infraestructura Mock**: Sistema robusto de mocks para node-fetch y dependencias externas  
✅ **Organización de Tests**: Estructura profesional con separación por categorías  
✅ **Optimización**: Tests rápidos, paralelos y con reportes detallados  
✅ **Cobertura**: Reportes de cobertura de código con métricas de calidad

## 📁 Estructura de Archivos

```
tests/
├── __mocks__/
│   └── node-fetch.js          # Mock para fetch ES module
├── actions/
│   └── SaveCustomerInfo.test.js    # Tests de acciones (7 tests)
├── api/
│   └── customers.test.js            # Tests de API REST (9 tests)
├── components/
│   └── CustomerInfoForm.test.js    # Tests de componentes (11 tests)
├── security/
│   └── rate-limit.test.js           # Tests de seguridad (6 tests)
├── coverage/                        # Reportes de cobertura HTML
├── setup.js                         # Configuración global de Jest
├── run-all-tests.js                 # Runner personalizado con colores
└── README.md                        # Esta documentación
```

```
tests/
├── README.md                    # Este archivo
├── setup.js                    # Configuración global de Jest
├── config.json                 # Configuración de datos de prueba
├── run-all-tests.js            # Runner personalizado con Jest
├── api/                        # Pruebas de API
│   └── customers.test.js       # Tests de la API de customers
├── components/                 # Pruebas de componentes
│   └── CustomerInfoForm.test.js # Tests del formulario
└── security/                   # Pruebas de seguridad
    ├── rate-limit.test.js      # Tests de rate limiting con Jest
    └── rate-limit-node.test.js # Test legacy de rate limiting
```

## 🚀 Cómo Ejecutar las Pruebas

### Comandos Jest Disponibles

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar en modo watch (recarga automática)
npm run test:watch

# Ejecutar con reporte de cobertura
npm run test:coverage

# Ejecutar solo pruebas específicas
npm run test:security       # Solo pruebas de seguridad
npm run test:api            # Solo pruebas de API
npm run test:components     # Solo pruebas de componentes

# Ejecutar runner personalizado
npm run test:runner

# Test legacy de rate limiting
npm run test:rate-limit
```

### Requisitos Previos

1. **Jest instalado**: `npm install --save-dev jest @types/jest`
2. **Servidor en ejecución**: `npm run dev` (usualmente en puerto 3001)
3. **Variables de entorno**: Configuradas correctamente

## 📊 Pruebas Disponibles

### 1. **🛡️ Security Tests** (`tests/security/`)

#### Rate Limiting Test (`rate-limit.test.js`)

- **Framework**: Jest con describe/test structure
- **Objetivo**: Verificar protección contra spam (10 requests/min)
- **Cobertura**:
  - ✅ Requests dentro del límite (1-10): Exitosos
  - ❌ Requests excedentes (11-12): Rate limited (429)
  - 🔍 Headers de rate limiting correctos
  - 🚀 Performance y edge cases

### 2. **👥 API Tests** (`tests/api/`)

#### Customer API Test (`customers.test.js`)

- **Framework**: Jest con mocks y assertions
- **Objetivo**: Validar funcionalidad completa de la API
- **Cobertura**:
  - ✅ Creación exitosa de customers
  - ❌ Validación de datos inválidos
  - 🔒 Headers de seguridad
  - ⚡ Performance de respuesta

### 3. **📋 Component Tests** (`tests/components/`)

#### Customer Info Form Test (`CustomerInfoForm.test.js`)

- **Framework**: Jest con mocks de Next.js y SweetAlert2
- **Objetivo**: Verificar lógica de componentes React
- **Cobertura**:
  - 📝 Validación de formularios
  - 🔄 Manejo de estados de loading
  - 🎨 Integración con SweetAlert2
  - 🛡️ Manejo de rate limiting

## 📈 Configuración Jest

### `jest.config.js`

```javascript
module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  collectCoverageFrom: [
    "app/**/*.{js,ts,tsx}",
    "actions/**/*.{js,ts,tsx}",
    "Components/**/*.{js,ts,tsx}",
  ],
  verbose: true,
  testTimeout: 30000,
};
```

### `tests/setup.js`

Archivo de configuración global que se ejecuta antes de cada test:

- Configuración de timeouts
- Variables de entorno de testing
- Mocks globales
- Utilidades de logging

## 🎯 Ejemplo de Salida

### Rate Limiting Test

```
🧪 Rate Limiting Security Tests Starting...

🛡️ Rate Limiting Security
  API Rate Limiting Protection
    ✅ should allow requests within rate limit (2.5s)
    ✅ should block requests that exceed rate limit (1.2s)
    ✅ should return correct rate limiting headers (0.8s)

  Rate Limiting Edge Cases
    ✅ should handle invalid request data gracefully (0.5s)
    ✅ should handle malformed JSON gracefully (0.4s)

Tests: 5 passed, 5 total
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **Servidor no detectado**

   ```bash
   npm run dev  # En otra terminal
   ```

2. **Timeouts en tests**

   - Aumentar `testTimeout` en jest.config.js
   - Verificar que el servidor responda correctamente

3. **Mocks no funcionan**

   - Verificar que los mocks estén en `tests/setup.js`
   - Limpiar cache: `npm test -- --no-cache`

4. **Rate limiting inconsistente**
   - Esperar 1 minuto entre ejecuciones
   - Verificar que no hay otras pruebas ejecutándose

## 📚 Mejores Prácticas

1. **Organización**: Mantener tests cerca de la funcionalidad que prueban
2. **Naming**: Usar nombres descriptivos para tests y describes
3. **Isolation**: Cada test debe ser independiente
4. **Mocking**: Mockear dependencias externas (APIs, UI components)
5. **Coverage**: Apuntar a >80% de cobertura en funciones críticas

## 🔄 Integración Continua

Los tests están configurados para ejecutarse en CI/CD:

- Verificación de servidor running
- Ejecución de todas las suites
- Reporte de cobertura
- Fallos si hay tests fallidos

❌ Request 11: RATE LIMITED
Status: 429
Message: Too many requests. Try again in 56 seconds.

````

## 🔧 Configuración de Tests

### Variables de Entorno para Tests

- `SUPABASE_KEY`: Clave de Supabase para tests
- `Project_URL`: URL del proyecto Supabase
- `NODE_ENV`: Debe estar en 'development' para tests locales

### Puertos por Defecto

- **Desarrollo**: `http://localhost:3001`
- **Producción**: Configurar según deployment

## 📝 Agregar Nuevas Pruebas

### 1. **Crear archivo de prueba**

```javascript
// tests/nueva-prueba.test.js
const testNuevaFuncionalidad = async () => {
  console.log("🧪 Testing Nueva Funcionalidad...");
  // ... código de prueba
};

testNuevaFuncionalidad().catch(console.error);
````

### 2. **Documentar en este README**

- Agregar descripción de la prueba
- Especificar cómo ejecutarla
- Documentar resultados esperados

### 3. **Seguir convenciones**

- Usar emojis para claridad visual
- Incluir logs informativos
- Manejar errores apropiadamente

## 🛡️ Tests de Seguridad

### Rate Limiting

- ✅ **Implementado**: Protección contra spam
- ✅ **Verificado**: 10 requests/minuto por IP
- ✅ **Headers**: X-RateLimit-\* headers funcionando

### Autenticación (Futuro)

- 🔄 **Pendiente**: Tests de Clerk authentication
- 🔄 **Pendiente**: Tests de protección de rutas
- 🔄 **Pendiente**: Tests de permisos

## 📈 Métricas de Tests

### Coverage Objetivo

- **API Routes**: 100%
- **Components**: 90%
- **Utils**: 95%
- **Security**: 100%

### Performance Tests

- **Rate Limiting**: ✅ Funcionando
- **Database**: 🔄 Pendiente
- **Loading Times**: 🔄 Pendiente

## 🚨 Troubleshooting

### Error: Puerto 3000 en uso

```bash
# El servidor automáticamente usa 3001
# Verificar en qué puerto está corriendo:
npm run dev
```

### Error: ECONNREFUSED

- Verificar que el servidor esté ejecutándose
- Comprobar que el puerto sea correcto
- Verificar variables de entorno

### Error: Rate limit no funciona

- Verificar que no hay cache de requests previos
- Esperar 1 minuto para reset de rate limiting
- Comprobar logs del servidor

## 📚 Recursos Adicionales

- [Next.js Testing](https://nextjs.org/docs/testing)
- [API Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Supabase Testing Guide](https://supabase.com/docs/guides/getting-started/testing)
