import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./swaggerRegistry";

export const getSwaggerSpec = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Minimal Multi-Gym Management API",
      version: "1.0.0",
      description:
        "Fully automated dynamic Swagger API documentation compiled directly from Zod schemas and route registries.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],
  });
};
