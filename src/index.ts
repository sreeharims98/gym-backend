import "./config/swaggerRegistry"; // Extend Zod with openapi metadata early
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import gymRoutes from "./routes/gym.routes";
import planRoutes from "./routes/plan.routes";
import memberRoutes from "./routes/member.routes";
import paymentRoutes from "./routes/payment.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { getSwaggerSpec } from "./config/swagger";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// REST Routes
app.use("/api/auth", authRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/payments", paymentRoutes);

// Swagger API Documentation
app.get("/api-docs/openapi.json", (req, res) => {
  try {
    res.status(200).json(getSwaggerSpec());
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to compile Swagger spec",
      error: error.message,
    });
  }
});

app.get("/api-docs", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Minimal Multi-Gym Management API - Interactive Swagger Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.11.0/favicon-32x32.png" sizes="32x32" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
    /* Premium style improvements */
    .swagger-ui .topbar { display: none; } /* Hide the unneeded swagger header */
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "/api-docs/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.standalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
  `);
});

// Default status probe
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date() });
});

// Global Error Handling Middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(
    `Gym Management API Server is running on http://localhost:${port}/api-docs`,
  );
});
