// Tipos para las respuestas de las acciones
interface ActionResponse<T> {
  success?: boolean;
  value?: T;
  error?: string;
  message?: string;
  status?: string;
}

// Función helper para validar y extraer datos de forma segura

export function extractActionData<T>(
  response: PromiseSettledResult<any>,
  isArray: boolean = false
): T | null {
  if (response.status !== "fulfilled") {
    console.warn("Action rejected:", response.reason);
    return null;
  }

  const rawValue = response as ActionResponse<T>;
  if (!rawValue.value) {
    console.warn("No data in response:", rawValue.value);
    return null;
  }

  if (isArray && !Array.isArray(rawValue.value)) {
    console.warn(
      "Se esperaba un arreglo pero no se obtuvo:",
      typeof rawValue.value,
      rawValue.value
    );
    return null;
  }

  return rawValue.value;
}
