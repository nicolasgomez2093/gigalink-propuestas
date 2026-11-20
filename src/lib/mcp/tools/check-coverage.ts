import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  matchNeighborhood,
  neighborhoodCoverage,
  suggestNeighborhoods,
} from "../../coverage/catalog";

export default defineTool({
  name: "check_coverage",
  title: "Check neighborhood coverage",
  description:
    "Look up published fiber and digital TV coverage by neighborhood. This cannot confirm address-level installation availability. Unknown neighborhoods require review.",
  inputSchema: {
    location: z.string().trim().min(1).describe("Neighborhood name"),
    locality: z
      .string()
      .optional()
      .describe("Locality, e.g. San Miguel de Tucumán or El Manantial"),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: ({ location, locality }) => {
    const result = neighborhoodCoverage(location, locality);
    const exact = matchNeighborhood(location, locality);
    const matches = exact ? [exact] : suggestNeighborhoods(location, locality);
    return {
      content: [
        {
          type: "text",
          text: `${result.title}. ${result.detail}${matches.length && !exact ? ` Coincidencias para revisar: ${matches.map((n) => n.name).join(", ")}.` : ""}`,
        },
      ],
      structuredContent: {
        status: result.status,
        addressConfirmed: false,
        matches,
        ...result,
      },
    };
  },
});
