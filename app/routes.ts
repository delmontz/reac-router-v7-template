import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("demo", "routes/demo.tsx"),
  route("cards", "routes/cards.tsx"),
] satisfies RouteConfig;
