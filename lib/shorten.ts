import { customAlphabet } from "nanoid";

// Unambiguous alphabet: no 0/O, 1/l/I confusion.
const alphabet = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
const generate = customAlphabet(alphabet, 6);

export function generateCode(): string {
  return generate();
}

const RESERVED = new Set(["api", "stats", "favicon.ico", "robots.txt"]);

export function isReservedCode(code: string): boolean {
  return RESERVED.has(code.toLowerCase());
}

export function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
