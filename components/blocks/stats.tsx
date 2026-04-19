import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { PageBlocksStats } from "@/tina/__generated__/types";
import { Section } from "../layout/section";
import { sectionBlockSchemaField } from '../layout/section';
import { useLanguage } from './hooks/useLanguage';
import { parseMultiLingualText } from '@/lib/client-utils';

export const Stats = ({ data }: { data: PageBlocksStats }) => {
    const lang = useLanguage();
    return (
        <Section background={data.background!}>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
                    <h2 className="text-4xl font-medium lg:text-5xl" data-tina-field={tinaField(data, 'title')}>{parseMultiLingualText(data.title, lang)}</h2>
                    <p data-tina-field={tinaField(data, 'description')}>{parseMultiLingualText(data.description, lang)}</p>
                </div>

                <div className="grid divide-y *:text-center md:grid-cols-3 md:divide-x md:divide-y-0">
                    {data.stats?.map((stat) => (
                        <div key={stat?.type} className="space-y-4 py-4">
                            <div className="text-5xl font-bold" data-tina-field={tinaField(stat, 'stat')}>{stat!.stat}</div>
                            <p data-tina-field={tinaField(stat, 'type')}>{parseMultiLingualText(stat!.type, lang)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    )
}


export const statsBlockSchema: Template = {
    name: "stats",
    label: "Stats",
    ui: {
        previewSrc: "/blocks/stats.png",
        defaultItem: {
            title: "TinaCMS by the numbers",
            description: "TinaCMS is an open-source content management system that allows developers to create and manage content for their websites and applications. It provides a flexible and customizable framework for building content-driven applications.",
            stats: [
                {
                    stat: 12000,
                    type: "Stars on GitHub",
                },
                {
                    stat: 11000,
                    type: "Active Users",
                },
                {
                    stat: 22000,
                    type: "Powered Apps",
                },
            ],
        },
    },
    fields: [
        sectionBlockSchemaField as any,
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
            label: "Stats",
            name: "stats",
            list: true,
            ui: {
                defaultItem: {
                    stat: 12000,
                    type: "Stars on GitHub",
                },
                itemProps: (item) => {
                    return {
                        label: `${item.stat} ${item.type}`,
                    };
                },
            },
            fields: [
                {
                    type: "number",
                    label: "Stat",
                    name: "stat",
                },
                {
                    type: "string",
                    label: "Type",
                    name: "type",
                },
            ],
        },
    ],
};