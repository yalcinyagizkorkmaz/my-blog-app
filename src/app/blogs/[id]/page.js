'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogDetail({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log("Blog detayı çekiliyor...");
        const response = await fetch(`/api/blogs/${params.id}`, {
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
        console.log("Alınan blog detayı:", data);
        setBlog(data);
      } catch (err) {
        console.error("Hata detayı:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

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
          <Link href="/blogs" className="mt-4 inline-block text-blue-500 hover:text-blue-700">
            Blog listesine dön
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Blog yazısı bulunamadı</h2>
          <Link href="/blogs" className="mt-4 inline-block text-blue-500 hover:text-blue-700">
            Blog listesine dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Blog listesine dön
        </Link>
        
        <article className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-white hover:border-blue-200 transition-all duration-300">
          {blog.image && (
            <div className="relative h-96 w-full">
              <Image
                src={`/${blog.image}`}
                alt={blog.title}
                fill
                className="object-cover"
                priority={true}
              />
            </div>
          )}
          
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
            
            <div className="flex items-center text-gray-500 mb-8">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={blog.createdAt}>
                {new Date(blog.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{blog.content}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 