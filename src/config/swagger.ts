import swaggerJSDoc from 'swagger-jsdoc';

// Load our detailed pre-written specification as the base template
let baseSpec: any = {};
try {
  baseSpec = require('./openapi.json');
} catch (error) {
  baseSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Minimal Multi-Gym Management API',
      version: '1.0.0',
      description: 'Dynamic and automatically compiled Swagger API specifications.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
  };
}

const options: swaggerJSDoc.Options = {
  // Use the pre-existing complete spec as the foundation
  definition: baseSpec,
  // Automatically scan for any new routing files or custom controller comments to merge
  apis: ['./src/routes/*.ts', './src/routes/*.js', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
