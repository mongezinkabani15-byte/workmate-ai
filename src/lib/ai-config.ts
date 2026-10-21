/**
 * ============================================================
 *  AI CONFIGURATION POINT
 * ============================================================
 * This app calls any OpenAI-compatible Chat Completions API
 * directly from the browser. Configure it with a `.env` file:
 *
 *   VITE_AI_API_KEY=your-key
 *   VITE_AI_BASE_URL=https://api.openai.com/v1   (optional)
 *   VITE_AI_MODEL=gpt-4o-mini                    (optional)
 *
 * WARNING: keys in VITE_* variables are visible to anyone who
 * loads the app. Use a restricted / low-limit key, or put a
 * proxy in front of the provider before going to production.
 *
 * If no key is set, the UI shows a setup message — it never
 * fabricates responses.
 * ============================================================
 */
export const aiConfig = {
  apiKey: (import.meta.env["VITE_AI_API_KEY"] as string | undefined) ?? "",
  baseUrl: (import.meta.env["VITE_AI_BASE_URL"] as string | undefined) ?? "https://api.openai.com/v1",
  model: (import.meta.env["VITE_AI_MODEL"] as string | undefined) ?? "gpt-4o-mini",
};

export const isAIConfigured = () => aiConfig.apiKey.trim().length > 0;
