import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadYaml = (file) => YAML.load(path.join(__dirname, 'swagger', file));

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
  // Serve Swagger UI with custom options
  const options = {
    customSiteTitle: "Horizon Task Manager API Docs",
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: '/public/favicon.ico',
    explorer: true
  };

  // Serve Swagger UI at /api-docs
  app.use(
    '/api-docs',
    swaggerUi.serve,
    (req, res, next) => {
      // Ensure proper content type for Swagger UI assets
      if (req.path.endsWith('.css') || req.path.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/css');
      }
      next();
    },
    swaggerUi.setup(swaggerDocument, options)
  );

  // Serve Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });

  // Redirect from /docs to /api-docs
  app.get('/docs', (req, res) => {
    res.redirect('/api-docs');
  });
};

export default setupSwaggerDocs;