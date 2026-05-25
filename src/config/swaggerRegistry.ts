import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Extend Zod with OpenAPI properties centrally
extendZodWithOpenApi(z);

// Central registry to register schemas and routing paths
export const registry = new OpenAPIRegistry();

// Centrally register our JWT Bearer Authentication schema
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Input your token received from the Login API.",
});

export { z };
