'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log("Veriler çekiliyor...");
        const response = await fetch('/api/blogs', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        console.log("API yanıt durumu:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Alınan veriler:", data);
        
        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          throw new Error("Beklenmeyen veri formatı");
        }
      } catch (err) {
        console.error("Hata detayı:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-bold mb-2">Hata</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Henüz blog yazısı yok</h2>
          <p className="text-gray-600">İlk blog yazınızı ekleyin!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog Yazıları</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div key={blog.id} className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            {blog.image && (
              <div className="relative h-48 mb-4">
                <Image
                  src={`/images/${blog.image}`}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
            <p className="text-gray-600 mb-4">{blog.content}</p>
            <p className="text-sm text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
