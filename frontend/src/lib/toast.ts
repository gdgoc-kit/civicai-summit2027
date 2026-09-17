const STORAGE_KEY = "toast-message";

export function queueToast(message: string) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, message);
  }
}

export function consumeQueuedToast(): string | null {
  if (typeof window === "undefined") return null;
  const message = window.sessionStorage.getItem(STORAGE_KEY);
  if (message) {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }
  return message;
}
