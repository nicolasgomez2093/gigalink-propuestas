import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const PLANS = [
  { name: "Plan 50", speed: "50 Mbps", ideal: "Streaming HD y navegación familiar", tv_digital_optional: true },
  { name: "Plan 100", speed: "100 Mbps", ideal: "Streaming 4K y home office", tv_digital_optional: true },
  { name: "Plan 300", speed: "300 Mbps", ideal: "Gaming y múltiples usuarios", tv_digital_optional: true },
  { name: "Solo TV Digital", speed: "-", ideal: "TV Digital sin internet" },
  { name: "Empresas y Negocios", speed: "50 / 100 / 300 Mbps", ideal: "Consultar precio por WhatsApp" },
];

export default defineTool({
  name: "list_plans",
  title: "List internet plans",
  description: "List Gigalink's internet plans with speed and ideal usage.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(PLANS, null, 2) }],
    structuredContent: { plans: PLANS },
  }),
});