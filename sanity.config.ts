"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "@/sanity/schemas";
import { dataset, projectId } from "@/sanity/env";

export default defineConfig({
  name: "nammun-church",
  title: "남문교회",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
