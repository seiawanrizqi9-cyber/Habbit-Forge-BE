import { body, param } from "express-validator";

export const createCheckInValidation = [
  body("habitId")
    .notEmpty()
    .withMessage("Habit ID diperlukan")
    .isUUID()
    .withMessage("Habit ID harus format UUID"),

  body("date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Format tanggal harus YYYY-MM-DD"),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Catatan maksimal 500 karakter"),
];

export const updateCheckInValidation = [
  param("id").isUUID().withMessage("CheckIn ID harus format UUID"),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Catatan maksimal 500 karakter"),
];