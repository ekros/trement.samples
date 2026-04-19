import React from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import ClientPage from "./[...urlSegments]/client-page";
import { PageQuery, PageQueryVariables } from "@/tina/__generated__/types";

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function Home() {
  let data;
  try {
    data = await client.queries.page({
      relativePath: `home.mdx`,
    });
  } catch (error) {
    console.warn("Failed to fetch home page data, using defaults:", error);
    data = {
      query: "",
      data: {
        page: {
          __typename: "Page" as const,
          id: "home",
          _sys: {
            __typename: "SystemInfo" as const,
            filename: "home",
            basename: "home",
            breadcrumbs: ["home"],
            path: "content/pages/home.mdx",
            relativePath: "home.mdx",
            extension: ".mdx",
            template: "page"
          },
          title: "Welcome",
          body: "Welcome to our site",
          blocks: []
        }
      },
      variables: {
        relativePath: "home.mdx"
      }
    } as { query: string; data: PageQuery; variables: PageQueryVariables };
  }

  return (
    <Layout rawPageData={data}>
      <ClientPage {...data} />
    </Layout>
  );
}
