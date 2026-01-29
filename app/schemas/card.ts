import { z } from "zod";

export const cardSchema = z.object({
  name: z
    .string()
    .min(1, "カード名を入力してください")
    .max(50, "カード名は50文字以内で入力してください"),
  number: z
    .string()
    .regex(/^\d{16}$/, "16桁の数字を入力してください"),
  expiryMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, "01〜12の形式で入力してください"),
  expiryYear: z
    .string()
    .regex(/^\d{2}$/, "2桁の年を入力してください（例: 26）"),
});

export type CardSchemaType = z.infer<typeof cardSchema>;
