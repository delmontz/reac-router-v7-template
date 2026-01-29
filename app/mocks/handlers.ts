import { http, HttpResponse, delay } from "msw";
import type { Card, CardInput } from "~/types";

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
    const body = (await request.json()) as CardInput;

    const newCard: Card = {
      id: String(nextId++),
      ...body,
    };
    cards.push(newCard);

    return HttpResponse.json(newCard, { status: 201 });
  }),
];
