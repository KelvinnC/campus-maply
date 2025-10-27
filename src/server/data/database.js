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
                    this.createTables()
                        .then(() => this.migrate())
                        .then(() => this.seedData())
                        .then(resolve)
                        .catch(reject);
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
                this.db.get('SELECT COUNT(1) as c FROM buildings', [], (countErr, row) => {
                    if (countErr) {
                        console.error('Error checking seed state:', countErr);
                        reject(countErr);
                        return;
                    }
                    if (row && row.c > 0) {
                        console.log('Database already seeded; skipping');
                        resolve();
                        return;
                    }

                    const seedPath = path.join(__dirname, 'sql', 'seed.sql');
                    const seedSql = fs.readFileSync(seedPath, 'utf8');

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
                    this.db.exec('BEGIN TRANSACTION;', (beginErr) => {
                        if (beginErr) {
                            console.error('Error starting seed transaction:', beginErr);
                            reject(beginErr);
                            return;
                        }

                        statements.forEach((statement, index) => {
                            this.db.exec(statement + ';', (err) => {
                                if (err) {
                                    console.error(`Error executing seed statement ${index + 1}:`, err);
                                    this.db.exec('ROLLBACK;', () => reject(err));
                                } else {
                                    completed++;
                                    if (completed === total) {
                                        this.db.exec('COMMIT;', (commitErr) => {
                                            if (commitErr) {
                                                console.error('Error committing seed transaction:', commitErr);
                                                reject(commitErr);
                                            } else {
                                                console.log('Database seeded successfully');
                                                resolve();
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    });
                });
            } catch (e) {
                console.log('No seed file found or already seeded');
                resolve();
            }
        });
    }

    async migrate() {
        return new Promise((resolve, reject) => {
            try {
                this.db.exec('BEGIN TRANSACTION;', (beginErr) => {
                    if (beginErr) {
                        console.error('Migration begin failed:', beginErr);
                        reject(beginErr);
                        return;
                    }

                    const steps = [
                        `DELETE FROM rooms WHERE rowid NOT IN (
                            SELECT MIN(rowid) FROM rooms GROUP BY building_id, room_number
                        );`,
                        `CREATE UNIQUE INDEX IF NOT EXISTS idx_rooms_building_room
                         ON rooms(building_id, room_number);`
                    ];

                    let i = 0;
                    const runNext = () => {
                        if (i >= steps.length) {
                            this.db.exec('COMMIT;', (commitErr) => {
                                if (commitErr) {
                                    console.error('Migration commit failed:', commitErr);
                                    reject(commitErr);
                                } else {
                                    console.log('Migration completed');
                                    resolve();
                                }
                            });
                            return;
                        }
                        const sql = steps[i++];
                        this.db.exec(sql, (err) => {
                            if (err) {
                                console.error('Migration step failed:', err, '\nSQL:', sql);
                                this.db.exec('ROLLBACK;', () => reject(err));
                            } else {
                                runNext();
                            }
                        });
                    };

                    runNext();
                });
            } catch (e) {
                console.error('Migration error:', e);
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

