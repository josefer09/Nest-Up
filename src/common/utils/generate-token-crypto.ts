import { randomBytes } from "crypto";

export function generateAlphaNumericToken(): string {
    return randomBytes(3).toString('hex').toUpperCase();
}