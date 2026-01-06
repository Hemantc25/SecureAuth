import { hashPassword, comparePassword } from "../src/services/auth.service.js";

const hash = await hashPassword("secret123");
console.log(await comparePassword("secret123", hash));
console.log(await comparePassword("wrong", hash));
