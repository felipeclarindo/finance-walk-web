"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = "http://localhost:8080/api/categories";

export async function getCategories() {
  const response = await fetch(API_URL);
  return await response.json();
}

export async function createCategory(initialValue: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    icon: formData.get("icon"),
  };

  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(API_URL, options);

  if (!response.ok) {
    const json = await response.json();
    const errors = json.errors;

    interface CategoryFormValues {
      name: FormDataEntryValue | null;
      icon: FormDataEntryValue | null;
    }

    interface CategoryError {
      field: string;
      defaultMessage: string;
    }

    interface CategoryFormErrors {
      name?: string;
      icon?: string;
    }

    interface CategoryFormResult {
      values: CategoryFormValues;
      errors: CategoryFormErrors;
    }

    const values: CategoryFormValues = {
      name: formData.get("name"),
      icon: formData.get("icon"),
    };

    const errorsList: CategoryError[] = errors;

    const result: CategoryFormResult = {
      values,
      errors: {
        name: errorsList.find((e) => e.field === "name")?.defaultMessage,
        icon: errorsList.find((e) => e.field === "icon")?.defaultMessage,
      },
    };

    return result;
  }

  redirect("/categories");
}
