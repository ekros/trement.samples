"use client";
import { useEffect } from "react";
import { useTina } from "tinacms/dist/react";
import { Blocks } from "@/components/blocks";
import { PageQuery } from "@/tina/__generated__/types";
import ErrorBoundary from "@/components/error-boundary";

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

  useEffect(() => {
    const body = document.body;
    const existingThemeClasses = Array.from(body.classList).filter((className) => className.startsWith("theme-"));

    existingThemeClasses.forEach((className) => body.classList.remove(className));

    if (theme) {
      body.classList.add(`theme-${theme}`);
    }

    return () => {
      if (theme) {
        body.classList.remove(`theme-${theme}`);
      }
    };
  }, [theme]);

  return (
    <div>
      <ErrorBoundary>
        <Blocks {...data?.page} />
      </ErrorBoundary>
    </div>
  );
}
