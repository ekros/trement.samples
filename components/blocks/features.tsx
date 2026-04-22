"use client";
import {
  PageBlocksFeatures,
  PageBlocksFeaturesItems,
} from "../../tina/__generated__/types";
import type { Template } from 'tinacms';
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Icon } from "../icon";
import { iconSchema } from "../../tina/fields/icon";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Section } from "../layout/section";
import { sectionBlackGlassSchemaField, sectionBlockSchemaField } from '../layout/section';
import { useLanguage } from './hooks/useLanguage';
import { parseMultiLingualText } from '../../lib/client-utils';

export const Features = ({ data }: { data: PageBlocksFeatures }) => {
  const language = useLanguage();
  return (
    <Section background={data.background!} isBlackGlass={(data as any).isBlackGlass}>
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 data-tina-field={tinaField(data, 'title')} className="text-balance text-4xl font-semibold lg:text-5xl">{parseMultiLingualText(data.title, language)}</h2>
          <p data-tina-field={tinaField(data, 'description')} className="mt-4">{parseMultiLingualText(data.description, language)}</p>
        </div>
        <Card className="@min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16">
          {data.items &&
            data.items.map(function (block, i) {
              return <Feature key={i} language={language} {...block!} />;
            })}
        </Card>
      </div>
    </Section>
  )
}

const CardDecorator = ({
  children,
  showGridEffect = false,
}: {
  children: React.ReactNode;
  showGridEffect?: boolean;
}) => (
  <div
    className={`relative mx-auto size-36 duration-200 ${showGridEffect
      ? '[--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]'
      : 'flex items-center justify-center'
      }`}
  >
    {showGridEffect && (
      <>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div aria-hidden className="bg-radial to-background absolute inset-0 from-transparent to-75%" />
      </>
    )}
    <div
      className={`${showGridEffect
        ? 'bg-background absolute inset-0 m-auto flex size-12 items-center justify-center'
        : 'flex size-full items-center justify-center'
        } ${showGridEffect ? 'border-l border-t' : ''}`}
    >
      {children}
    </div>
  </div>
)

export const Feature: React.FC<PageBlocksFeaturesItems & { language?: string }> = (data) => {
  const language = data.language || 'es';
  return (
    <div className="group shadow-zinc-950/5">
      <CardHeader className="pb-3">
        <CardDecorator showGridEffect={Boolean(data.showGridEffect)}>
          {data.icon && (
            <Icon
              tinaField={tinaField(data, "icon")}
              data={{ size: "large", ...data.icon }}
            />
          )}
        </CardDecorator>

        <h3
          data-tina-field={tinaField(data, "title")}
          className="mt-6 font-medium"
        >
          {parseMultiLingualText(data.title, language)}
        </h3>
      </CardHeader>

      <CardContent className="text-sm pb-8">
        <TinaMarkdown
          data-tina-field={tinaField(data, "text")}
          content={parseMultiLingualText(data.text, language) as any}
        />
      </CardContent>
    </div>
  );
};

const defaultFeature = {
  title: "Here's Another Feature",
  text: "This is where you might talk about the feature, if this wasn't just filler text.",
  showGridEffect: false,
  icon: {
    name: "Tina",
    color: "white",
    style: "float",
  }
};

export const featureBlockSchema: Template = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      title: 'Built to cover your needs',
      description: 'We have a lot of features to cover your needs',
      items: [defaultFeature, defaultFeature, defaultFeature],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    sectionBlackGlassSchemaField as any,
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
    },
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title,
          };
        },
        defaultItem: {
          ...defaultFeature,
        },
      },
      fields: [
        iconSchema as any,
        {
          type: "boolean",
          label: "Show Grid Effect",
          name: "showGridEffect",
          description: "Show the decorative grid background and corner border behind the icon.",
        },
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "rich-text",
          label: "Text",
          name: "text",
        },
      ],
    },
  ],
};
