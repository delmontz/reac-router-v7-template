type CardContentProps = {
  isSP: boolean;
};

export function CardContent({ isSP }: CardContentProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        デモカード
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        このカードは画面サイズによって表示が変わります。
      </p>
      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          PC: 上下中央に白いカードを表示
        </li>
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          SP: 親要素いっぱいにカードを表示
        </li>
      </ul>
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          現在の表示モード:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {isSP ? "SP（スマートフォン）" : "PC"}
          </span>
        </p>
      </div>
    </>
  );
}
