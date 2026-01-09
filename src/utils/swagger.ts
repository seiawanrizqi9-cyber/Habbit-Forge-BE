import swaggerJSDoc from "swagger-jsdoc";
import config from "./env";

const option: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API Documentation",
      version: "1.0.0",
      description: "Dokumentasi lengkap API E-Commerce",
      contact: {
        name: "Backend Developer",
      },
    },
    servers: [
      {
        url: `${config.HOST}:${config.PORT}/api`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    process.env.NODE_ENV === "production"
      ? "dist/routes/*.js"
      : "src/routes/*.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(option);

export default swaggerSpec;
