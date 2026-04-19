'use client';
import React from 'react';

import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { sectionBlockSchemaField } from '../layout/section';
import { PageBlocksServices, PageBlocksSlideshow } from '@/tina/__generated__/types';
import { useLanguage } from './hooks/useLanguage';
import { parseMultiLingualText } from '@/lib/client-utils';
import { About } from './about';

const parseStringList = (value?: Array<string | null> | string | null) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => (typeof item === 'string' ? item.trim() : ''))
            .filter((item): item is string => Boolean(item));
    }
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
};

interface SlideshowProps {
    data: PageBlocksSlideshow | PageBlocksServices;
    embedded?: boolean;
    selectedServiceIndex?: number;
    onSelectedServiceIndexChange?: (index: number) => void;
}

export const Slideshow = ({
    data,
    embedded = false,
    selectedServiceIndex,
    onSelectedServiceIndexChange,
}: SlideshowProps) => {
    const lang = useLanguage();
    const [internalSelectedServiceIndex, setInternalSelectedServiceIndex] = React.useState(0);
    const sectionRef = React.useRef<HTMLElement | null>(null);
    const hasAutoSelectedFromHashRef = React.useRef(false);
    const isControlled = typeof selectedServiceIndex === 'number';
    const currentSelectedServiceIndex = isControlled ? selectedServiceIndex : internalSelectedServiceIndex;

    const setSelectedIndex = React.useCallback((index: number) => {
        if (!isControlled) {
            setInternalSelectedServiceIndex(index);
        }
        onSelectedServiceIndexChange?.(index);
    }, [isControlled, onSelectedServiceIndexChange]);

    const slideshowTitle = React.useMemo(() => parseMultiLingualText(data.title, lang), [data.title, lang]);
    const images = parseStringList(data.imageUrls);
    const serviceItems = parseStringList(data.services);
    const servicesDescriptions = parseStringList(data.servicesDescription);
    const exampleLinkTexts = parseStringList(data.exampleLinkTexts);
    const imageYOffsets = data.imageYOffsets;

    const safeIndex = Math.max(0, Math.min(currentSelectedServiceIndex, Math.max(0, images.length - 1)));
    const selectedImageYOffset = Number(imageYOffsets?.[safeIndex]);
    const selectedServiceDescription = parseMultiLingualText(
        (servicesDescriptions[safeIndex]?.trim() || serviceItems[safeIndex]?.trim() || ''),
        lang
    );

    React.useEffect(() => {
        if (embedded || isControlled || typeof window === 'undefined' || !sectionRef.current || images.length === 0) {
            return;
        }

        const trySelectFromHash = (isIntersecting: boolean) => {
            if (!isIntersecting) {
                return;
            }

            if (window.location.hash !== '#services') {
                hasAutoSelectedFromHashRef.current = false;
                return;
            }

            if (hasAutoSelectedFromHashRef.current) {
                return;
            }

            const targetIndex = Math.min(4, images.length - 1);
            setSelectedIndex(targetIndex);
            hasAutoSelectedFromHashRef.current = true;
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                trySelectFromHash(Boolean(entry?.isIntersecting));
            },
            { threshold: 0.35 }
        );

        observer.observe(sectionRef.current);
        trySelectFromHash(true);

        return () => {
            observer.disconnect();
        };
    }, [images.length]);

    if (embedded) {
        return (
            <About
                data={{
                    title: serviceItems?.[safeIndex] || data.title,
                    bodyES: servicesDescriptions?.[safeIndex] || '',
                    bodyEN: servicesDescriptions?.[safeIndex] || '',
                    imageUrls: images,
                    imageYOffset: Number.isFinite(selectedImageYOffset) ? selectedImageYOffset : undefined,
                    exampleLinkText: exampleLinkTexts?.[safeIndex],
                    exampleLinkUrl: data.exampleLinkUrls?.[safeIndex],
                }}
                onImageIndexChange={setSelectedIndex}
                activeImageIndex={safeIndex}
                autoplayDelayMs={8000}
                mobileImageFirst
            />
        );
    }

    return (
        <Section ref={sectionRef} background={data.background!} className='prose prose-lg mu-8 pt-0'>
            {data.title && (
                <h2 className='text-foreground cool-underlined' data-tina-field={tinaField(data, 'title')}>
                    {slideshowTitle}
                </h2>
            )}

            <About
                data={{
                    title: serviceItems?.[safeIndex] || data.title,
                    bodyES: servicesDescriptions?.[safeIndex] || '',
                    bodyEN: servicesDescriptions?.[safeIndex] || '',
                    imageUrls: images,
                    imageYOffset: Number.isFinite(selectedImageYOffset) ? selectedImageYOffset : undefined,
                    exampleLinkText: exampleLinkTexts?.[safeIndex],
                    exampleLinkUrl: data.exampleLinkUrls?.[safeIndex],
                }}
                onImageIndexChange={setSelectedIndex}
                activeImageIndex={safeIndex}
                autoplayDelayMs={10000}
                mobileImageFirst
            />
        </Section>
    );
};

export const slideshowBlockSchema: Template = {
    name: 'slideshow',
    label: 'Slideshow',
    ui: {
        previewSrc: '/blocks/services.png',
        defaultItem: {
            body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.',
        },
    },
    fields: [
        sectionBlockSchemaField as any,
        {
            type: 'string',
            label: 'Title',
            name: 'title',
        },
        {
            type: 'image',
            label: 'Image Urls',
            name: 'imageUrls',
            list: true,
        },
        {
            label: 'Services',
            name: 'services',
            type: 'string',
            list: true,
        },
        {
            label: 'Services Description',
            name: 'servicesDescription',
            type: 'string',
            list: true,
        },
        {
            type: 'string',
            label: 'Image Y offsets',
            name: 'imageYOffsets',
            list: true,
        },
        {
            type: 'string',
            label: 'Example Link Text',
            name: 'exampleLinkTexts',
            list: true,
        },
        {
            type: 'string',
            label: 'Example Link Urls',
            name: 'exampleLinkUrls',
            list: true,
        },
    ],
};
