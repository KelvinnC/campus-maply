import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlite = sqlite3.verbose();

class Database {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, 'campus_map.db');
            this.db = new sqlite.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                } else {
                    console.log('Database connected successfully');
                    this.createTables().then(() => {
                        this.seedData().then(resolve).catch(reject);
                    }).catch(reject);
                }
            });
        });
    }

    async createTables() {
        return new Promise((resolve, reject) => {
            try {
                const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
                const schemaSql = fs.readFileSync(schemaPath, 'utf8');
                this.db.exec(schemaSql, (err) => {
                    if (err) {
                        console.error('Error creating tables:', err);
                        reject(err);
                    } else {
                        console.log('Database tables created successfully');
                        resolve();
                    }
                });
            } catch (e) {
                console.error('Error reading schema file:', e);
                reject(e);
            }
        });
    }

    async seedData() {
        return new Promise((resolve, reject) => {
            try {
                const seedPath = path.join(__dirname, 'sql', 'seed.sql');
                const seedSql = fs.readFileSync(seedPath, 'utf8');
                
                // Split the SQL into individual statements
                const statements = seedSql
                    .split(';')
                    .map(stmt => stmt.trim())
                    .filter(stmt => stmt.length > 0);
                
                let completed = 0;
                const total = statements.length;
                
                if (total === 0) {
                    console.log('No seed statements found');
                    resolve();
                    return;
                }
                
                statements.forEach((statement, index) => {
                    this.db.exec(statement + ';', (err) => {
                        if (err) {
                            console.error(`Error executing seed statement ${index + 1}:`, err);
                            reject(err);
                        } else {
                            completed++;
                            if (completed === total) {
                                console.log('Database seeded successfully');
                                resolve();
                            }
                        }
                    });
                });
            } catch (e) {
                console.log('No seed file found or already seeded');
                resolve();
            }
        });
    }

    getDB() {
        return this.db;
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed');
                }
            });
        }
    }
}

export default new Database();

