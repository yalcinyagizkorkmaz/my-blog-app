import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

let db = null;

async function getDb() {
    if (!db) {
        const dbPath = path.join(process.cwd(), "blog.db");
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        // Tablo yoksa oluştur
        await db.exec(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
    return db;
}

export async function GET() {
    try {
        const db = await getDb();
        const result = await db.all("SELECT * FROM blogs");
        return Response.json(result);
    } catch (error) {
        console.error("GET isteği hatası:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const db = await getDb();
        const { title, content } = await request.json();
        
        const result = await db.run(
            "INSERT INTO blogs (title, content) VALUES (?, ?)",
            [title, content]
        );
        
        return Response.json({ 
            id: result.lastID,
            title,
            content
        });
    } catch (error) {
        console.error("POST isteği hatası:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}