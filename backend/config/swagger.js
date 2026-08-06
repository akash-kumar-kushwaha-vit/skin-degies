/**
 * Swagger / OpenAPI Configuration
 * =================================
 * Generates OpenAPI 3.0 spec from JSDoc comments across all route files.
 * Accessible at GET /api/docs
 */

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SkinDegies API",
      version: "1.0.0",
      description:
        "REST API for the SkinDegies AI skin disease detection platform. " +
        "Handles authentication, predictions, AI-generated reports, and admin operations.",
      contact: {
        name: "SkinDegies AI Team",
        url: "https://github.com/your-org/skin-degies",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:5000",
        description: "Current server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Scan all route files for JSDoc @openapi annotations
  apis: ["./routes/*.js", "./models/*.js", "./server.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
