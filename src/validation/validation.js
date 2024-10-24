import { z } from "zod";

// Validation For Register

const registerSchema = z.object({
  username: z
    .string({ required_error: "Name is Required" })
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot exceed 20 characters")
    .trim() // Remove leading/trailing whitespace
    .regex(/^[a-zA-Z0-9_]+$/), // Allow letters, numbers, and underscore
  email: z
    .string()
    .email("Invalid email format")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, uppercase letter, number, and special character"
    ),
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, uppercase letter, number, and special character"
    ),
});

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(15, "Username must be at most 15 characters long")
    .regex(/^[a-zA-Z0-9._-]+$/, "Username must contain only letters, numbers, underscores, periods, and hyphens")
    .refine(
      (username) => {
        const words = username.split(/\s+/);
        return words.length >= 2 && words.every((word) => word.length >= 3);
      },
      "Username must have at least two words, each with at least 3 characters"
    ),
  bio: z
    .string()
    .trim()
    .min(10, "Bio must be at least 10 characters long")
    .max(30, "Bio must be at most 30 characters long")
    .regex(/^[a-zA-Z0-9._-]+$/, "Bio must contain only letters, numbers, underscores, periods, and hyphens")
    .refine(
      (bio) => {
        const words = bio.split(/\s+/);
        return words.length >= 1 ;
      },
      "Bio must have at least one words,"
    ),
});

export { registerSchema, loginSchema, profileSchema };
