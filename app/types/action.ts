import type { ZodError } from "zod";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "./api";
import { API_ERROR_CODE } from "./api";

/**
 * clientAction / action の戻り値の型
 *
 * @example
 * // 成功（データなし）
 * return { success: true }
 *
 * // 成功（データあり）
 * return { success: true, data: card }
 *
 * // Zodバリデーションエラー
 * return { success: false, fieldErrors: { name: "必須です" } }
 *
 * // APIエラー
 * return { success: false, error: { code: "NOT_FOUND", message: "見つかりません" } }
 */
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | {
      success: false;
      /** フィールドごとのエラー（Zodバリデーション用） */
      fieldErrors?: Record<string, string>;
      /** APIエラー（message + code） */
      error?: ApiErrorResponse;
    };

// ============================================
// ヘルパー関数（使わなくてもOK）
// ============================================

/**
 * ZodErrorからフィールドエラーを取り出す
 */
export function getFieldErrors(zodError: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of zodError.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

/**
 * AxiosError / Error からAPIエラーレスポンスを取り出す
 */
export function getApiError(
  error: unknown,
  fallbackMessage = "エラーが発生しました"
): ApiErrorResponse {
  if (error instanceof Error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // APIからのエラーレスポンスがある場合
    if (axiosError.response?.data?.code && axiosError.response?.data?.message) {
      return axiosError.response.data;
    }

    // ネットワークエラー
    if (axiosError.code === "ERR_NETWORK") {
      return {
        code: API_ERROR_CODE.NETWORK_ERROR,
        message: "ネットワークエラーが発生しました",
      };
    }

    // タイムアウト
    if (axiosError.code === "ECONNABORTED") {
      return {
        code: API_ERROR_CODE.TIMEOUT,
        message: "リクエストがタイムアウトしました",
      };
    }
  }

  // その他のエラー
  return {
    code: API_ERROR_CODE.INTERNAL_ERROR,
    message: fallbackMessage,
  };
}
