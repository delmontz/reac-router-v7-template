import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { cardSchema } from "~/schemas";

type CardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FieldErrors = {
  name?: string;
  number?: string;
  expiryMonth?: string;
  expiryYear?: string;
};

type FormValues = {
  name: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
};

const initialFormValues: FormValues = {
  name: "",
  number: "",
  expiryMonth: "",
  expiryYear: "",
};

export function CardModal({ isOpen, onClose }: CardModalProps) {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const isSubmitting = fetcher.state === "submitting";

  // 全ての値が入力されているかチェック
  const isFormValid =
    formValues.name.trim() !== "" &&
    formValues.number.trim() !== "" &&
    formValues.expiryMonth.trim() !== "" &&
    formValues.expiryYear.trim() !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // 送信成功時にモーダルを閉じる
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setErrors({});
      setFormValues(initialFormValues);
      formRef.current?.reset();
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  // サーバーからのエラーを表示
  useEffect(() => {
    if (fetcher.data?.errors) {
      setErrors(fetcher.data.errors);
    }
  }, [fetcher.data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      number: formData.get("number") as string,
      expiryMonth: formData.get("expiryMonth") as string,
      expiryYear: formData.get("expiryYear") as string,
    };

    // クライアントサイドバリデーション
    const result = cardSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    fetcher.submit(formData, { method: "post" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* モーダルコンテンツ */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            カード登録
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="閉じる"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <fetcher.Form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* カード名 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              カード名
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="例: メインカード"
              value={formValues.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* カード番号 */}
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              カード番号
            </label>
            <input
              type="text"
              id="number"
              name="number"
              placeholder="1234567890123456"
              maxLength={16}
              value={formValues.number}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono ${
                errors.number
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.number && (
              <p className="mt-1 text-sm text-red-500">{errors.number}</p>
            )}
          </div>

          {/* 有効期限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              有効期限
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  id="expiryMonth"
                  name="expiryMonth"
                  placeholder="MM"
                  maxLength={2}
                  value={formValues.expiryMonth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center ${
                    errors.expiryMonth
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.expiryMonth && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.expiryMonth}
                  </p>
                )}
              </div>
              <span className="flex items-center text-gray-500 dark:text-gray-400">
                /
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  id="expiryYear"
                  name="expiryYear"
                  placeholder="YY"
                  maxLength={2}
                  value={formValues.expiryYear}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center ${
                    errors.expiryYear
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.expiryYear && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.expiryYear}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "登録中..." : "登録"}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
