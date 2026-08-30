export type Column = {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  key?: 'PK' | 'FK' | 'UK' | 'idx' | null;
  description?: string;
  references?: string;
};

export type DatabaseTable = {
  name: string;
  purpose: string;
  columns: Column[];
  migrationHistory?: string[];
};

export type Parameter = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type ResponseExample = {
  status: number;
  description: string;
  body?: string;
};

export type ApiEndpoint = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  purpose: string;
  authentication: 'Admin JWT' | 'Student JWT' | 'API Key' | 'None' | 'Teacher JWT';
  requestBody?: string;
  responses: ResponseExample[];
  relatedTables?: string[];
  sourceFile?: string;
};

export type ArchitectureNode = {
  id: string;
  title: string;
  description: string;
  type: 'client' | 'service' | 'database';
  tech: string;
};

export type MigrationInfo = {
  id: string;
  filename: string;
  purpose: string;
  tablesAffected: string[];
};
