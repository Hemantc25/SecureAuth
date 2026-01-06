import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

// Hashes a plain text password
export const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

// Compares a plain text password with a hashed password
export const comparePassword = async (plainPassword, passwordHash) => {
  return bcrypt.compare(plainPassword, passwordHash);
};
