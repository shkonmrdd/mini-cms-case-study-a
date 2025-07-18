import sqlite3 from 'sqlite3';
import path from 'path';

// Define interfaces for our data models
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  category: string;
  created_at: string;
  updated_at: string;
  created_at_formatted: string;
  updated_at_formatted: string;
  is_featured: boolean;
}

export interface CreateNewsData {
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  category: string;
  is_featured?: boolean;
}

// Create database connection
const dbPath = path.join(__dirname, 'news.db');
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    image_url TEXT,
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN DEFAULT 0
  )`, (err: Error | null) => {
    if (err) {
      console.error('Error creating news table:', err.message);
    } else {
      console.log('News table created or already exists');
    }
  });
});

// Database helper functions
export const dbHelpers = {
  // Get all news with optional search and pagination
  getAllNews: (searchQuery: string = '', page: number = 1, limit: number = 10): Promise<NewsItem[]> => {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      let query = `
        SELECT *, 
               datetime(created_at) as created_at_formatted,
               datetime(updated_at) as updated_at_formatted
        FROM news 
      `;
      let params: (string | number)[] = [];
      
      if (searchQuery) {
        query += ` WHERE title LIKE ? OR content LIKE ? OR category LIKE ?`;
        params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
      }
      
      query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);
      
      db.all(query, params, (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as NewsItem[]);
        }
      });
    });
  },

  // Get news by ID
  getNewsById: (id: number): Promise<NewsItem | undefined> => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT *, 
                datetime(created_at) as created_at_formatted,
                datetime(updated_at) as updated_at_formatted
         FROM news WHERE id = ?`, 
        [id], 
        (err: Error | null, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as NewsItem | undefined);
          }
        }
      );
    });
  },

  // Create new news article
  createNews: (newsData: CreateNewsData): Promise<NewsItem & { id: number }> => {
    return new Promise((resolve, reject) => {
      const { title, content, summary, image_url, category, is_featured } = newsData;
      db.run(
        `INSERT INTO news (title, content, summary, image_url, category, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, content, summary, image_url, category, is_featured || 0],
        function(this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...newsData } as NewsItem & { id: number });
          }
        }
      );
    });
  },

  // Update news article
  updateNews: (id: number, newsData: CreateNewsData): Promise<{ changes: number }> => {
    return new Promise((resolve, reject) => {
      const { title, content, summary, image_url, category, is_featured } = newsData;
      db.run(
        `UPDATE news 
         SET title = ?, content = ?, summary = ?, image_url = ?, category = ?, 
             is_featured = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [title, content, summary, image_url, category, is_featured || 0, id],
        function(this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        }
      );
    });
  },

  // Delete news article
  deleteNews: (id: number): Promise<{ changes: number }> => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM news WHERE id = ?', [id], function(this: sqlite3.RunResult, err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  // Get featured news
  getFeaturedNews: (): Promise<NewsItem | null> => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT *, 
                datetime(created_at) as created_at_formatted
         FROM news 
         WHERE is_featured = 1 
         ORDER BY created_at DESC 
         LIMIT 1`, 
        (err: Error | null, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.length > 0 ? rows[0] as NewsItem : null);
          }
        }
      );
    });
  },

  // Get latest news (non-featured)
  getLatestNews: (limit: number = 4): Promise<NewsItem[]> => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT *, 
                datetime(created_at) as created_at_formatted
         FROM news 
         WHERE is_featured = 0 
         ORDER BY created_at DESC 
         LIMIT ?`, 
        [limit],
        (err: Error | null, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows as NewsItem[]);
          }
        }
      );
    });
  }
};

export { db };
export default { db, ...dbHelpers }; 