import { http, HttpResponse, delay } from "msw";
import type { Card, CardInput } from "~/types";
import { API_ERROR_CODE, createApiError } from "~/types";

// インメモリストレージ（開発用）
let cards: Card[] = [
  {
    id: "1",
    name: "メインカード",
    number: "4111111111111111",
    expiryMonth: "12",
    expiryYear: "26",
  },
  {
    id: "2",
    name: "サブカード",
    number: "5500000000000004",
    expiryMonth: "06",
    expiryYear: "27",
  },
];

let nextId = 3;

export const handlers = [
  // カード一覧取得
  http.get("/api/cards", async () => {
    await delay(300);
    return HttpResponse.json(cards);
  }),

  // カード登録
  http.post("/api/cards", async ({ request }) => {
    await delay(500);

    try {
      const body = (await request.json()) as CardInput;

      // サーバーサイドバリデーション例
      if (!body.name || !body.number) {
        return HttpResponse.json(
          createApiError(
            API_ERROR_CODE.VALIDATION_ERROR,
            "必須項目が入力されていません"
          ),
          { status: 400 }
        );
      }

      // 重複チェック例
      const exists = cards.some((c) => c.number === body.number);
      if (exists) {
        return HttpResponse.json(
          createApiError(
            API_ERROR_CODE.CONFLICT,
            "このカード番号は既に登録されています"
          ),
          { status: 409 }
        );
      }

      const newCard: Card = {
        id: String(nextId++),
        ...body,
      };
      cards.push(newCard);

      return HttpResponse.json(newCard, { status: 201 });
    } catch {
      return HttpResponse.json(
        createApiError(
          API_ERROR_CODE.INTERNAL_ERROR,
          "サーバーエラーが発生しました"
        ),
        { status: 500 }
      );
    }
  }),

  // カード削除（例）
  http.delete("/api/cards/:id", async ({ params }) => {
    await delay(300);
    const { id } = params;

    const index = cards.findIndex((c) => c.id === id);
    if (index === -1) {
      return HttpResponse.json(
        createApiError(API_ERROR_CODE.NOT_FOUND, "カードが見つかりません"),
        { status: 404 }
      );
    }

    cards = cards.filter((c) => c.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
