/** Internal files (docs, config, notes) are never served from the public site. */
const BLOCKED = /^\/(?:[^/]+\.md|supplier-config\.json|docs\/.*|netlify\/.*|functions\/.*)$/i;

export const onRequest = async (context: { request: Request; next: () => Promise<Response> }) => {
  const path = new URL(context.request.url).pathname;
  if (BLOCKED.test(path)) return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" } });
  return context.next();
};
