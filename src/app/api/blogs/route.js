import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export async function GET() {
    let db;
    try {
        const dbPath = path.join(process.cwd(), "blog.db");
        console.log("Veritabanı yolu:", dbPath);

        // Veritabanına bağlan
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Tabloyu kontrol et
        const tableInfo = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='blogs'");
        console.log("Tablo bilgisi:", tableInfo);

        if (tableInfo.length === 0) {
            // Tablo yoksa oluştur
            await db.exec(`
                CREATE TABLE blogs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    image TEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log("Tablo oluşturuldu");
        }

        // Verileri çek
        const blogs = await db.all("SELECT * FROM blogs ORDER BY id ASC");
        console.log("Çekilen blog sayısı:", blogs.length);
        console.log("Blog verileri:", JSON.stringify(blogs, null, 2));

        return new Response(JSON.stringify(blogs), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Hata detayı:", error);
        return new Response(JSON.stringify({ 
            error: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        if (db) {
            await db.close();
        }
    }
}

export async function POST(request) {
    let db;
    try {
        const dbPath = path.join(process.cwd(), "blog.db");
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const { title, content, image } = await request.json();
        
        if (!title || !content) {
            return new Response(JSON.stringify({ error: "Başlık ve içerik gereklidir" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        
        const result = await db.run(
            "INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)",
            [title, content, image]
        );
        
        return new Response(JSON.stringify({ 
            id: result.lastID,
            title,
            content,
            image
        }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("POST hatası:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        if (db) {
            await db.close();
        }
    }
}