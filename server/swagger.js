import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Satohash OTS API',
      version: '1.0.0',
      description: 'API for Bitcoin Proof-of-Existence using OpenTimestamps',
    },
    servers: [
      {
        url: process.env.SWAGGER_URL || 'http://localhost:3001',
      },
    ],
  },
  apis: ['./server/index.js'], // Scan routes in index.js
};

const specs = swaggerJsDoc(options);
export default specs;
