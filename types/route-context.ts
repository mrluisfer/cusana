export type RouteContext<Params extends Record<string, string>> = {
  params: Promise<Params>;
};
