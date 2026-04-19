import React from 'react';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import PostClientPage from './client-page';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>;
}) {
  const resolvedParams = await params;
  const filepath = resolvedParams.urlSegments.join('/');
  
  try {
    const data = await client.queries.post({
      relativePath: `${filepath}.mdx`,
    });

    return (
      <Layout rawPageData={data}>
        <PostClientPage {...data} />
      </Layout>
    );
  } catch (error) {
    console.warn(`Failed to fetch post ${filepath}:`, error);
    // Return minimal valid structure on error
    return (
      <Layout rawPageData={{}}>
        <div className="p-8 text-center">
          <h1>Post not found</h1>
          <p>{filepath}</p>
        </div>
      </Layout>
    );
  }
}

// Dynamic rendering enabled - no need for generateStaticParams
// export async function generateStaticParams() { ... }
