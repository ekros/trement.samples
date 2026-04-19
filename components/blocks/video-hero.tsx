
'use client';
import * as React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { Template } from 'tinacms';
import { PageBlocksVideo_Hero } from '@/tina/__generated__/types';
import { Section } from '../layout/section';
import { sectionBlockSchemaField } from '../layout/section';
import { TextEffect } from '../motion-primitives/text-effect';
import { tinaField } from 'tinacms/dist/react';
import { Callout } from './callout';
import { useLanguage } from './hooks/useLanguage';
import { parseMultiLingualText } from '@/lib/client-utils';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export const VideoHero = ({ data }: { data: PageBlocksVideo_Hero }) => {
  const heroData = data as PageBlocksVideo_Hero & {
    useImage?: boolean;
    heroImageUrls?: Array<string | null> | string | null;
    slideDuration?: number | null;
    backdropDarkEffect?: boolean;
  };
  const imageUrls = React.useMemo(() => {
    const raw = heroData.heroImageUrls;
    if (Array.isArray(raw)) {
      return raw
        .map((url) => (typeof url === 'string' ? url.trim() : ''))
        .filter((url): url is string => Boolean(url));
    }

    if (raw) {
      const singleUrl = String(raw).trim();
      return singleUrl ? [singleUrl] : [];
    }

    return [];
  }, [heroData.heroImageUrls]);
  const slideDurationSeconds = React.useMemo(() => {
    const value = Number(heroData.slideDuration);
    if (!Number.isFinite(value) || value <= 0) {
      return 5;
    }
    return value;
  }, [heroData.slideDuration]);

  const imageCarouselAutoplay = React.useMemo(
    () => Autoplay({ delay: slideDurationSeconds * 1000, stopOnInteraction: false, stopOnMouseEnter: true }),
    [slideDurationSeconds]
  );
  const [emblaRef] = useEmblaCarousel({ loop: imageUrls.length > 1, align: 'start' }, [imageCarouselAutoplay]);

  if (!heroData.useImage && !data.url) {
    return null;
  }

  if (heroData.useImage && imageUrls.length === 0) {
    return null;
  }
  const lang = useLanguage();
  const headline = data.headline ? parseMultiLingualText(data.headline, lang) : undefined;
  const tagLine = data.tagline ? parseMultiLingualText(data.tagline, lang) : undefined;
  const calloutText = data.calloutText ? parseMultiLingualText(data.calloutText, lang) : undefined;
  const calloutText2 = data.calloutText2 ? parseMultiLingualText(data.calloutText2, lang) : undefined;

  return (
    <Section style={{ display: "flex", justifyContent: "center" }} background={data.background! || "none"} className={`aspect-video ${data.color} relative md:text-8x1 overflow-hidden`}>
      <div className='absolute inset-0 flex items-center justify-center z-10'>
        <div className='relative flex w-full items-center justify-center px-4'>
          {heroData.backdropDarkEffect && (
            <div className='pointer-events-none absolute inset-x-0 top-[calc(50%-7px)] h-[140px] -translate-y-1/2 bg-black/35 md:top-1/2 md:h-[260px]' />
          )}

          <div className='relative z-10 text-center text-foreground'>
            {data.headline && (
              <div data-tina-field={tinaField(data, 'headline')}>
                <TextEffect preset='fade-in-blur' speedSegment={0.3} as='h1' className='heading-shadow text-balance text-[1.9rem] sm:text-4xl md:text-7xl xl:text-[5.25rem] font-bold drop-shadow-lg'>
                  {headline}
                </TextEffect>
              </div>
            )}
            {data.tagline && (
              <div data-tina-field={tinaField(data, 'tagline')}>
                <TextEffect per='line' preset='fade-in-blur' speedSegment={0.3} delay={0.5} as='p' className='mx-auto max-w-2xl px-3 text-balance text-sm leading-relaxed sm:text-lg md:text-2xl md:leading-relaxed drop-shadow-md'>
                  {tagLine}
                </TextEffect>
              </div>
            )}
            {data.calloutText && data.calloutUrl && (
              <Callout data={{ text: calloutText, url: data.calloutUrl!, background: "none" }} />
            )}
            {data.calloutText2 && data.calloutUrl2 && (
              <Callout data={{ text: calloutText2, url: data.calloutUrl2!, background: "none" }} />
            )}
          </div>
        </div>
      </div>
      {heroData.useImage ? (
        <div
          ref={emblaRef}
          className='h-full w-full overflow-hidden'
          data-tina-field={tinaField(data, 'heroImageUrls')}
        >
          <div className='flex h-full'>
            {imageUrls.map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`} className='relative h-full min-w-full'>
                <Image
                  src={imageUrl}
                  alt={headline || `Hero image ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                  style={{ transform: `scale(${data.videoScale ?? 1})`, filter: `brightness(${data.brightness ?? 1})` }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ReactPlayer
          width="100vw"
          height='100%'
          style={{ transform: `scale(${data.videoScale ?? 1})`, filter: `brightness(${data.brightness ?? 1})` }}
          playing={data.autoPlay ?? true}
          loop={data.loop ?? true}
          controls={data.controls ?? false}
          url={data.url || undefined}
          muted={data.muted ?? true}
          playsinline /* fix for iOS autoplay */
        />
      )}
    </Section>
  );
};

export const videoHeroBlockSchema: Template = {
  name: 'video_hero',
  nameOverride: 'video-hero',
  label: 'Video Hero',
  ui: {
    previewSrc: '/blocks/video.png',
    defaultItem: {
      url: 'https://www.youtube.com/watch?v=j8egYW7Jpgk',
      autoPlay: true,
      muted: true,
      loop: true,
      controls: false,
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Color',
      name: 'color',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Tint', value: 'tint' },
        { label: 'Primary', value: 'primary' },
      ],
    },
    {
      type: 'string',
      label: 'Url',
      name: 'url',
    },
    {
      type: 'boolean',
      label: 'Use Image',
      name: 'useImage',
    },
    {
      type: 'image',
      label: 'Hero Image Urls',
      name: 'heroImageUrls',
      list: true,
    },
    {
      type: 'string',
      label: 'Headline',
      name: 'headline',
    },
    {
      type: 'string',
      label: 'Tagline',
      name: 'tagline',
    },
    {
      type: 'boolean',
      label: 'Auto Play',
      name: 'autoPlay',
    },
    {
      type: 'boolean',
      label: 'Muted',
      name: 'muted',
    },
    {
      type: 'boolean',
      label: 'Loop',
      name: 'loop',
    },
    {
      type: 'boolean',
      label: 'Controls',
      name: 'controls',
    },
    {
      type: 'string',
      label: 'Callout Text',
      name: 'calloutText',
    },
    {
      type: 'string',
      label: 'Callout Url',
      name: 'calloutUrl',
    },
    {
      type: 'string',
      label: 'Callout Text 2',
      name: 'calloutText2',
    },
    {
      type: 'string',
      label: 'Callout Url 2',
      name: 'calloutUrl2',
    },
    {
      type: 'number',
      label: 'Video Scale (1 = 100%)',
      name: 'videoScale',
    },
    {
      type: 'number',
      label: 'Brightness (1 = normal, <1 darker, >1 brighter)',
      name: 'brightness',
    },
    {
      type: 'number',
      label: 'Slide Duration (seconds, only for images)',
      name: 'slideDuration',
    },
    {
      type: 'boolean',
      label: 'Backdrop Dark Effect',
      name: 'backdropDarkEffect',
    }
  ],
};
