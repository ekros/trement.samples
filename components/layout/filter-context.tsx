"use client";

import React, { createContext, useContext, useState } from 'react';

// Context for the active filter
type FilterContextType = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFilter, setActiveFilter] = useState<string>('');
  return (
    <FilterContext.Provider value={{ activeFilter, setActiveFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
