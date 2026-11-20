import { defineTool } from "@lovable.dev/mcp-js";

const CONTACT = {
  company: "Gigalink",
  address: "Eugenio Mendez 502, San Miguel de Tucumán, Argentina",
  whatsapp_sales: "+54 9 381 409-2755",
  whatsapp_sales_link: "https://wa.me/5493814092755",
  hours: "Lunes a viernes 9-18h, sábados 9-13h",
};

export default defineTool({
  name: "get_contact_info",
  title: "Get contact info",
  description: "Return Gigalink's contact information: address, WhatsApp and business hours.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(CONTACT, null, 2) }],
    structuredContent: CONTACT,
  }),
});