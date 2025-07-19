import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const loadYaml = (file) => YAML.load(path.join(process.cwd(), 'swagger', file));

const taskDoc = loadYaml('task.yaml');
const userDoc = loadYaml('user.yaml');
const noticeDoc = loadYaml('notice.yaml');

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Horizon Task Manager API",
    version: "1.0.0",
    description: "Complete API documentation for Horizon Task Manager",
    contact: {
      name: "API Support",
      email: "support@horizon.com"
    },
    license: {
      name: "MIT"
    }
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local development server"
    },
    {
      url: "https://server-horizon.vercel.app/api",
      description: "Production server"
    }
  ],
  tags: [
    { name: "Users", description: "User management and authentication" },
    { name: "Tasks", description: "Task management operations" },
    { name: "Notifications", description: "Notification operations" }
  ],
  paths: {
    ...userDoc.paths,
    ...taskDoc.paths,
    ...noticeDoc.paths
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token authentication"
      }
    },
    schemas: {
      ...userDoc.components?.schemas,
      ...taskDoc.components?.schemas,
      ...noticeDoc.components?.schemas,
      Error: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "error"
          },
          message: {
            type: "string",
            example: "Error message"
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                message: { type: "string" }
              }
            }
          }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
};

export default setupSwaggerDocs;