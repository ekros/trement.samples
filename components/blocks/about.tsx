'use client';
import React from 'react';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { Template } from 'tinacms';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { sectionBlackGlassSchemaField, sectionBlockSchemaField } from '../layout/section';
import { scriptCopyBlockSchema, ScriptCopyBtn } from '../magicui/script-copy-btn';
import { PageBlocksAbout } from '@/tina/__generated__/types';
import { FaInstagram, FaLinkedin, FaYoutube, FaGithub, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { useLayout } from '../layout/layout-context';
import { useLanguage } from './hooks/useLanguage';
import { parseMultiLingualText } from '@/lib/client-utils';
import { Callout } from './callout';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
const VIDEO_FILE_EXTENSIONS = new Set(['mp4', 'webm', 'ogg', 'mov', 'm4v', 'mkv']);

const getPathnameFromUrl = (url: string) => {
  try {
    return new URL(url, 'https://example.com').pathname;
  } catch {
    return url;
  }
};

const isVideoByExtension = (url: string) => {
  const pathname = getPathnameFromUrl(url).split(/[?#]/)[0] || '';
  const extension = pathname.split('.').pop()?.toLowerCase();
  return Boolean(extension && VIDEO_FILE_EXTENSIONS.has(extension));
};

interface AboutProps {
  data: PageBlocksAbout;
  onImageIndexChange?: (index: number) => void;
  autoplayDelayMs?: number;
  mobileImageFirst?: boolean;
  activeImageIndex?: number;
}

export const About = ({ data, onImageIndexChange, autoplayDelayMs, mobileImageFirst = false, activeImageIndex }: AboutProps) => {
  const lang = useLanguage();
  const [isVisible, setIsVisible] = React.useState(false);
  const imagePosition = ((data as PageBlocksAbout & { imagePosition?: 'left' | 'right' }).imagePosition ?? 'left');
  const autoplayDelayFromSchema = (data as PageBlocksAbout & { autoplayDelayMs?: number | null }).autoplayDelayMs;
  const effectiveAutoplayDelayMs = autoplayDelayMs ?? autoplayDelayFromSchema ?? undefined;
  const autoplayEnabled = Boolean(effectiveAutoplayDelayMs && effectiveAutoplayDelayMs > 0);
  const autoplayPlugin = React.useMemo(
    () => (autoplayEnabled ? Autoplay({ delay: effectiveAutoplayDelayMs!, stopOnInteraction: true, stopOnMouseEnter: true }) : undefined),
    [autoplayEnabled, effectiveAutoplayDelayMs]
  );
  const imageUrls = React.useMemo(() => {
    const blockData = data as PageBlocksAbout & { imageUrls?: string[]; imageUrl?: string | null };
    const images = blockData.imageUrls
      ?.map((url) => url?.trim())
      .filter((url): url is string => Boolean(url));

    if (images?.length) {
      return images;
    }

    if (blockData.imageUrl?.trim()) {
      return [blockData.imageUrl.trim()];
    }

    return ['/avatar.webp'];
  }, [(data as PageBlocksAbout & { imageUrls?: string[]; imageUrl?: string | null }).imageUrls, (data as PageBlocksAbout & { imageUrl?: string | null }).imageUrl]);
  const mediaItems = React.useMemo(
    () => imageUrls.map((url) => ({ url, isVideo: isVideoByExtension(url) })),
    [imageUrls]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
  }, autoplayPlugin ? [autoplayPlugin] : []);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(imageUrls.length > 1);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [scrollSnapPoints, setScrollSnapPoints] = React.useState<number[]>([]);

  React.useEffect(() => {
    setIsVisible(false);
    const animationFrame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [data]);

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const updateButtons = () => {
      const activeIndex = emblaApi.selectedScrollSnap();
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedImageIndex(activeIndex);
      onImageIndexChange?.(activeIndex);
    };

    setScrollSnapPoints(emblaApi.scrollSnapList());
    updateButtons();
    emblaApi.on('select', updateButtons);
    emblaApi.on('reInit', updateButtons);

    return () => {
      emblaApi.off('select', updateButtons);
      emblaApi.off('reInit', updateButtons);
    };
  }, [emblaApi, imageUrls, onImageIndexChange]);

  React.useEffect(() => {
    if (!emblaApi || typeof activeImageIndex !== 'number' || imageUrls.length === 0) {
      return;
    }

    const targetIndex = Math.max(0, Math.min(activeImageIndex, imageUrls.length - 1));
    if (emblaApi.selectedScrollSnap() !== targetIndex) {
      emblaApi.scrollTo(targetIndex);
    }
  }, [activeImageIndex, emblaApi, imageUrls.length]);

  const aboutBodyEN = React.useMemo(() => parseMultiLingualText(data.bodyEN as string, lang), [data.bodyEN, lang]);
  const aboutBodyES = React.useMemo(() => parseMultiLingualText(data.bodyES as string, lang), [data.bodyES, lang]);
  const aboutTitle = React.useMemo(() => parseMultiLingualText(data.title as string, lang), [data.title, lang]);
  const imageMobileOrderClass = mobileImageFirst ? 'order-1' : 'order-2';
  const textMobileOrderClass = mobileImageFirst ? 'order-2' : 'order-1';
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
    github: FaGithub,
    twitter: FaTwitter,
    whatsapp: FaWhatsapp,
    tiktok: SiTiktok,
  };

  const applyParagraphClassname = () => {
    if (imagePosition === 'right') {
      return 'px-[10px] md:px-0 md:pl-5';
    } else {
      return 'px-[10px] md:px-0 md:pr-5';
    }
  };

  return (
    <Section
      background={data.background!}
      isBlackGlass={(data as any).isBlackGlass}
      style={{ padding: '5px' }}
      className={`prose prose-lg transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${mobileImageFirst ? 'pt-0' : ''}`}
      data-tina-field={tinaField(data, lang === "en" ? 'bodyEN' : 'bodyES')}
    >
      {/* display flex for two elements in horizontal */}
      <div className='flex flex-col md:flex-row md:gap-8 gap-0'>
        <div className={`${imageMobileOrderClass} relative flex-1 min-h-[330px] min-w-[200px] md:min-h-[330px] md:min-w-[300px] ${imagePosition === 'right' ? 'md:order-2' : 'md:order-1'}`}>
          <div className='relative h-full w-full'>
            <div className='h-full w-full overflow-hidden rounded-lg' ref={emblaRef} data-tina-field={tinaField(data as any, 'imageUrls')}>
              <div className='flex h-full'>
                {mediaItems.map((item, index) => (
                  <div key={`${item.url}-${index}`} className='relative h-full min-h-[330px] min-w-full'>
                    {item.isVideo ? (
                      <ReactPlayer
                        url={item.url}
                        width='100%'
                        height='100%'
                        playing
                        loop
                        controls={false}
                        muted
                        playsinline
                        style={{ minHeight: 330, minWidth: 200 }}
                      />
                    ) : (
                      <Image
                        src={item.url}
                        alt={`About Image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover rounded-t-lg"
                        style={{ minHeight: 330, minWidth: 200, objectPosition: `0px ${data.imageYOffset || -60}px` }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {imageUrls.length > 1 && (
              <>
                <Button
                  type='button'
                  variant='secondary'
                  size='icon'
                  className='absolute left-2 top-1/2 z-20 -translate-y-1/2'
                  onClick={() => emblaApi?.scrollPrev()}
                  disabled={!canScrollPrev}
                  aria-label='Previous image'
                >
                  <ChevronLeft className='size-5' />
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  size='icon'
                  className='absolute right-2 top-1/2 z-20 -translate-y-1/2'
                  onClick={() => emblaApi?.scrollNext()}
                  disabled={!canScrollNext}
                  aria-label='Next image'
                >
                  <ChevronRight className='size-5' />
                </Button>
                <div className='absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5'>
                  {scrollSnapPoints.map((_, index) => (
                    <button
                      key={`about-carousel-dot-${index}`}
                      type='button'
                      className={`h-2.5 w-2.5 rounded-full border border-border transition-colors ${index === selectedImageIndex ? 'bg-primary' : 'bg-background/80'}`}
                      onClick={() => emblaApi?.scrollTo(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {data.socialNetworks?.length &&
            <div style={{ top: "32px" }} className="absolute bottom-0 left-0 right-0 h-8 bg-black/30 backdrop-blur-3x1 rounded-t-lg flex items-center justify-center space-x-2 overflow-hidden">
              {data.socialNetworks?.map((network) => {
                const [name, url] = network?.split(',') || [];
                const IconComponent = iconMap[name?.trim().toLowerCase() || ''];
                return (
                  <a
                    key={network}
                    href={url?.trim() || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                  >
                    {IconComponent && <IconComponent size={20} className="text-muted-foreground hover:text-primary" />}
                  </a>
                );
              })}
            </div>
          }
        </div>
        <div className={`${textMobileOrderClass} flex-2 text-color ${imagePosition === 'right' ? 'md:order-1' : 'md:order-2'}`}>
          {data.title && <h2 className="text-foreground text-left !text-[1.2rem] md:!text-2xl cool-underlined" data-tina-field={tinaField(data, 'title')}>{aboutTitle}</h2>}
          {
            typeof aboutBodyEN === 'string' && typeof aboutBodyES === 'string' ? (
              <p>{lang === "en" ? aboutBodyEN : aboutBodyES}</p>
            ) : (
              <div className={applyParagraphClassname()}>
                <TinaMarkdown
                  content={lang === "en" ? aboutBodyEN : aboutBodyES as any}
                  components={{
                    scriptCopyBlock: (props: any) => <ScriptCopyBtn {...props} />,
                  }}
                />
              </div>
            )
          }
          {
            data.exampleLinkUrl &&
            <Callout data={{ text: data.exampleLinkText, url: data.exampleLinkUrl, background: "transparent" }} />
          }
        </div>
      </div>
    </Section>
  );
};

export const aboutBlockSchema: Template = {
  name: 'about',
  label: 'About',
  ui: {
    previewSrc: '/blocks/about.png',
    defaultItem: {
      imagePosition: 'left',
      bodyEN: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.',
      bodyES: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.',
      autoplayDelayMs: 5000,
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    sectionBlackGlassSchemaField as any,
    {
      type: 'string',
      label: 'Title',
      name: 'title',
    },
    {
      type: 'rich-text',
      label: 'Body EN',
      name: 'bodyEN',
      templates: [scriptCopyBlockSchema],
    },
    {
      type: 'rich-text',
      label: 'Body ES',
      name: 'bodyES',
      templates: [scriptCopyBlockSchema],
    },
    {
      type: 'image',
      label: 'Image Url',
      name: 'imageUrl',
    },
    {
      type: 'image',
      label: 'Image Urls',
      name: 'imageUrls',
      list: true,
    },
    {
      type: 'string',
      label: 'Image Position',
      name: 'imagePosition',
      options: ['left', 'right'],
      ui: {
        component: 'radio-group',
      },
    },
    {
      type: 'string',
      label: 'Social Networks',
      name: 'socialNetworks',
      list: true,
      ui: {
        defaultItem: ['instagram'],
      },
    },
    {
      type: 'number',
      label: 'Image Y offset',
      name: 'imageYOffset',
    },
    {
      type: 'number',
      label: 'Autoplay Delay (ms) - Set to 0 or leave empty to disable autoplay',
      name: 'autoplayDelayMs',
    },
    {
      type: 'string',
      label: 'Example link text',
      name: 'exampleLinkText',
    },
    {
      type: 'string',
      label: 'Example link url',
      name: 'exampleLinkUrl',
    }
  ],
};
