import { useState } from "react";
import type { Route } from "./+types/cards";
import { api } from "~/lib";
import { cardSchema } from "~/schemas";
import type { Card, CardInput, ActionResult } from "~/types";
import { getFieldErrors, getApiError } from "~/types";
import { CardList, CardModal } from "~/components/cards";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "カード一覧" },
    { name: "description", content: "カード一覧ページ" },
  ];
}

// クライアントサイドでデータ取得
export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const response = await api.get<Card[]>("/cards");
  return { cards: response.data };
}

// クライアントサイドでフォーム送信処理
export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionResult<Card>> {
  const formData = await request.formData();
  const data: CardInput = {
    name: formData.get("name") as string,
    number: formData.get("number") as string,
    expiryMonth: formData.get("expiryMonth") as string,
    expiryYear: formData.get("expiryYear") as string,
  };

  // バリデーション
  const result = cardSchema.safeParse(data);
  if (!result.success) {
    return { success: false, fieldErrors: getFieldErrors(result.error) };
  }

  // API呼び出し
  try {
    const response = await api.post<Card>("/cards", data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to create card:", error);
    return {
      success: false,
      error: getApiError(error, "カードの登録に失敗しました"),
    };
  }
}

export default function CardsPage({ loaderData }: Route.ComponentProps) {
  const { cards } = loaderData;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 py-8">
      <CardList cards={cards} onAddClick={() => setIsModalOpen(true)} />
      <CardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
