import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => {
  if (value === undefined || value === null || value === "undefined") {
    console.warn("⚠️ Skipping parseStringify due to invalid value:", value);
    return null;
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch (e) {
    console.error("❌ parseStringify error:", e, value);
    return null;
  }
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// ✅ FIXED FORMAT DATE TIME FUNCTION
export const formatDateTime = (
  dateString: Date | string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn("⚠️ Invalid date passed to formatDateTime:", dateString);
    return {
      dateTime: "Invalid Date",
      dateDay: "Invalid",
      dateOnly: "Invalid",
      timeOnly: "Invalid",
    };
  }

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone,
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    timeZone,
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone,
  };

  return {
    dateTime: date.toLocaleString("en-US", dateTimeOptions),
    dateDay: date.toLocaleString("en-US", dateDayOptions),
    dateOnly: date.toLocaleString("en-US", dateOptions),
    timeOnly: date.toLocaleString("en-US", timeOptions),
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
