export default function Blogs() {
  const blogs = [
    { id: 1, title: "İlk Blog Yazısı" },
    { id: 2, title: "İkinci Blog Yazısı" },
    { id: 3, title: "Üçüncü Blog Yazısı" },
  ];

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Blog Yazıları</h1>
      <div className="grid gap-4">
        {blogs.map((blog) => (
          <a
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="p-4 border rounded-lg hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold">{blog.title}</h2>
          </a>
        ))}
      </div>
    </div>
  );
} 