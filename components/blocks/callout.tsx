import React from 'react';
import Link from 'next/link';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { PageBlocksCallout } from '@/tina/__generated__/types';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { AnimatedGroup } from '../motion-primitives/animated-group';
import { Section, sectionBlockSchemaField } from '../layout/section';
import type { Transition } from 'motion/react';
import { useLanguage } from './hooks/useLanguage';
import { parseMultiLingualText } from '@/lib/client-utils';

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            } as Transition,
        },
    },
};

export const Callout = ({ data, className = '' }: { data: PageBlocksCallout; className?: string }) => {
    const text = React.useMemo(() => parseMultiLingualText(data.text!, useLanguage()), [data.text]);
    const calloutData = data as PageBlocksCallout & { useArrowDown?: boolean; backgroundColor?: string | null; borderColor?: string | null };
    const useArrowDown = calloutData.useArrowDown ?? false;
    return (
        <Section background={data.background!} className='py-6'>
            <AnimatedGroup variants={transitionVariants}>
                <Link
                    data-tina-field={tinaField(data, 'url')}
                    href={data.url!}
                    style={{ background: calloutData.backgroundColor || '', borderColor: calloutData.borderColor || '' }}
                    className={`bg-accent-color hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950 ${className}`}
                    target={data.newTab ? '_blank' : '_self'}
                >
                    <span data-tina-field={tinaField(data, 'text')} className='text-foreground text-sm'>
                        {text}
                    </span>
                    <span className='dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700'></span>

                    {useArrowDown ? (
                        <div className='bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500'>
                            <div className='flex h-12 flex-col -translate-y-1/2 duration-500 ease-in-out group-hover:translate-y-0'>
                                <span className='flex size-6'>
                                    <ArrowDown className='text-foreground m-auto size-3' />
                                </span>
                                <span className='flex size-6'>
                                    <ArrowDown className='text-foreground m-auto size-3' />
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500'>
                            <div className='flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0'>
                                <span className='flex size-6'>
                                    <ArrowRight className='text-foreground m-auto size-3' />
                                </span>
                                <span className='flex size-6'>
                                    <ArrowRight className='text-foreground m-auto size-3' />
                                </span>
                            </div>
                        </div>
                    )}
                </Link>
            </AnimatedGroup>
        </Section>
    );
};

export const calloutBlockSchema: Template = {
    name: 'callout',
    label: 'Callout',
    ui: {
        previewSrc: '/blocks/callout.png',
        defaultItem: {
            url: 'https://tina.io/editorial-workflow',
            text: 'Support for live editing and editorial workflow',
        },
    },
    fields: [
        sectionBlockSchemaField as any,
        {
            type: 'string',
            label: 'Text',
            name: 'text',
        },
        {
            type: 'string',
            label: 'Url',
            name: 'url',
        },
        {
            type: 'boolean',
            label: 'Open in new tab',
            name: 'newTab'
        },
        {
            type: 'boolean',
            label: 'Use arrow down',
            name: 'useArrowDown'
        },
        {
            type: 'string',
            label: 'Background Color',
            name: 'backgroundColor',
        },
        {
            type: 'string',
            label: 'Border Color',
            name: 'borderColor',
        }
    ],
};
