"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Icon } from "../../icon";
import { useLayout } from "../layout-context";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLanguage } from "@/components/blocks/hooks/useLanguage";
import { getLanguage, parseMultiLingualText, setLanguage } from '@/lib/client-utils';
import { usePathname } from "next/navigation";

export const Header = () => {
  const { globalSettings, pageData } = useLayout();
  const { footer } = globalSettings!;
  const header: any = globalSettings!.header!;
  const pathname = usePathname();

  const [menuState, setMenuState] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(getLanguage() || 'es');
  const [showCenteredHeadline, setShowCenteredHeadline] = React.useState(false);
  const headerLabels = header.nav.map((item: any) => parseMultiLingualText(item.label as string, useLanguage()));
  const currentLanguage = useLanguage();
  const heroHeadline = React.useMemo(() => {
    const blocks = (pageData as any)?.data?.page?.blocks;
    if (!Array.isArray(blocks)) return '';

    const heroBlock = blocks.find((block: any) => block?.__typename === 'PageBlocksHero');
    if (!heroBlock?.headline) return '';

    return parseMultiLingualText(heroBlock.headline, currentLanguage);
  }, [pageData, currentLanguage]);

  React.useEffect(() => {
    if (pathname !== '/' || !heroHeadline) {
      setShowCenteredHeadline(false);
      return;
    }

    const heroHeadlineElement = document.querySelector('[data-hero-headline="true"]');
    if (!heroHeadlineElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isAboveViewport = entry.boundingClientRect.top < 0;
        setShowCenteredHeadline(!entry.isIntersecting && isAboveViewport);
      },
      { threshold: 0 }
    );

    observer.observe(heroHeadlineElement);
    return () => observer.disconnect();
  }, [pathname, heroHeadline]);
  const languageOptions = [
    { value: 'es', label: 'ES', flag: '/es.webp', alt: 'Spanish flag' },
    { value: 'en', label: 'EN', flag: '/en.webp', alt: 'English flag' },
  ];
  const activeLanguage = languageOptions.find((option) => option.value === selectedLanguage) || languageOptions[0];

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl">
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-end gap-0">
              {heroHeadline && (
                <div
                  className={`pointer-events-none absolute left-4 right-28 top-1/2 -translate-y-1/2 text-left text-sm font-semibold tracking-[0.12em] text-white transition-all duration-300 sm:left-1/2 sm:right-auto sm:max-w-[60vw] sm:-translate-x-1/2 sm:text-center ${showCenteredHeadline ? 'opacity-100' : 'opacity-0'}`}
                  aria-hidden={!showCenteredHeadline}
                >
                  <span className='block truncate'>{heroHeadline}</span>
                </div>
              )}
              <div className="flex items-center">
                {footer?.social?.map((link, index) => (
                  <Link key={`${link!.icon}${index}`} href={link!.url!} target="_blank" rel="noopener noreferrer" aria-label={link!.icon?.name || 'social link'}>
                    <Icon data={{ ...link!.icon, size: 'small' }} className="text-muted-foreground hover:text-primary block ml-2 mr-2" />
                  </Link>
                ))}
                <div className="flex gap-4 mr-8">
                  <div className="ml-6 relative">
                    <Listbox
                      value={selectedLanguage}
                      onChange={(value: string) => {
                        setSelectedLanguage(value);
                        setLanguage(value);
                      }}
                    >
                      <ListboxButton className="flex items-center gap-2 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary">
                        <Image
                          src={activeLanguage.flag}
                          alt={activeLanguage.alt}
                          width={18}
                          height={12}
                          className="h-3 w-[18px] object-cover"
                        />
                        <span>{activeLanguage.label}</span>
                        <ChevronDown className="size-3" />
                      </ListboxButton>
                      <ListboxOptions className="bg-black absolute right-0 mt-1 min-w-[90px] rounded border border-white/10 p-1 shadow-lg">
                        {languageOptions.map((option) => (
                          <ListboxOption
                            key={option.value}
                            value={option.value}
                            className={({ focus }) => `cursor-pointer rounded px-2 py-1 ${focus ? 'bg-white/10' : ''}`}
                          >
                            {({ selected }) => (
                              <div className="flex items-center gap-2 text-sm text-white">
                                <Image
                                  src={option.flag}
                                  alt={option.alt}
                                  width={18}
                                  height={12}
                                  className="h-3 w-[18px] object-cover"
                                />
                                <span>{option.label}</span>
                                {selected && <span className="ml-auto text-xs">✓</span>}
                              </div>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Listbox>
                  </div>
                  <button
                    onClick={() => setMenuState(!menuState)}
                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                  </button>
                </div>
                <div className="hidden lg:block">
                  <ul className="flex gap-8 text-sm">
                    {header.nav!.map((item: any, index: number) => (
                      <li key={index}>
                        <Link
                          href={item!.href!}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150">
                          <span>{headerLabels[index]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden flex items-center gap-4">
                <ul className="space-y-6 text-base">
                  {header.nav!.map((item: any, index: number) => (
                    <li key={index}>
                      <Link
                        href={item!.href!}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150">
                        <span>{headerLabels[index]}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
