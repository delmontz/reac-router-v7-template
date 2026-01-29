type CardWrapperProps = {
  isSP: boolean;
  children: React.ReactNode;
};

export function CardWrapper({ isSP, children }: CardWrapperProps) {
  // SP: シンプルなdivでフルサイズ表示
  if (isSP) {
    return (
      <div className="flex-1">
        <div className="min-h-full bg-white dark:bg-gray-800 p-6">
          {children}
        </div>
      </div>
    );
  }

  // PC: カード風のラッパーで中央表示（sw-card の代わり）
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );
}
