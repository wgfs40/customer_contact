// Client-side functions to interact with customer API
export async function SaveCustomerInfo(customerData: {
  name: string;
  email: string;
}) {
  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save customer information");
    }

    return data;
  } catch (error) {
    console.error("Error saving customer information:", error);
    throw error;
  }
}

// Get customer information from API
export async function GetCustomerInfo() {
  try {
    const response = await fetch("/api/customers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to retrieve customer information");
    }

    return data;
  } catch (error) {
    console.error("Error retrieving customer information:", error);
    throw error;
  }
}
