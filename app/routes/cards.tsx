import { useState } from "react";
import type { Route } from "./+types/cards";
import { api } from "~/lib";
import { cardSchema } from "~/schemas";
import type { Card, CardInput } from "~/types";
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
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data: CardInput = {
    name: formData.get("name") as string,
    number: formData.get("number") as string,
    expiryMonth: formData.get("expiryMonth") as string,
    expiryYear: formData.get("expiryYear") as string,
  };

  // サーバーサイドバリデーション（二重チェック）
  const result = cardSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      errors[field] = issue.message;
    });
    return { success: false, errors };
  }

  // API呼び出し
  try {
    await api.post<Card>("/cards", data);
    return { success: true };
  } catch (error) {
    console.error("Failed to create card:", error);
    return {
      success: false,
      errors: { _form: "カードの登録に失敗しました" },
    };
  }
}

export default function CardsPage({
  loaderData,
}: Route.ComponentProps) {
  const { cards } = loaderData;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 py-8">
      <CardList cards={cards} onAddClick={() => setIsModalOpen(true)} />
      <CardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
