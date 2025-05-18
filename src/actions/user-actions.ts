"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = "http://localhost:8080/api/users";

export async function createUser(initialValue: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(API_URL, options);

  if (!response.ok) {
    const json = await response.json();
    const errors = json.errors;

    return {
      values: {
        email: formData.get("email"),
        password: formData.get("password"),
      },
      errors: {
        email: errors.find((e: any) => e.field === "email")?.defaultMessage,
        password: errors.find((e: any) => e.field === "password")
          ?.defaultMessage,
      },
    };
  }

  redirect("/");
}

export async function login(initialValue: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch("http://localhost:/login", options);

  if (!response.ok) {
    return { error: "credenciais inválidas" };
  }

  var json = await response.json();
  var token = json.token;

  const cookieStore = await cookies();
  cookieStore.set("token", token);

  redirect("/dashboard");
}
