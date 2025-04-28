import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export async function GET(request, { params }) {
    const { id } = params;
    let db;
    
    try {
        const dbPath = path.join(process.cwd(), "blog.db");
        console.log("Veritabanı yolu:", dbPath);

        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Tek bir blog yazısını çek
        const blog = await db.get("SELECT * FROM blogs WHERE id = ?", [id]);
        console.log("Blog verisi:", blog);

        if (!blog) {
            return new Response(JSON.stringify({ 
                error: "Blog yazısı bulunamadı"
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify(blog), {
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

export async function PUT(request, { params }) {
    const { id } = params;
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
            "UPDATE blogs SET title = ?, content = ?, image = ? WHERE id = ?",
            [title, content, image, id]
        );

        if (result.changes === 0) {
            return new Response(JSON.stringify({ 
                error: "Blog yazısı bulunamadı"
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ 
            id,
            title,
            content,
            image
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("PUT hatası:", error);
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

export async function DELETE(request, { params }) {
    const { id } = params;
    let db;
    
    try {
        const dbPath = path.join(process.cwd(), "blog.db");
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const result = await db.run("DELETE FROM blogs WHERE id = ?", [id]);

        if (result.changes === 0) {
            return new Response(JSON.stringify({ 
                error: "Blog yazısı bulunamadı"
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ 
            message: "Blog yazısı başarıyla silindi",
            id
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("DELETE hatası:", error);
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