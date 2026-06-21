import sequelize from '../config/database.js';
import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv';
import * as usersMigration from '../migrations/20260605000001-create-users.js';
import * as projectsMigration from '../migrations/20260605000002-create-projects.js';
import * as messagesMigration from '../migrations/20260605000003-create-messages.js';
import * as siteContentMigration from '../migrations/20260605000004-create-site-content.js';

dotenv.config();

async function ensureDatabaseExists() {
  const client = new pg.Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres'
  });

  try {
    await client.connect();
    const dbName = process.env.DB_NAME || 'ayuta_db';
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database '${dbName}' does not exist. Creating...`);
      // Escape database name to avoid sql injection issues
      await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
      console.log(`Database '${dbName}' created successfully.`);
    }
  } catch (error) {
    console.warn('Warning: Could not verify database existence. Attempting migrations anyway...', error.message);
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}

async function runMigrations() {
  await ensureDatabaseExists();
  
  const queryInterface = sequelize.getQueryInterface();
  
  console.log('--- Starting Sequelize Table Migrations ---');
  
  try {
    const tables = await queryInterface.showAllTables();
    
    if (!tables.includes('Users')) {
      console.log('Migrating table: Users');
      await usersMigration.up(queryInterface, Sequelize);
      console.log('Successfully created table: Users');
    } else {
      console.log('Table already exists: Users');
    }
    
    if (!tables.includes('Projects')) {
      console.log('Migrating table: Projects');
      await projectsMigration.up(queryInterface, Sequelize);
      console.log('Successfully created table: Projects');
    } else {
      console.log('Table already exists: Projects');
    }
    
    if (!tables.includes('Messages')) {
      console.log('Migrating table: Messages');
      await messagesMigration.up(queryInterface, Sequelize);
      console.log('Successfully created table: Messages');
    } else {
      console.log('Table already exists: Messages');
    }

    if (!tables.includes('SiteSettings')) {
      console.log('Migrating table: SiteSettings');
      await siteContentMigration.up(queryInterface, Sequelize);
      console.log('Successfully created tables: SiteSettings, ContentItems');
    } else {
      console.log('Table already exists: SiteSettings');
    }
    
    console.log('--- Migrations completed successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
