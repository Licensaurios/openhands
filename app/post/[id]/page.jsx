// app/resources/[id]/page.js
import PostClient from "./PostClient";

export async function generateMetadata({ params }) {
   const { id } = await params;
  const res = await fetch(`https://openhands.space/api/resources/${id}`, {
    cache: "no-store",
  });
  const resource = await res.json();

  return {
    title: resource.title,
    description: resource.descripcion,
    openGraph: {
      title: resource.title,
      description: resource.descripcion,
      url: `https://openhands.space/resource/${id}`,
    },
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const res = await fetch(`https://openhands.space/api/resources/${id}`, {
    cache: "no-store",
  });
  const post = await res.json();

//  console.log(post)
  return <PostClient initialPost={post} />;

}