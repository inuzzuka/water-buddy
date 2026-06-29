/**
 * database.ts — Water Buddy
 * SQLite connection + versioned schema migrations
 *
 * Setup:
 *   npx expo install expo-sqlite
 */

import * as SQLite from 'expo-sqlite';

export type Migration = { version: number; up: string[] };

// ─── Schema Migrations ────────────────────────────────────────────────────────
// NEVER edit or delete existing migrations.
// To change the schema: add a new object with the next version number.

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: [
      // ── Users ──────────────────────────────────────────────────────────────
      // Stores auth credentials and profile info.
      `CREATE TABLE IF NOT EXISTS users (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name   TEXT    NOT NULL,
        last_name    TEXT    NOT NULL,
        email        TEXT    NOT NULL UNIQUE,
        password     TEXT    NOT NULL,
        level        INTEGER NOT NULL DEFAULT 1,
        xp           INTEGER NOT NULL DEFAULT 0,
        created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
        updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
      )`,

      // ── Water logs ─────────────────────────────────────────────────────────
      // Every individual sip/drink the user logs.
      `CREATE TABLE IF NOT EXISTS water_logs (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount_ml   INTEGER NOT NULL,
        label       TEXT    NOT NULL DEFAULT 'Water',
        logged_at   TEXT    NOT NULL DEFAULT (datetime('now')),
        created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
      )`,

      // ── Daily goals ────────────────────────────────────────────────────────
      // One row per user per calendar day.
      `CREATE TABLE IF NOT EXISTS daily_goals (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date         TEXT    NOT NULL DEFAULT (datetime('now')),
        goal_ml      INTEGER NOT NULL DEFAULT 2500,
        consumed_ml  INTEGER NOT NULL DEFAULT 0,
        streak_days  INTEGER NOT NULL DEFAULT 0,
        completed    INTEGER NOT NULL DEFAULT 0,
        created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
        updated_at   TEXT    NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id, date)
      )`,

      // ── Reminders ──────────────────────────────────────────────────────────
      // Notification schedule per user.
      `CREATE TABLE IF NOT EXISTS reminders (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        enabled             INTEGER NOT NULL DEFAULT 1,
        frequency_minutes   INTEGER NOT NULL DEFAULT 60,
        quiet_start         TEXT    NOT NULL DEFAULT '22:00',
        quiet_end           TEXT    NOT NULL DEFAULT '07:00',
        updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id)
      )`,

      // ── Settings ───────────────────────────────────────────────────────────
      // One row per user. Flags from the Settings screen.
      `CREATE TABLE IF NOT EXISTS settings (
        id                   INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id              INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        dark_mode            INTEGER NOT NULL DEFAULT 0,
        sound                INTEGER NOT NULL DEFAULT 1,
        default_quick_add_ml INTEGER NOT NULL DEFAULT 400,
        updated_at           TEXT    NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id)
      )`,

      // ── Buddy tips ─────────────────────────────────────────────────────────
      // AI-style tips displayed in the "Water Buddy Tip" card.
      `CREATE TABLE IF NOT EXISTS buddy_tips (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content    TEXT    NOT NULL,
        shown_at   TEXT,
        created_at TEXT    NOT NULL DEFAULT (datetime('now'))
      )`,
    ],
  },
  // ── Future migrations go here ─────────────────────────────────────────────
  // { version: 2, up: [`ALTER TABLE users ADD COLUMN weight_kg REAL`] },
];

// ─── Singleton ────────────────────────────────────────────────────────────────

let _db: SQLite.SQLiteDatabase | null = null;
let _initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const db = await SQLite.openDatabaseAsync('waterbuddy.db');
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync('PRAGMA foreign_keys = ON;');
    await runMigrations(db);
    _db = db;
    return db;
  })();

  return _initPromise;
}

export async function closeDatabase(): Promise<void> {
  if (_db) {
    await _db.closeAsync();
    _db = null;
  }
}

// ─── Migration runner ─────────────────────────────────────────────────────────

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version    INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT COALESCE(MAX(version), 0) AS version FROM _migrations',
  );
  const current = row?.version ?? 0;
  const pending = MIGRATIONS.filter((m) => m.version > current);

  for (const migration of pending) {
    await db.execAsync('BEGIN');
    try {
      for (const sql of migration.up) {
        await db.execAsync(sql);
      }
      await db.runAsync('INSERT INTO _migrations (version) VALUES (?)', migration.version);
      await db.execAsync('COMMIT');
    } catch (e) {
      await db.execAsync('ROLLBACK');
      throw e;
    }
    console.log(`[WaterBuddy DB] Migration v${migration.version} applied.`);
  }

  if (!pending.length) {
    console.log(`[WaterBuddy DB] Schema up to date (v${current}).`);
  }
}
