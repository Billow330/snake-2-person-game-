# MCP Excel to JSON

This MCP server reads a local Excel file and writes a JSON file.

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

## MCP client config example

```json
{
  "mcpServers": {
    "excel-json": {
      "command": "node",
      "args": ["d:\\\\AIagent\\\\mcp-excel-json\\\\server.js"]
    }
  }
}
```

## Tool

`excel_to_json` parameters:
- `excelPath` (required): Path to the Excel file.
- `sheet` (optional): Sheet name; default is the first sheet.
- `outputPath` (optional): Output JSON path; default is `same folder + .json`.
