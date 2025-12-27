import fs from "node:fs/promises";
import path from "node:path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import xlsx from "xlsx";

const server = new Server(
  { name: "mcp-excel-json", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "excel_to_json",
        description: "Read a local Excel file and write a JSON file.",
        inputSchema: {
          type: "object",
          properties: {
            excelPath: {
              type: "string",
              description: "Path to .xlsx/.xls file (absolute or relative)."
            },
            sheet: {
              type: "string",
              description: "Optional sheet name. Defaults to the first sheet."
            },
            outputPath: {
              type: "string",
              description:
                "Optional output JSON path. Defaults to same folder with .json."
            }
          },
          required: ["excelPath"]
        }
      }
    ]
  };
});

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  if (name !== "excel_to_json") {
    throw new Error(`Unknown tool: ${name}`);
  }

  const excelPath = args?.excelPath;
  if (!excelPath || typeof excelPath !== "string") {
    throw new Error("excelPath is required and must be a string.");
  }

  const sheet = typeof args?.sheet === "string" ? args.sheet : undefined;
  const outputPath =
    typeof args?.outputPath === "string" ? args.outputPath : undefined;

  const resolvedExcelPath = path.resolve(excelPath);
  await fs.access(resolvedExcelPath);

  const workbook = xlsx.readFile(resolvedExcelPath, { cellDates: true });
  const sheetName = sheet ?? workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("Workbook has no sheets.");
  }

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`Sheet not found: ${sheetName}`);
  }

  const rows = xlsx.utils.sheet_to_json(worksheet, { defval: null });
  const resolvedOutputPath = outputPath
    ? path.resolve(outputPath)
    : path.join(
        path.dirname(resolvedExcelPath),
        `${path.parse(resolvedExcelPath).name}.json`
      );

  await fs.mkdir(path.dirname(resolvedOutputPath), { recursive: true });
  await fs.writeFile(
    resolvedOutputPath,
    JSON.stringify(rows, null, 2),
    "utf8"
  );

  return {
    content: [
      {
        type: "text",
        text: `Wrote ${rows.length} rows to ${resolvedOutputPath}`
      }
    ]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
