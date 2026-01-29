import type { Route } from "./+types/demo";
import { useBreakpoint } from "~/hooks";
import { CardWrapper, CardContent } from "~/components/demo";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Demo Page" },
    { name: "description", content: "Responsive card demo" },
  ];
}

export default function Demo() {
  const { isSP } = useBreakpoint();

  return (
    <CardWrapper isSP={isSP}>
      <CardContent isSP={isSP} />
    </CardWrapper>
  );
}
