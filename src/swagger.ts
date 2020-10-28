import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUiExpress from 'swagger-ui-express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { name, description, version } from '../package.json';

export const swaggerSpec = (
  getMetadataArgsStorage,
  routingControllersOptions,
  app) => {
  // Parse class-validator classes into JSON Schema:
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/'
  });

  // Parse routing-controllers classes into OpenAPI spec:
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(
    storage,
    routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ bearerAuth: [] }],
      info: {
        description: `${description}`,
        title: `${name}`,
        version: `${version}`
      }
    });

  app.use('/docs',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(spec)
  );
};
