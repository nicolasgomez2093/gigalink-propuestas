import { defineMcp } from "@lovable.dev/mcp-js";
import listPlansTool from "./tools/list-plans";
import checkCoverageTool from "./tools/check-coverage";
import contactInfoTool from "./tools/contact-info";

export default defineMcp({
  name: "gigalink-mcp",
  title: "Gigalink MCP",
  version: "0.1.0",
  instructions:
    "Tools for Gigalink, a fiber ISP in San Miguel de Tucumán, Argentina. Use `list_plans` to get available internet plans, `check_coverage` to look up published neighborhood coverage (installation at an address requires confirmation), and `get_contact_info` for address, WhatsApp and business hours.",
  tools: [listPlansTool, checkCoverageTool, contactInfoTool],
});