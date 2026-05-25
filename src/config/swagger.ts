import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minimal Multi-Gym Management API',
      version: '1.0.0',
      description: 'Fully automated dynamic Swagger API documentation compiled directly from Express routes JSDoc annotations.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Input your token received from the Login API.',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Validation failed' },
          },
        },
      },
    },
  },
  // Automatically scan all source route files for JSDoc documentation
  apis: ['./src/routes/*.ts', './src/routes/*.js', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
