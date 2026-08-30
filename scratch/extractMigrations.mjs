import * as fs from 'fs';
import * as path from 'path';

const migrationsDir = 'd:/attendance-gateway-main/attendance-gateway/migrations';
const outPath = 'd:/attendance-gateway-main/attendx-engineering/src/data/content/generated-migrations.ts';

const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

const migrations = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
  
  // Extract created tables
  const createdTables = [];
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi;
  let match;
  while ((match = tableRegex.exec(content)) !== null) {
    createdTables.push(match[1]);
  }

  // Extract inserted tables
  const insertedTables = [];
  const insertRegex = /INSERT\s+INTO\s+([a-zA-Z0-9_]+)/gi;
  while ((match = insertRegex.exec(content)) !== null) {
    if (!insertedTables.includes(match[1])) {
        insertedTables.push(match[1]);
    }
  }
  
  migrations.push({
    file,
    createdTables: [...new Set(createdTables)],
    insertedTables: [...new Set(insertedTables)],
    contentLength: content.length,
    purpose: file.replace(/^\d+_/, '').replace('.sql', '').replace(/_/g, ' ')
  });
}

// Convert to API model
const tsContent = `export type MigrationData = {
  file: string;
  createdTables: string[];
  insertedTables: string[];
  contentLength: number;
  purpose: string;
};

export const migrations: MigrationData[] = ${JSON.stringify(migrations, null, 2)};
`;

fs.writeFileSync(outPath, tsContent);
console.log('Successfully wrote', migrations.length, 'migrations to generated-migrations.ts');
