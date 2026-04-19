'use client';

import type { Template } from 'tinacms';

type SpacerBlockData = {
    height?: string | null;
};

export const Spacer = ({ data }: { data: SpacerBlockData }) => {
    return <div style={{ height: data.height || '100px' }} aria-hidden='true' />;
};

export const spacerBlockSchema: Template = {
    name: 'spacer',
    label: 'Spacer',
    ui: {
        previewSrc: '/blocks/content.png',
        defaultItem: {
            height: '50px',
        },
    },
    fields: [
        {
            type: 'string',
            label: 'Height',
            name: 'height',
            description: 'Any valid CSS height value, e.g. 100px, 8rem, or 10vh.',
        },
    ],
};