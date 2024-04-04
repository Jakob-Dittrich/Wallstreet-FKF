// Using ESM import syntax
import sqlite3 from 'sqlite3';
const db = sqlite3.verbose();
const dbPath = '../database/wallstreet-database.db'; // Update the path as necessary

// Function to establish a database connection
const connect = () => new db.Database(dbPath, sqlite3.OPEN_READWRITE);

const getAppSetting = async (settingKey) => {
    const sql = `SELECT * FROM appSettings WHERE setting_key = ?`;
    try {
        const rows = await read(sql, [settingKey]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error fetching app setting:', error);
        return null;
    }
};


const getBooleanAppSetting = (settingKey) => {
    return getAppSetting(settingKey).then((setting) => {
        // Check if setting is not null and compare the string value
        return setting !== null && setting.setting_value === '1';
    });
};

// Generic read function for SELECT queries
const read = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        const database = connect();
        database.all(sql, params, (err, rows) => {
            database.close();
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Generic write function for INSERT, UPDATE, DELETE queries
// Updated write function to optionally accept an existing database connection
const write = (sql, params = [], db = null) => {
    const shouldClose = !db; // Only close if we created the connection here

    if (!db) {
        db = connect(); // If no connection is provided, create a new one
    }

    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (shouldClose) {
                db.close(); // Close the connection if it was created in this function
            }
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

export {
    read,
    write,
    connect,
    getAppSetting,
    getBooleanAppSetting
};

