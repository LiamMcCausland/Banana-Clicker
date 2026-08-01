// constants for the hashing algorithm, number of iterations, and hash length in bits.
const HASH_ALGORITHM = "SHA-256";
const ITERATIONS = 10000;
const HASH_LENGTH_BITS = 256;

// Converts an ArrayBuffer to a hexadecimal string. Helper for the hashPassword function so that the hash can be stored as a string in the database.
function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Since the deriveBits function returns an ArrayBuffer, we need to convert it to a hexadecimal string so that it can be stored in the database.
// This function takes a password and a salt, derives a hash using PBKDF2, and returns the hash as a hexadecimal string.
export async function hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);

    // deriveBits(algorithm, baseKey, length)
    const derivedBits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: ITERATIONS, hash: HASH_ALGORITHM, }, keyMaterial, HASH_LENGTH_BITS);

    // convert before returning
    return bufferToHex(derivedBits);
}

// Verifies a password by hashing it with the provided salt and comparing it to the stored hash. Returns true if the password is correct, false otherwise.
export async function verifyPassword(password: string, salt: string, storedHash: string): Promise<boolean> {
    const candidateHash = await hashPassword(password, salt);
    return candidateHash === storedHash;
}

// Generates a random salt using the Web Crypto API. The salt is returned as a hexadecimal string.
export function generateSalt(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return bufferToHex(bytes.buffer);
}
