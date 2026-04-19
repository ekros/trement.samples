"use client";
import { useTina } from "tinacms/dist/react";
import { Blocks } from "@/components/blocks";
import { PageQuery } from "@/tina/__generated__/types";
import ErrorBoundary from "@/components/error-boundary";
import { cn } from "@/lib/utils";

export interface ClientPageProps {
  data: {
    page: PageQuery["page"];
  };
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function ClientPage(props: ClientPageProps) {
  const { data } = useTina({ ...props });
  const theme = (data?.page as any)?.theme;
  return (
    <div className={cn(theme && `theme-${theme}`)}>
      <ErrorBoundary>
        <Blocks {...data?.page} />
      </ErrorBoundary>
    </div>
  );
}
