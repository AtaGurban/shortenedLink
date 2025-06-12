/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export interface QueryType {
  [key: string]: string | number | Date | undefined;
}
export function uniqueArr(arr: any[]) {
  const uniqueObjectsSet = new Set<string>();
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    uniqueObjectsSet.add(JSON.stringify(obj));
  }
  return Array.from(uniqueObjectsSet, (item) => JSON.parse(item));
}

export const buildQueryParams = (params: QueryType) => {
  const queryParams = [];

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (value) {
        queryParams.push(`${key}=${encodeURIComponent(value.toString())}`);
      }
    }
  }

  return queryParams.join("&");
};

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function errorHandler(error: unknown) {
  console.log(error);
  if (error instanceof Error) {
    return { success: false, message: error.message, data: null };
  } else {
    return { success: false, message: "Something went wrong", data: null };
  }
}

export const handlerAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error?.response?.data.message;
  } else {
    return "Произошла непредвиденная ошибка";
  }
};

export async function sleep(timeout: number) {
  return await new Promise((res) => setTimeout(res, timeout));
}

export function copyToClipboardFallback(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand("copy");
  document.body.removeChild(textarea);
  return success;
}

export function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch (e) {
    console.log(e);
    return false;
  }
}
