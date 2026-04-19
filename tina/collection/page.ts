import type { Collection } from 'tinacms';
import { heroBlockSchema } from '@/components/blocks/hero';
import { contentBlockSchema } from '@/components/blocks/content';
import { testimonialBlockSchema } from '@/components/blocks/testimonial';
import { featureBlockSchema } from '@/components/blocks/features';
import { videoBlockSchema } from '@/components/blocks/video';
import { calloutBlockSchema } from '@/components/blocks/callout';
import { statsBlockSchema } from '@/components/blocks/stats';
import { ctaBlockSchema } from '@/components/blocks/call-to-action';
import { videoHeroBlockSchema } from '@/components/blocks/video-hero';
import { aboutBlockSchema } from '@/components/blocks/about';
import { servicesBlockSchema } from '@/components/blocks/services';
import { filtersBlockSchema } from '@/components/blocks/filters';
import { slideshowBlockSchema } from '@/components/blocks/slideshow';
import { spacerBlockSchema } from '@/components/blocks/spacer';
import { contactBlockSchema } from '@/components/blocks/contact';
import { openingTimesBlockSchema } from '@/components/blocks/opening-times';
import { contactMapBlockSchema } from '@/components/blocks/contact-map';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join('/');
      if (filepath === 'home') {
        return '/';
      }
      return `/${filepath}`;
    },
  },
  fields: [
    {
      type: 'string',
      name: 'theme',
      label: 'Page Theme',
      description: 'Optional CSS theme class applied to this page (e.g. "pasteleria")',
    },
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Sections',
      ui: {
        visualSelector: true,
      },
      templates: [
        heroBlockSchema,
        calloutBlockSchema,
        featureBlockSchema,
        statsBlockSchema,
        ctaBlockSchema,
        contentBlockSchema,
        testimonialBlockSchema,
        videoBlockSchema,
        videoHeroBlockSchema,
        aboutBlockSchema,
        servicesBlockSchema,
        slideshowBlockSchema,
        filtersBlockSchema,
        spacerBlockSchema,
        contactBlockSchema,
        openingTimesBlockSchema,
        contactMapBlockSchema,
      ],
    },
  ],
};

export default Page;
