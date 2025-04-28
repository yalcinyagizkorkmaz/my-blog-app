import Image from "next/image";

export default async function Blog({ params }) {
    const blog_id= (await params).id;
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-blue-600">Blog {blog_id}</h1>
    </div>
  );
} 