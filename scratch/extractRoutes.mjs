import * as fs from 'fs';
import * as path from 'path';

const routesDir = 'd:/attendance-gateway-main/attendance-gateway/backend/src/routes';
const outPath = 'd:/attendance-gateway-main/attendx-engineering/src/data/content/generated-apis.ts';

const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));

const apis = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(routesDir, file), 'utf-8');
  // Match router.post('/path', ...
  // Match adminRouter.get('/path', ...
  // Match academicRouter.put('/path', ...
  const regex = /(\w*Router)\.(get|post|put|patch|delete|ws)\(\s*['"`]([^'"`]+)['"`]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const routerName = match[1];
    const method = match[2].toUpperCase();
    const routePath = match[3];
    
    // Determine group based on file or router
    let group = file.replace('.ts', '');
    if (routerName === 'adminRouter' || routerName === 'adminPublicRouter') {
      group = 'admin';
    } else if (routerName === 'academicRouter') {
      group = 'academic';
    }

    // Determine security based on the line
    const fullLine = content.slice(match.index, content.indexOf('\n', match.index));
    let security = 'public';
    if (fullLine.includes('requireAdmin')) security = 'bearerAuth (Admin)';
    else if (fullLine.includes('requireProfessor')) security = 'bearerAuth (Professor)';
    else if (fullLine.includes('requireStudent')) security = 'bearerAuth (Student)';
    else if (fullLine.includes('requireApiKey')) security = 'ApiKey';

    apis.push({
      method,
      path: routePath,
      group,
      security,
      file
    });
  }
}

// Convert to API model
const tsContent = `import type { ApiEndpoint } from '../models';

export const apis: ApiEndpoint[] = ${JSON.stringify(apis, null, 2)};
`;

fs.writeFileSync(outPath, tsContent);
console.log('Successfully wrote', apis.length, 'APIs to generated-apis.ts');
