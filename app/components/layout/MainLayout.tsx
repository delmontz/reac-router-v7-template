import { Header } from "./Header";
import { Footer } from "./Footer";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* flex-1 + flex flex-col で子要素に高さを伝播 */}
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
