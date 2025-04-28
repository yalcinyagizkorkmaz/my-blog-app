import Image from "next/image";

async function getBlogs() {
  const res = await fetch('http://localhost:3000/api/blogs', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Veriler yüklenemedi');
  }
  return res.json();
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog Yazıları</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div key={blog.id} className="border rounded-lg p-6 shadow-md">
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
