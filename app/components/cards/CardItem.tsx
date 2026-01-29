import type { Card } from "~/types";

type CardItemProps = {
  card: Card;
};

// カード番号をマスク表示（末尾4桁のみ表示）
function maskCardNumber(number: string): string {
  return `****-****-****-${number.slice(-4)}`;
}

export function CardItem({ card }: CardItemProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {card.name}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          ID: {card.id}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-gray-600 dark:text-gray-300 font-mono text-sm">
          {maskCardNumber(card.number)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          有効期限: {card.expiryMonth}/{card.expiryYear}
        </p>
      </div>
    </div>
  );
}
