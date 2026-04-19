import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { PageBlocksOpeningTimes } from "@/tina/__generated__/types";
import { Section } from "../layout/section";
import { sectionBlockSchemaField } from "../layout/section";
import { useLanguage } from "./hooks/useLanguage";
import { parseMultiLingualText } from "@/lib/client-utils";

const DAY_NAMES: Record<string, string[]> = {
    es: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
};

const CLOSED_LABEL: Record<string, string> = {
    es: "Cerrado",
    en: "Closed",
};

export const OpeningTimes = ({ data }: { data: PageBlocksOpeningTimes }) => {
    const lang = useLanguage();
    const dayNames = DAY_NAMES[lang] || DAY_NAMES.en;
    const closedLabel = CLOSED_LABEL[lang] || CLOSED_LABEL.en;

    return (
        <Section background={data.background!}>
            <div className="mx-auto max-w-2xl space-y-8 px-6">
                {data.title && (
                    <div className="text-center space-y-2">
                        <h2
                            className="text-4xl font-medium lg:text-5xl"
                            data-tina-field={tinaField(data, "title")}
                        >
                            {parseMultiLingualText(data.title, lang)}
                        </h2>
                        {data.description && (
                            <p
                                className="text-muted-foreground"
                                data-tina-field={tinaField(data, "description")}
                            >
                                {parseMultiLingualText(data.description, lang)}
                            </p>
                        )}
                    </div>
                )}

                <div className="divide-y">
                    {data.days?.map((day) => {
                        if (!day) return null;
                        const dayIndex = day.day ?? 0;
                        const name = dayNames[dayIndex] ?? dayNames[0];
                        return (
                            <div
                                key={dayIndex}
                                className="flex items-center justify-between py-3"
                            >
                                <span className="font-medium text-lg">{name}</span>
                                <span
                                    className={day.closed ? "text-muted-foreground italic" : ""}
                                    data-tina-field={tinaField(day, "hours")}
                                >
                                    {day.closed ? closedLabel : day.hours}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
};

export const openingTimesBlockSchema: Template = {
    name: "openingTimes",
    label: "Opening Times",
    ui: {
        previewSrc: "/blocks/opening-times.png",
        defaultItem: {
            title: "es::Horario de Apertura;;en::Opening Times",
            description: "es::Nuestro horario semanal;;en::Our weekly schedule",
            days: [
                { day: 0, hours: "9:00 - 21:00", closed: false },
                { day: 1, hours: "9:00 - 21:00", closed: false },
                { day: 2, hours: "9:00 - 21:00", closed: false },
                { day: 3, hours: "9:00 - 21:00", closed: false },
                { day: 4, hours: "9:00 - 21:00", closed: false },
                { day: 5, hours: "10:00 - 14:00", closed: false },
                { day: 6, hours: "", closed: true },
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
            label: "Days",
            name: "days",
            list: true,
            ui: {
                defaultItem: {
                    day: 0,
                    hours: "9:00 - 21:00",
                    closed: false,
                },
                itemProps: (item) => {
                    const dayLabels = [
                        "Monday / Lunes",
                        "Tuesday / Martes",
                        "Wednesday / Miércoles",
                        "Thursday / Jueves",
                        "Friday / Viernes",
                        "Saturday / Sábado",
                        "Sunday / Domingo",
                    ];
                    return {
                        label: dayLabels[item?.day ?? 0] || `Day ${item?.day}`,
                    };
                },
            },
            fields: [
                {
                    type: "number",
                    label: "Day of Week",
                    name: "day",
                    description: "0 = Monday, 1 = Tuesday, … 6 = Sunday",
                    ui: {
                        component: "select",
                        options: [
                            { label: "Monday / Lunes", value: 0 },
                            { label: "Tuesday / Martes", value: 1 },
                            { label: "Wednesday / Miércoles", value: 2 },
                            { label: "Thursday / Jueves", value: 3 },
                            { label: "Friday / Viernes", value: 4 },
                            { label: "Saturday / Sábado", value: 5 },
                            { label: "Sunday / Domingo", value: 6 },
                        ],
                    },
                },
                {
                    type: "string",
                    label: "Hours",
                    name: "hours",
                    description: 'e.g. "9:00 - 21:00"',
                },
                {
                    type: "boolean",
                    label: "Closed",
                    name: "closed",
                },
            ],
        },
    ],
};
