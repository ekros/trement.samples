'use client';
import React from 'react';

import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { sectionBlockSchemaField } from '../layout/section';
import { PageBlocksServices } from '@/tina/__generated__/types';
import { useLanguage } from './hooks/useLanguage';
import { parseMultiLingualText } from '@/lib/client-utils';
import { Slideshow } from './slideshow';

const parseStringList = (value?: string | string[] | null) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    return value.split(',');
  }
  return [];
};

export const Services = ({ data }: { data: PageBlocksServices }) => {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const servicesRef = React.useRef<HTMLDivElement>(null);
  const serviceItemRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const hasAutoSelectedFromHashRef = React.useRef(false);
  const [showLeftShadow, setShowLeftShadow] = React.useState(false);
  const [showRightShadow, setShowRightShadow] = React.useState(false);
  const [selectedServiceIndex, setSelectedServiceIndex] = React.useState<number | null>(0);
  const lang = useLanguage();

  const handleWheelScroll = React.useCallback((event: WheelEvent) => {
    const servicesElement = servicesRef.current;
    if (!servicesElement) return;
    if (servicesElement.scrollWidth <= servicesElement.clientWidth) return;

    const horizontalDelta = event.deltaY !== 0 ? event.deltaY : event.deltaX;
    if (horizontalDelta === 0) return;

    const previousScrollLeft = servicesElement.scrollLeft;
    servicesElement.scrollLeft += horizontalDelta;

    if (servicesElement.scrollLeft !== previousScrollLeft) {
      event.preventDefault();
    }
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!servicesRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = servicesRef.current;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(scrollWidth > clientWidth + scrollLeft);
    };
    const ref = servicesRef.current;
    if (ref) {
      handleScroll();
      ref.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      }
    };
  }, [data.services]);

  React.useEffect(() => {
    const servicesElement = servicesRef.current;
    if (!servicesElement) return;

    servicesElement.addEventListener('wheel', handleWheelScroll, { passive: false });

    return () => {
      servicesElement.removeEventListener('wheel', handleWheelScroll);
    };
  }, [handleWheelScroll]);

  React.useEffect(() => {
    if (selectedServiceIndex === null) return;

    const container = servicesRef.current;
    const item = serviceItemRefs.current[selectedServiceIndex];
    if (!container || !item) return;

    const itemStart = item.offsetLeft;
    const itemEnd = itemStart + item.offsetWidth;
    const viewportStart = container.scrollLeft;
    const viewportEnd = viewportStart + container.clientWidth;
    const edgePadding = 16;

    if (itemStart < viewportStart + edgePadding) {
      container.scrollTo({ left: Math.max(0, itemStart - edgePadding), behavior: 'smooth' });
      return;
    }

    if (itemEnd > viewportEnd - edgePadding) {
      container.scrollTo({ left: itemEnd - container.clientWidth + edgePadding, behavior: 'smooth' });
    }
  }, [selectedServiceIndex]);

  const servicesTitle = React.useMemo(() => parseMultiLingualText(data.title!, lang), [data.title, lang]);
  const images = parseStringList(data.imageUrls as string | string[] | null);
  const serviceItems = parseStringList(data.services as string | string[] | null);
  const servicesDescriptions = parseStringList(data.servicesDescription as string | string[] | null);
  const exampleLinkTexts = parseStringList(data.exampleLinkTexts as string | string[] | null);
  const selectedServiceDescription = selectedServiceIndex !== null
    ? parseMultiLingualText(
      (servicesDescriptions[selectedServiceIndex]?.trim() || serviceItems[selectedServiceIndex]?.trim() || ''),
      lang
    )
    : null;

  React.useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current || serviceItems.length === 0) return;

    const trySelectFromHash = (isIntersecting: boolean) => {
      if (!isIntersecting) return;

      if (window.location.hash !== '#services') {
        hasAutoSelectedFromHashRef.current = false;
        return;
      }

      if (hasAutoSelectedFromHashRef.current) return;

      const targetIndex = Math.min(4, serviceItems.length - 1);
      setSelectedServiceIndex(targetIndex);
      hasAutoSelectedFromHashRef.current = true;
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      trySelectFromHash(Boolean(entry?.isIntersecting));
    }, { threshold: 0.35 });

    observer.observe(sectionRef.current);
    trySelectFromHash(true);

    return () => {
      observer.disconnect();
    };
  }, [serviceItems.length]);

  const services = serviceItems.map((service, i) => (
    <div
      key={service}
      className="h-48 flex-1 min-w-[150px]"
      style={{ maxWidth: '192px' }}
    >
      <div
        ref={(element) => {
          serviceItemRefs.current[i] = element;
        }}
        onClick={() => setSelectedServiceIndex(i)}
        className="relative h-full w-full cursor-pointer"
        style={{ width: '172px' }}
      >
        <div
          style={{
            background: `url(${images[i]?.trim()}), url('film.webp')`,
            backgroundSize: 'cover',
            backgroundBlendMode: 'difference',
            transition: "filter 400ms",
            filter: selectedServiceIndex === i
              ? 'none'
              : undefined,
          }}
          className="absolute inset-0 overflow-x-hidden saturate-0 brightness-[0.8] transition-[filter] duration-200 md:hover:saturate-100 md:hover:brightness-100"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white px-4 py-3 [text-shadow:1px_1px_black]">
              {parseMultiLingualText(service.trim(), lang)}
            </p>
            {i % 2 === 0 &&
              <span className="absolute top-0" style={{ zIndex: 50 - i, color: 'gray', fontSize: '7px', right: '10px' }}>Bambala Studio</span>}
          </div>
        </div>
      </div>
    </div>
  ));
  return (
    <Section ref={sectionRef} id='services' background={data.background!} className='prose prose-lg mu-8 scroll-mt-12 md:scroll-mt-16'>
      {/* display flex for two elements in horizontal */}
      {data.title && <h2 className="text-foreground cool-underlined" data-tina-field={tinaField(data, 'title')}>{servicesTitle}</h2>}
      <div className='hidden md:block' style={{ position: 'relative', top: "10px" }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 32,
            zIndex: 10,
            pointerEvents: 'none',
            background: 'linear-gradient(to right, rgba(200,200,200,0.6), transparent)',
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            opacity: showLeftShadow ? 1 : 0,
            transition: 'opacity 200ms',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 32,
            zIndex: 10,
            pointerEvents: 'none',
            background: 'linear-gradient(to left, rgba(200,200,200,0.6), transparent)',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            opacity: showRightShadow ? 1 : 0,
            transition: 'opacity 200ms',
          }}
        />
        <div ref={servicesRef} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <div style={{ display: 'inline-flex', width: 'max-content', background: '#474747' }}>
            {services}
          </div>
        </div>
      </div>
      {selectedServiceDescription && (
        <Slideshow
          data={data}
          embedded
          selectedServiceIndex={selectedServiceIndex || 0}
          onSelectedServiceIndexChange={setSelectedServiceIndex}
        />
      )}
    </Section>
  );
};

export const servicesBlockSchema: Template = {
  name: 'services',
  label: 'Services',
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
      list: true
    },
    // {
    //   type: 'rich-text',
    //   label: 'Body',
    //   name: 'body',
    // },
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
    }
  ],
};
