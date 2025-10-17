import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const opciones: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.2",
    tags: [
      {
        name: "Productos",
        description: "Operaciones API relacionadas a productos",
      },
    ],
    info: {
      title: "REST API Node.js / Express / TypeScript",
      version: "1.0.0",
      description: "Documentación API para productos",
    },
  },
  apis: ["./src/router.ts"],
};

const swaggerSpec = swaggerJSDoc(opciones);

const swaggerUiOptions: SwaggerUiOptions = {
  customCss: `
        .topbar-wrapper .link {
            content: url("https://codigoconjuan.com/wp-content/themes/cursosjuan/img/logo.svg");
            height: 80px;
            width: auto;
        }
        .swagger-ui .topbar {
            background-color: #2b3b45
        }
    `,
  customSiteTitle: "Documentación REST API",
};

export default swaggerSpec;
export { swaggerUiOptions };
