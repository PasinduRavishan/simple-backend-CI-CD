import RepoBase from './RepoBase.js';
import { query } from '../db/connection.js';


export default class BookRepository extends RepoBase {
  constructor() {
    super('books');
  }

  


  
  async save(book) {
    try {
      if (!book.title || !book.author) {
        throw new Error('Title and author are required');
      }

      const sql = `
        INSERT INTO ${this.tableName} (title, author, year, summary)
        VALUES (?, ?, ?, ?)
      `;
      const params = [book.title, book.author, book.year || null, book.summary || null];
      
      const result = await query(sql, params);
      
      return {
        id: result.insertId,
        title: book.title,
        author: book.author,
        year: book.year || null,
        summary: book.summary || null
      };
    } catch (error) {
      console.error('Error saving book:', error.message);
      throw error;
    }
  }

  


  async retrieveAll(searchParams = {}) {
    try {
      let sql = `SELECT * FROM ${this.tableName}`;
      const params = [];
      const conditions = [];

      // Build WHERE clause based on search parameters
      if (searchParams.id) {
        conditions.push('id = ?');
        params.push(searchParams.id);
      }
      if (searchParams.author) {
        conditions.push('author LIKE ?');
        params.push(`%${searchParams.author}%`);
      }
      if (searchParams.year) {
        conditions.push('year = ?');
        params.push(searchParams.year);
      }
      if (searchParams.title) {
        conditions.push('title LIKE ?');
        params.push(`%${searchParams.title}%`);
      }

      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }

      sql += ' ORDER BY created_at DESC';

      const results = await query(sql, params);
      return results;
    } catch (error) {
      console.error('Error retrieving all books:', error.message);
      throw error;
    }
  }

  

  
  async retrieveById(id) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
      const results = await query(sql, [id]);
      
      return results.length > 0 ? results[0] : undefined;
    } catch (error) {
      console.error(`Error retrieving book by ID ${id}:`, error.message);
      throw error;
    }
  }

  


  async update(book) {
    try {
      if (!book.id) {
        throw new Error('Book ID is required for update');
      }

      const updates = [];
      const params = [];

      // Build SET clause dynamically based on provided fields
      if (book.title !== undefined) {
        updates.push('title = ?');
        params.push(book.title);
      }
      if (book.author !== undefined) {
        updates.push('author = ?');
        params.push(book.author);
      }
      if (book.year !== undefined) {
        updates.push('year = ?');
        params.push(book.year);
      }
      if (book.summary !== undefined) {
        updates.push('summary = ?');
        params.push(book.summary);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      params.push(book.id);

      const sql = `
        UPDATE ${this.tableName}
        SET ${updates.join(', ')}
        WHERE id = ?
      `;

      const result = await query(sql, params);
      return result.affectedRows;
    } catch (error) {
      console.error('Error updating book:', error.message);
      throw error;
    }
  }

  

  async delete(id) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
      const result = await query(sql, [id]);
      
      return result.affectedRows;
    } catch (error) {
      console.error(`Error deleting book with ID ${id}:`, error.message);
      throw error;
    }
  }

 
  
  async deleteAll() {
    try {
      const sql = `DELETE FROM ${this.tableName}`;
      const result = await query(sql);
      
      console.log(`🗑️  Deleted ${result.affectedRows} book(s) from database`);
      return result.affectedRows;
    } catch (error) {
      console.error('Error deleting all books:', error.message);
      throw error;
    }
  }
}
