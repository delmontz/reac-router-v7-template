/**
 * APIエラーコード
 */
export const API_ERROR_CODE = {
  // バリデーション関連
  VALIDATION_ERROR: "VALIDATION_ERROR",
  // 認証・認可
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  // リソース
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  // サーバー
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  // ネットワーク
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

/**
 * APIエラーレスポンスの型
 */
export type ApiErrorResponse = {
  message: string;
  code: ApiErrorCode;
};

/**
 * APIエラーレスポンスを作成するヘルパー（MSW等で使用）
 */
export function createApiError(
  code: ApiErrorCode,
  message: string
): ApiErrorResponse {
  return { code, message };
}
