'use client';
import React, { useEffect } from 'react';

import type { Template } from 'tinacms';
import { PageBlocksFilter } from '../../tina/__generated__/types';
import { sectionBlockSchemaField } from '../layout/section';
import { tinaField } from 'tinacms/dist/react';
import { useFilter } from '../layout/filter-context';

export const Filters = ({ data }: { data: any }) => {
  const { activeFilter, setActiveFilter } = useFilter();
  const filterOptions = React.useMemo(
    () =>
      (data.filters || '')
        .split(',')
        .map((filter: string) => filter.trim())
        .filter(Boolean),
    [data.filters]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get('filter')?.trim();

    if (urlFilter) {
      const matchedFilter = filterOptions.find(
        (filter: string) => filter.toLowerCase() === urlFilter.toLowerCase()
      );

      if (matchedFilter) {
        setActiveFilter(matchedFilter);
        return;
      }
    }

    const defaultFilter = data.default?.trim();
    if (defaultFilter && filterOptions.includes(defaultFilter)) {
      setActiveFilter(defaultFilter);
    }
  }, [data.default, filterOptions, setActiveFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  return (
    <div className='flex flex-wrap gap-4 justify-center p-4' data-tina-field={tinaField(data as any, 'filters')}>
      {filterOptions.map((filter: string) => (
        // for each filter create a tab
        <div
          key={filter.trim()}
          onClick={() => handleFilterChange(filter.trim())}
          style={{ backgroundColor: activeFilter === filter.trim() ? '#444' : '#000' }}
          className='px-4 py-2 rounded-full border-4 border-white text-white text-sm cursor-pointer font-semibold shadow-sm hover:bg-gray-500 transition-colors duration-150'
        >
          {filter.trim()}
        </div>
      ))}
    </div>
  );
};

export const filtersBlockSchema: Template = {
  name: 'filters',
  label: 'Filters',
  ui: {
    previewSrc: '/blocks/filter.png',
    defaultItem: {
      body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.',
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Filters',
      name: 'filters', // comma separated filters
    },
    {
      type: 'string',
      label: 'Default Filter',
      name: 'default',
    }
  ],
};
