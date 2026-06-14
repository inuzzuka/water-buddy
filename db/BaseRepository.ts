/**
 * BaseRepository.ts
 * Generic CRUD base — extend for every table.
 */

import { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from './database';

export type WhereClause = {
  clause: string;
  args: (string | number | null)[];
};

export type FindOptions = {
  where?: WhereClause;
  orderBy?: { column: string; direction?: 'ASC' | 'DESC' };
  limit?: number;
  offset?: number;
};

export abstract class BaseRepository<T extends { id?: number }> {
  protected abstract tableName: string;
  private _db: SQLiteDatabase | null = null;

  protected async db(): Promise<SQLiteDatabase> {
    if (!this._db) this._db = await getDatabase();
    return this._db;
  }

  async insert(data: Omit<T, 'id'>): Promise<number> {
    const db = await this.db();
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(data) as (string | number | null)[];
    const result = await db.runAsync(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
      ...values,
    );
    return result.lastInsertRowId;
  }

  async findById(id: number): Promise<T | null> {
    const db = await this.db();
    return db.getFirstAsync<T>(`SELECT * FROM ${this.tableName} WHERE id = ?`, id);
  }

  async findAll(options: FindOptions = {}): Promise<T[]> {
    const db = await this.db();
    const { sql, args } = this.buildSelect(options);
    return db.getAllAsync<T>(sql, ...args);
  }

  async findOne(options: FindOptions = {}): Promise<T | null> {
    const db = await this.db();
    const { sql, args } = this.buildSelect({ ...options, limit: 1 });
    return db.getFirstAsync<T>(sql, ...args);
  }

  async count(where?: WhereClause): Promise<number> {
    const db = await this.db();
    let sql = `SELECT COUNT(*) AS count FROM ${this.tableName}`;
    const args: (string | number | null)[] = [];
    if (where) {
      sql += ` WHERE ${where.clause}`;
      args.push(...where.args);
    }
    const row = await db.getFirstAsync<{ count: number }>(sql, ...args);
    return row?.count ?? 0;
  }

  async update(id: number, data: Partial<Omit<T, 'id'>>): Promise<void> {
    const db = await this.db();
    const entries = Object.entries(data);
    if (!entries.length) return;
    const set = entries.map(([k]) => `${k} = ?`).join(', ');
    const values = [...entries.map(([, v]) => v), id] as (string | number | null)[];
    await db.runAsync(`UPDATE ${this.tableName} SET ${set} WHERE id = ?`, ...values);
  }

  async upsert(data: Omit<T, 'id'>, conflictColumns: string[]): Promise<number> {
    const db = await this.db();
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(data) as (string | number | null)[];
    const updateSet = keys
      .filter((k) => !conflictColumns.includes(k))
      .map((k) => `${k} = excluded.${k}`)
      .join(', ');
    const result = await db.runAsync(
      `INSERT INTO ${this.tableName} (${keys.join(', ')})
       VALUES (${placeholders})
       ON CONFLICT(${conflictColumns.join(', ')}) DO UPDATE SET ${updateSet}`,
      ...values,
    );
    return result.lastInsertRowId;
  }

  async delete(id: number): Promise<void> {
    const db = await this.db();
    await db.runAsync(`DELETE FROM ${this.tableName} WHERE id = ?`, id);
  }

  async withTransaction<R>(fn: () => Promise<R>): Promise<R> {
    const db = await this.db();
    await db.execAsync('BEGIN');
    try {
      const result = await fn();
      await db.execAsync('COMMIT');
      return result;
    } catch (e) {
      await db.execAsync('ROLLBACK');
      throw e;
    }
  }

  private buildSelect(options: FindOptions): { sql: string; args: (string | number | null)[] } {
    const args: (string | number | null)[] = [];
    let sql = `SELECT * FROM ${this.tableName}`;
    if (options.where) {
      sql += ` WHERE ${options.where.clause}`;
      args.push(...options.where.args);
    }
    if (options.orderBy) sql += ` ORDER BY ${options.orderBy.column} ${options.orderBy.direction ?? 'ASC'}`;
    if (options.limit !== undefined) sql += ` LIMIT ${options.limit}`;
    if (options.offset !== undefined) sql += ` OFFSET ${options.offset}`;
    return { sql, args };
  }
}
