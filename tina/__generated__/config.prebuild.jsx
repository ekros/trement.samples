var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// components/mermaid-renderer.tsx
var mermaid_renderer_exports = {};
__export(mermaid_renderer_exports, {
  default: () => MermaidElement
});
import { useIntersectionObserver } from "usehooks-ts";
import mermaid from "mermaid";
function MermaidElement({ value }) {
  const { ref } = useIntersectionObserver({
    threshold: 0.01,
    freezeOnceVisible: true,
    onChange(isIntersecting, entry) {
      if (isIntersecting) {
        mermaid.initialize({ startOnLoad: false });
        mermaid.run({ nodes: [entry.target] });
      }
    }
  });
  return React.createElement("div", { contentEditable: false }, React.createElement("pre", { ref, suppressHydrationWarning: true }, value));
}
var init_mermaid_renderer = __esm({
  "components/mermaid-renderer.tsx"() {
    "use strict";
  }
});

// components/blocks/contact-map-leaflet.tsx
var contact_map_leaflet_exports = {};
__export(contact_map_leaflet_exports, {
  LeafletMap: () => LeafletMap
});
import L from "leaflet";
import { useEffect as useEffect4, useRef as useRef2 } from "react";
function useLeafletCSS() {
  useEffect4(() => {
    if (document.getElementById(LEAFLET_CSS_ID)) return;
    const link = document.createElement("link");
    link.id = LEAFLET_CSS_ID;
    link.rel = "stylesheet";
    link.href = LEAFLET_CSS_HREF;
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);
  }, []);
}
function LeafletMap({ lat, lng, zoom, address }) {
  useLeafletCSS();
  const containerRef = useRef2(null);
  const mapRef = useRef2(null);
  const markerRef = useRef2(null);
  useEffect4(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom,
        scrollWheelZoom: false
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(address);
      mapRef.current = map;
      markerRef.current = marker;
      return;
    }
    mapRef.current.setView([lat, lng], zoom);
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setPopupContent(address);
    }
  }, [lat, lng, zoom, address]);
  useEffect4(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, []);
  return React.createElement("div", { ref: containerRef, className: "w-full aspect-[16/9] rounded-lg z-0" });
}
var LEAFLET_CSS_ID, LEAFLET_CSS_HREF, DefaultIcon;
var init_contact_map_leaflet = __esm({
  "components/blocks/contact-map-leaflet.tsx"() {
    "use strict";
    "use client";
    LEAFLET_CSS_ID = "leaflet-css";
    LEAFLET_CSS_HREF = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  }
});

// tina/config.tsx
import { defineConfig } from "tinacms";

// next.config.ts
var nextConfig = {
  // Performance optimizations
  experimental: {
    // Enable faster builds
    turbo: {
      // Turbopack optimizations
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js"
        }
      }
    },
    // Reduce bundle analysis overhead
    webpackBuildWorker: true
  },
  // Optimize file watching
  watchOptions: {
    pollIntervalMs: 300
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.tina.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: ""
      }
    ]
  },
  async headers() {
    const headers = [
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN"
      },
      {
        key: "Content-Security-Policy",
        value: "frame-ancestors 'self'"
      }
    ];
    return [
      {
        source: "/(.*)",
        headers
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html"
      }
    ];
  }
};
var next_config_default = nextConfig;

// tina/collection/post.tsx
import React6 from "react";

// components/blocks/video.tsx
import * as React4 from "react";
import dynamic from "next/dynamic";

// components/layout/section.tsx
import React2 from "react";

// lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// components/layout/section.tsx
var tailwindBackgroundOptions = [
  { label: "Default", value: "bg-background" },
  { label: "White", value: "bg-white/80" },
  { label: "Gray", value: "bg-gray-50/80" },
  { label: "Zinc", value: "bg-zinc-50" },
  { label: "Black", value: "bg-black" },
  { label: "Red", value: "bg-red-50/80" },
  { label: "Orange", value: "bg-orange-50/80" },
  { label: "Yellow", value: "bg-yellow-50/80" },
  { label: "Green", value: "bg-green-50/80" },
  { label: "Lime", value: "bg-lime-50/80" },
  { label: "Emerald", value: "bg-emerald-50/80" },
  { label: "Teal", value: "bg-teal-50/80" },
  { label: "Cyan", value: "bg-cyan-50/80" },
  { label: "Blue", value: "bg-blue-50/80" },
  { label: "Sky", value: "bg-sky-50/80" },
  { label: "Indigo", value: "bg-indigo-50/80" },
  { label: "Violet", value: "bg-violet-50/80" },
  { label: "Purple", value: "bg-purple-50/80" },
  { label: "Fuchsia", value: "bg-fuchsia-50/80" },
  { label: "Pink", value: "bg-pink-50/80" },
  { label: "Rose", value: "bg-rose-50/80" }
];
var sectionBlockSchemaField = {
  type: "string",
  label: "Background",
  name: "background",
  options: tailwindBackgroundOptions
};
var sectionBlackGlassSchemaField = {
  type: "boolean",
  label: "Black Glass Effect",
  name: "isBlackGlass",
  description: "Apply near-black glassmorphism regardless of background class."
};

// components/layout/filter-context.tsx
import React3, { createContext, useContext, useState } from "react";
var FilterContext = createContext(void 0);

// components/blocks/video.tsx
var ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
var videoBlockSchema = {
  name: "video",
  label: "Video",
  ui: {
    previewSrc: "/blocks/video.png",
    defaultItem: {
      url: "https://www.youtube.com/watch?v=j8egYW7Jpgk"
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" }
      ]
    },
    {
      type: "string",
      label: "Url",
      name: "url"
    },
    {
      type: "boolean",
      label: "Auto Play",
      name: "autoPlay"
    },
    {
      type: "boolean",
      label: "Loop",
      name: "loop"
    },
    {
      type: "boolean",
      label: "Show Controls",
      name: "controls"
    },
    {
      type: "boolean",
      label: "Muted",
      name: "muted"
    },
    {
      type: "string",
      label: "Tag",
      name: "tag"
    }
    // {
    //   type: 'boolean',
    //   label: 'Preload',
    //   name: 'preload',
    // }
  ]
};

// components/ui/avatar.tsx
import * as React5 from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
function Avatar({
  className,
  ...props
}) {
  return React5.createElement(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({
  className,
  ...props
}) {
  return React5.createElement(
    AvatarPrimitive.Image,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return React5.createElement(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}

// tina/collection/post.tsx
var Post = {
  label: "Blog Posts",
  name: "post",
  path: "content/posts",
  format: "mdx",
  ui: {
    router: ({ document: document2 }) => {
      return `/posts/${document2._sys.breadcrumbs.join("/")}`;
    }
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      isTitle: true,
      required: true
    },
    {
      type: "image",
      name: "heroImg",
      label: "Hero Image",
      // @ts-ignore
      uploadDir: () => "posts"
    },
    {
      type: "rich-text",
      label: "Excerpt",
      name: "excerpt",
      overrides: {
        toolbar: ["bold", "italic", "link"]
      }
    },
    {
      type: "reference",
      label: "Author",
      name: "author",
      collections: ["author"],
      ui: {
        //@ts-ignore
        optionComponent: (props, _internalSys) => {
          const { name, avatar } = props;
          if (!name) return _internalSys.path;
          return React6.createElement("p", { className: "flex min-h-8 items-center gap-4" }, React6.createElement(Avatar, null, avatar && React6.createElement(AvatarImage, { src: avatar, alt: `${name} Profile` }), React6.createElement(AvatarFallback, null, name.split(" ").map((part) => part[0]?.toUpperCase() || "").join(""))), name);
        }
      }
    },
    {
      type: "datetime",
      label: "Posted Date",
      name: "date",
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A"
      }
    },
    {
      type: "object",
      label: "Tags",
      name: "tags",
      list: true,
      fields: [
        {
          type: "reference",
          label: "Tag",
          name: "tag",
          collections: ["tag"],
          ui: {
            optionComponent: (props, _internalSys) => props.name || _internalSys.path
          }
        }
      ],
      ui: {
        itemProps: (item) => {
          return { label: item?.tag };
        }
      }
    },
    {
      type: "rich-text",
      label: "Body",
      name: "_body",
      templates: [
        {
          name: "BlockQuote",
          label: "Block Quote",
          fields: [
            {
              name: "children",
              label: "Quote",
              type: "rich-text",
              overrides: {
                toolbar: ["bold", "italic", "link"]
              }
            },
            {
              name: "authorName",
              label: "Author",
              type: "string"
            }
          ]
        },
        {
          name: "DateTime",
          label: "Date & Time",
          inline: true,
          fields: [
            {
              name: "format",
              label: "Format",
              type: "string",
              options: ["utc", "iso", "local"]
            }
          ]
        },
        {
          name: "NewsletterSignup",
          label: "Newsletter Sign Up",
          fields: [
            {
              name: "children",
              label: "CTA",
              type: "rich-text"
            },
            {
              name: "placeholder",
              label: "Placeholder",
              type: "string"
            },
            {
              name: "buttonText",
              label: "Button Text",
              type: "string"
            },
            {
              name: "disclaimer",
              label: "Disclaimer",
              type: "rich-text",
              overrides: {
                toolbar: ["bold", "italic", "link"]
              }
            }
          ],
          ui: {
            defaultItem: {
              placeholder: "Enter your email",
              buttonText: "Notify Me"
            }
          }
        },
        videoBlockSchema
      ],
      isBody: true
    }
  ]
};
var post_default = Post;

// tina/fields/color.tsx
import React7 from "react";
import { wrapFieldsWithMeta } from "tinacms";
var colorOptions = ["blue", "teal", "green", "yellow", "orange", "red", "pink", "purple", "white"];
var ColorPickerInput = wrapFieldsWithMeta(({ input }) => {
  const inputClasses = {
    blue: "bg-blue-500 border-blue-600",
    teal: "bg-teal-500 border-teal-600",
    green: "bg-green-500 border-green-600",
    yellow: "bg-yellow-500 border-yellow-600",
    orange: "bg-orange-500 border-orange-600",
    red: "bg-red-500 border-red-600",
    pink: "bg-pink-500 border-pink-600",
    purple: "bg-purple-500 border-purple-600",
    white: "bg-white border-gray-150"
  };
  return React7.createElement(React7.Fragment, null, React7.createElement("input", { type: "text", id: input.name, className: "hidden", ...input }), React7.createElement("div", { className: "flex gap-2 flex-wrap" }, colorOptions.map((color) => {
    return React7.createElement(
      "button",
      {
        key: color,
        className: `w-9 h-9 rounded-full shadow border ${inputClasses[color]} ${input.value === color ? "ring-[3px] ring-offset-2 ring-blue-400" : ""}`,
        onClick: () => {
          input.onChange(color);
        }
      }
    );
  })));
});

// tina/fields/icon.tsx
import React10 from "react";
import { Button, wrapFieldsWithMeta as wrapFieldsWithMeta2 } from "tinacms";
import { BiChevronRight } from "react-icons/bi";
import { GoCircleSlash } from "react-icons/go";

// components/icon.tsx
import * as BoxIcons from "react-icons/bi";
import { FaFacebookF, FaGithub, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import React9 from "react";

// components/layout/layout-context.tsx
import React8, { useState as useState2, useContext as useContext2 } from "react";
var LayoutContext = React8.createContext(void 0);
var useLayout = () => {
  const context = useContext2(LayoutContext);
  return context || {
    theme: {
      color: "blue",
      darkMode: "default"
    },
    globalSettings: void 0,
    pageData: void 0
  };
};

// components/icon.tsx
var IconOptions = {
  Tina: (props) => React9.createElement("svg", { ...props, viewBox: "0 0 66 80", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, React9.createElement("title", null, "Tina"), React9.createElement(
    "path",
    {
      d: "M39.4615 36.1782C42.763 33.4475 44.2259 17.3098 45.6551 11.5091C47.0843 5.70828 52.995 6.0025 52.995 6.0025C52.995 6.0025 51.4605 8.67299 52.0864 10.6658C52.7123 12.6587 57 14.4401 57 14.4401L56.0752 16.8781C56.0752 16.8781 54.1441 16.631 52.995 18.9297C51.8459 21.2283 53.7336 43.9882 53.7336 43.9882C53.7336 43.9882 46.8271 57.6106 46.8271 63.3621C46.8271 69.1136 49.5495 73.9338 49.5495 73.9338H45.7293C45.7293 73.9338 40.1252 67.2648 38.9759 63.9318C37.8266 60.5988 38.2861 57.2658 38.2861 57.2658C38.2861 57.2658 32.1946 56.921 26.7931 57.2658C21.3915 57.6106 17.7892 62.2539 17.1391 64.8512C16.4889 67.4486 16.2196 73.9338 16.2196 73.9338H13.1991C11.3606 68.2603 9.90043 66.2269 10.6925 63.3621C12.8866 55.4269 12.4557 50.9263 11.9476 48.9217C11.4396 46.9172 8 45.1676 8 45.1676C9.68492 41.7349 11.4048 40.0854 18.8029 39.9133C26.201 39.7413 36.1599 38.9088 39.4615 36.1782Z",
      fill: "currentColor"
    }
  ), React9.createElement(
    "path",
    {
      d: "M20.25 63.03C20.25 63.03 21.0305 70.2533 25.1773 73.9342H28.7309C25.1773 69.9085 24.7897 59.415 24.7897 59.415C22.9822 60.0035 20.4799 62.1106 20.25 63.03Z",
      fill: "currentColor"
    }
  )),
  ...BoxIcons,
  FaFacebookF,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  AiFillInstagram
};
var iconColorClass = {
  blue: {
    regular: "text-blue-400",
    circle: "bg-blue-400 dark:bg-blue-500 text-blue-50"
  },
  teal: {
    regular: "text-teal-400",
    circle: "bg-teal-400 dark:bg-teal-500 text-teal-50"
  },
  green: {
    regular: "text-green-400",
    circle: "bg-green-400 dark:bg-green-500 text-green-50"
  },
  red: {
    regular: "text-red-400",
    circle: "bg-red-400 dark:bg-red-500 text-red-50"
  },
  pink: {
    regular: "text-pink-400",
    circle: "bg-pink-400 dark:bg-pink-500 text-pink-50"
  },
  purple: {
    regular: "text-purple-400",
    circle: "bg-purple-400 dark:bg-purple-500 text-purple-50"
  },
  orange: {
    regular: "text-orange-400",
    circle: "bg-orange-400 dark:bg-orange-500 text-orange-50"
  },
  yellow: {
    regular: "text-yellow-400",
    circle: "bg-yellow-400 dark:bg-yellow-500 text-yellow-50"
  },
  white: {
    regular: "text-white opacity-80",
    circle: "bg-white-400 dark:bg-white-500 text-white-50"
  }
};
var iconSizeClass = {
  xs: "w-6 h-6 shrink-0",
  small: "w-8 h-8 shrink-0",
  medium: "w-12 h-12 shrink-0",
  large: "w-14 h-14 shrink-0",
  xl: "w-16 h-16 shrink-0",
  custom: ""
};
var Icon = ({ data, parentColor = "", className = "", tinaField: tinaField16 = "" }) => {
  const { theme } = useLayout();
  if (IconOptions[data.name] === null || IconOptions[data.name] === void 0) {
    return null;
  }
  const { name, color, size = "medium", style = "regular" } = data;
  const IconSVG = IconOptions[name];
  const iconSizeClasses = typeof size === "string" ? iconSizeClass[size] : iconSizeClass[Object.keys(iconSizeClass)[size]];
  const iconColor = color ? color === "primary" ? theme.color : color : theme.color;
  if (style == "circle") {
    return React9.createElement(
      "div",
      {
        ...tinaField16 ? { "data-tina-field": tinaField16 } : {},
        className: `relative z-10 inline-flex items-center justify-center shrink-0 ${iconSizeClasses} rounded-full ${iconColorClass[iconColor].circle} ${className}`
      },
      React9.createElement(IconSVG, { className: "w-2/3 h-2/3" })
    );
  } else {
    const iconColorClasses = iconColorClass[parentColor === "primary" && (iconColor === theme.color || iconColor === "primary") ? "white" : iconColor].regular;
    return React9.createElement(
      IconSVG,
      {
        ...tinaField16 ? { "data-tina-field": tinaField16 } : {},
        className: `${iconSizeClasses} ${iconColorClasses} ${className}`
      }
    );
  }
};

// tina/fields/icon.tsx
import { Popover, PopoverButton, Transition, PopoverPanel } from "@headlessui/react";
var parseIconName = (name) => {
  const splitName = name.split(/(?=[A-Z])/);
  if (splitName.length > 1) {
    return splitName.slice(1).join(" ");
  } else {
    return name;
  }
};
var IconPickerInput = wrapFieldsWithMeta2(({ input }) => {
  const [filter, setFilter] = React10.useState("");
  const filteredBlocks = React10.useMemo(() => {
    return Object.keys(IconOptions).filter((name) => {
      return name.toLowerCase().includes(filter.toLowerCase());
    });
  }, [filter]);
  const inputLabel = Object.keys(IconOptions).includes(input.value) ? parseIconName(input.value) : "Select Icon";
  const InputIcon = IconOptions[input.value] ? IconOptions[input.value] : null;
  return React10.createElement("div", { className: "relative z-[1000]" }, React10.createElement("input", { type: "text", id: input.name, className: "hidden", ...input }), React10.createElement(Popover, null, ({ open }) => React10.createElement(React10.Fragment, null, React10.createElement(PopoverButton, null, React10.createElement(Button, { className: `text-sm h-11 px-4 ${InputIcon ? "h-11" : "h-10"}`, size: "custom", rounded: "full", variant: open ? "secondary" : "white" }, InputIcon && React10.createElement(InputIcon, { className: "w-7 mr-1 h-auto fill-current text-blue-500" }), inputLabel, !InputIcon && React10.createElement(BiChevronRight, { className: "w-5 h-auto fill-current opacity-70 ml-1" }))), React10.createElement("div", { className: "absolute w-full min-w-[192px] max-w-2xl -bottom-2 left-0 translate-y-full", style: { zIndex: 1e3 } }, React10.createElement(
    Transition,
    {
      enter: "transition duration-150 ease-out",
      enterFrom: "transform opacity-0 -translate-y-2",
      enterTo: "transform opacity-100 translate-y-0",
      leave: "transition duration-75 ease-in",
      leaveFrom: "transform opacity-100 translate-y-0",
      leaveTo: "transform opacity-0 -translate-y-2"
    },
    React10.createElement(PopoverPanel, { className: "relative overflow-hidden rounded-lg shadow-lg bg-white border border-gray-150 z-50" }, ({ close }) => React10.createElement("div", { className: "max-h-[24rem] flex flex-col w-full h-full" }, React10.createElement("div", { className: "bg-gray-50 p-2 border-b border-gray-100 z-10 shadow-sm" }, React10.createElement(
      "input",
      {
        type: "text",
        className: "bg-white text-sm rounded-sm border border-gray-100 shadow-inner py-1.5 px-2.5 w-full block placeholder-gray-200",
        onClick: (event) => {
          event.stopPropagation();
          event.preventDefault();
        },
        value: filter,
        onChange: (event) => {
          setFilter(event.target.value);
        },
        placeholder: "Filter..."
      }
    )), filteredBlocks.length === 0 && React10.createElement("span", { className: "relative text-center text-xs px-2 py-3 text-gray-300 bg-gray-50 italic" }, "No matches found"), filteredBlocks.length > 0 && React10.createElement("div", { className: "w-full grid grid-cols-6 auto-rows-auto p-2 overflow-y-auto" }, React10.createElement(
      "button",
      {
        className: "relative rounded-lg text-center text-xs py-2 px-3 flex-1 outline-none transition-all ease-out duration-150 hover:text-blue-500 focus:text-blue-500 focus:bg-gray-50 hover:bg-gray-50",
        key: "clear-input",
        onClick: () => {
          input.onChange("");
          setFilter("");
          close();
        }
      },
      React10.createElement(GoCircleSlash, { className: "w-6 h-auto text-gray-200" })
    ), filteredBlocks.map((name) => {
      return React10.createElement(
        "button",
        {
          className: "relative flex items-center justify-center rounded-lg text-center text-xs py-2 px-3 flex-1 outline-none transition-all ease-out duration-150 hover:text-blue-500 focus:text-blue-500 focus:bg-gray-50 hover:bg-gray-50",
          key: name,
          onClick: () => {
            input.onChange(name);
            setFilter("");
            close();
          }
        },
        React10.createElement(
          Icon,
          {
            data: {
              name,
              size: "custom",
              color: "blue"
            },
            className: "w-7 h-auto"
          }
        )
      );
    }))))
  )))));
});
var iconSchema = {
  type: "object",
  label: "Icon",
  name: "icon",
  fields: [
    {
      type: "string",
      label: "Icon",
      name: "name",
      ui: {
        component: IconPickerInput
      }
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      ui: {
        component: ColorPickerInput
      }
    },
    {
      name: "style",
      label: "Style",
      type: "string",
      options: [
        {
          label: "Circle",
          value: "circle"
        },
        {
          label: "Float",
          value: "float"
        }
      ]
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "string"
    }
  ]
};

// tina/collection/global.ts
var Global = {
  label: "Global",
  name: "global",
  path: "content/global",
  format: "json",
  ui: {
    global: true
  },
  fields: [
    {
      type: "object",
      label: "Header",
      name: "header",
      fields: [
        iconSchema,
        {
          type: "string",
          label: "Image URL",
          name: "imageUrl"
        },
        {
          type: "string",
          label: "Name",
          name: "name"
        },
        {
          type: "string",
          label: "Color",
          name: "color",
          options: [
            { label: "Default", value: "default" },
            { label: "Primary", value: "primary" }
          ]
        },
        {
          type: "object",
          label: "Nav Links",
          name: "nav",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.label };
            },
            defaultItem: {
              href: "home",
              label: "Home"
            }
          },
          fields: [
            {
              type: "string",
              label: "Link",
              name: "href"
            },
            {
              type: "string",
              label: "Label",
              name: "label"
            }
          ]
        }
      ]
    },
    {
      type: "object",
      label: "Footer",
      name: "footer",
      fields: [
        {
          type: "object",
          label: "Social Links",
          name: "social",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.icon?.name || "undefined" };
            }
          },
          fields: [
            iconSchema,
            {
              type: "string",
              label: "Url",
              name: "url"
            }
          ]
        }
      ]
    },
    {
      type: "object",
      label: "Theme",
      name: "theme",
      // @ts-ignore
      fields: [
        {
          type: "string",
          label: "Primary Color",
          name: "color",
          ui: {
            component: ColorPickerInput
          }
        },
        {
          type: "string",
          name: "font",
          label: "Font Family",
          options: [
            {
              label: "System Sans",
              value: "sans"
            },
            {
              label: "Nunito",
              value: "nunito"
            },
            {
              label: "Lato",
              value: "lato"
            }
          ]
        },
        {
          type: "string",
          name: "darkMode",
          label: "Dark Mode",
          options: [
            {
              label: "System",
              value: "system"
            },
            {
              label: "Light",
              value: "light"
            },
            {
              label: "Dark",
              value: "dark"
            }
          ]
        }
      ]
    }
  ]
};
var global_default = Global;

// tina/collection/author.ts
var Author = {
  label: "Authors",
  name: "author",
  path: "content/authors",
  format: "md",
  fields: [
    {
      type: "string",
      label: "Name",
      name: "name",
      isTitle: true,
      required: true
    },
    {
      type: "image",
      label: "Avatar",
      name: "avatar",
      // @ts-ignore
      uploadDir: () => "authors"
    }
  ]
};
var author_default = Author;

// components/blocks/hero.tsx
import Image2 from "next/image";
import Link from "next/link";
import * as React14 from "react";
import { tinaField } from "tinacms/dist/react";

// components/motion-primitives/animated-group.tsx
import { motion } from "motion/react";
import React11 from "react";

// components/motion-primitives/text-effect.tsx
import {
  AnimatePresence,
  motion as motion2
} from "motion/react";
import React12 from "react";
var AnimationComponent = React12.memo(({ segment, variants, per, segmentWrapperClassName }) => {
  const content = per === "line" ? React12.createElement(motion2.span, { variants, className: "block" }, segment) : per === "word" ? React12.createElement(
    motion2.span,
    {
      "aria-hidden": "true",
      variants,
      className: "inline-block whitespace-pre"
    },
    segment
  ) : React12.createElement(motion2.span, { className: "inline-block whitespace-pre" }, segment.split("").map((char, charIndex) => React12.createElement(
    motion2.span,
    {
      key: `char-${charIndex}`,
      "aria-hidden": "true",
      variants,
      className: "inline-block whitespace-pre"
    },
    char
  )));
  if (!segmentWrapperClassName) {
    return content;
  }
  const defaultWrapperClassName = per === "line" ? "block" : "inline-block";
  return React12.createElement("span", { className: cn(defaultWrapperClassName, segmentWrapperClassName) }, content);
});
AnimationComponent.displayName = "AnimationComponent";

// components/ui/button.tsx
import * as React13 from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

// components/ui/hero-video-dialog.tsx
import { Play } from "lucide-react";

// components/ui/VideoDialogContext.tsx
import { createContext as createContext2, useContext as useContext3, useState as useState3 } from "react";
var VideoDialogContext = createContext2(void 0);

// components/blocks/hero.tsx
var heroBlockSchema = {
  name: "hero",
  label: "Hero",
  ui: {
    previewSrc: "/blocks/hero.png",
    defaultItem: {
      tagline: "Here's some text above the other text",
      headline: "This Big Text is Totally Awesome",
      text: "Phasellus scelerisque, libero eu finibus rutrum, risus risus accumsan libero, nec molestie urna dui a leo."
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Headline",
      name: "headline"
    },
    {
      type: "string",
      label: "Tagline",
      name: "tagline"
    },
    {
      label: "Actions",
      name: "actions",
      type: "object",
      list: true,
      ui: {
        defaultItem: {
          label: "Action Label",
          type: "button",
          icon: {
            name: "Tina",
            color: "white",
            style: "float"
          },
          link: "/"
        },
        itemProps: (item) => ({ label: item.label })
      },
      fields: [
        {
          label: "Label",
          name: "label",
          type: "string"
        },
        {
          label: "Type",
          name: "type",
          type: "string",
          options: [
            { label: "Button", value: "button" },
            { label: "Link", value: "link" }
          ]
        },
        iconSchema,
        {
          label: "Link",
          name: "link",
          type: "string"
        }
      ]
    },
    {
      type: "boolean",
      label: "Enable Headline Scale Effect",
      name: "enableHeadlineScaleEffect",
      description: "When enabled, the headline scales down as it approaches the top of the viewport"
    },
    {
      type: "object",
      label: "Image",
      name: "image",
      fields: [
        {
          name: "src",
          label: "Image Source",
          type: "image"
        },
        {
          name: "alt",
          label: "Alt Text",
          type: "string"
        },
        {
          name: "videoUrl",
          label: "Video URL",
          type: "string",
          description: "If using a YouTube video, make sure to use the embed version of the video URL"
        }
      ]
    }
  ]
};

// components/blocks/content.tsx
import React15 from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField as tinaField2 } from "tinacms/dist/react";

// components/blocks/mermaid.tsx
import dynamic2 from "next/dynamic";
var MermaidElement2 = dynamic2(() => Promise.resolve().then(() => (init_mermaid_renderer(), mermaid_renderer_exports)), {
  ssr: false,
  loading: () => React.createElement("div", null, "Loading diagram...")
});

// components/magicui/script-copy-btn.tsx
import { Check, Copy } from "lucide-react";
import { motion as motion3 } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect as useEffect2, useState as useState5 } from "react";
var scriptCopyBlockSchema = {
  name: "scriptCopyBlock",
  label: "Script Copy Block",
  ui: {
    defaultItem: {
      codeLanguage: "bash",
      lightTheme: "catppuccin-latte",
      darkTheme: "catppuccin-mocha",
      commandMap: "npm|npm install\npnpm|pnpm install\nyarn|yarn install\nbun|bun install"
    }
  },
  fields: [
    {
      name: "codeLanguage",
      label: "Code Language",
      type: "string",
      description: "The language used for syntax highlighting."
    },
    {
      name: "lightTheme",
      label: "Light Theme",
      type: "string",
      description: "The light theme used for syntax highlighting."
    },
    {
      name: "darkTheme",
      label: "Dark Theme",
      type: "string",
      description: "The dark theme used for syntax highlighting."
    },
    {
      name: "commandMap",
      label: "Command Map",
      type: "string",
      description: 'A list of package managers and their corresponding commands, separated by "|". Example:\n"npm|npm install\npnpm|pnpm install"',
      ui: {
        component: "textarea"
      }
    }
  ]
};

// components/blocks/content.tsx
var contentBlockSchema = {
  name: "content",
  label: "Content",
  ui: {
    previewSrc: "/blocks/content.png",
    defaultItem: {
      body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede."
    }
  },
  fields: [
    sectionBlockSchemaField,
    sectionBlackGlassSchemaField,
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      templates: [scriptCopyBlockSchema]
    }
  ]
};

// components/blocks/testimonial.tsx
import React17 from "react";

// components/ui/card.tsx
import * as React16 from "react";

// components/blocks/testimonial.tsx
import { tinaField as tinaField3 } from "tinacms/dist/react";
var testimonialBlockSchema = {
  name: "testimonial",
  label: "Testimonial",
  ui: {
    previewSrc: "/blocks/testimonial.png",
    defaultItem: {
      testimonials: [
        {
          quote: "There are only two hard things in Computer Science: cache invalidation and naming things.",
          author: "Phil Karlton"
        }
      ]
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea"
      }
    },
    {
      type: "object",
      list: true,
      label: "Testimonials",
      name: "testimonials",
      ui: {
        defaultItem: {
          quote: "There are only two hard things in Computer Science: cache invalidation and naming things.",
          author: "Phil Karlton"
        },
        itemProps: (item) => {
          return {
            label: `${item.quote} - ${item.author}`
          };
        }
      },
      fields: [
        {
          type: "string",
          ui: {
            component: "textarea"
          },
          label: "Quote",
          name: "quote"
        },
        {
          type: "string",
          label: "Author",
          name: "author"
        },
        {
          type: "string",
          label: "Role",
          name: "role"
        },
        {
          type: "image",
          label: "Avatar",
          name: "avatar"
        }
      ]
    }
  ]
};

// components/blocks/features.tsx
import { tinaField as tinaField4 } from "tinacms/dist/react";
import { TinaMarkdown as TinaMarkdown2 } from "tinacms/dist/rich-text";
var defaultFeature = {
  title: "Here's Another Feature",
  text: "This is where you might talk about the feature, if this wasn't just filler text.",
  showGridEffect: false,
  icon: {
    name: "Tina",
    color: "white",
    style: "float"
  }
};
var featureBlockSchema = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      title: "Built to cover your needs",
      description: "We have a lot of features to cover your needs",
      items: [defaultFeature, defaultFeature, defaultFeature]
    }
  },
  fields: [
    sectionBlockSchemaField,
    sectionBlackGlassSchemaField,
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Description",
      name: "description"
    },
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title
          };
        },
        defaultItem: {
          ...defaultFeature
        }
      },
      fields: [
        iconSchema,
        {
          type: "boolean",
          label: "Show Grid Effect",
          name: "showGridEffect",
          description: "Show the decorative grid background and corner border behind the icon."
        },
        {
          type: "string",
          label: "Title",
          name: "title"
        },
        {
          type: "rich-text",
          label: "Text",
          name: "text"
        }
      ]
    }
  ]
};

// components/blocks/callout.tsx
import React18 from "react";
import Link2 from "next/link";
import { tinaField as tinaField5 } from "tinacms/dist/react";
import { ArrowDown, ArrowRight } from "lucide-react";
var calloutBlockSchema = {
  name: "callout",
  label: "Callout",
  ui: {
    previewSrc: "/blocks/callout.png",
    defaultItem: {
      url: "https://tina.io/editorial-workflow",
      text: "Support for live editing and editorial workflow"
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Text",
      name: "text"
    },
    {
      type: "string",
      label: "Url",
      name: "url"
    },
    {
      type: "boolean",
      label: "Open in new tab",
      name: "newTab"
    },
    {
      type: "boolean",
      label: "Use arrow down",
      name: "useArrowDown"
    },
    {
      type: "string",
      label: "Background Color",
      name: "backgroundColor"
    },
    {
      type: "string",
      label: "Border Color",
      name: "borderColor"
    }
  ]
};

// components/blocks/stats.tsx
import { tinaField as tinaField6 } from "tinacms/dist/react";
var statsBlockSchema = {
  name: "stats",
  label: "Stats",
  ui: {
    previewSrc: "/blocks/stats.png",
    defaultItem: {
      title: "TinaCMS by the numbers",
      description: "TinaCMS is an open-source content management system that allows developers to create and manage content for their websites and applications. It provides a flexible and customizable framework for building content-driven applications.",
      stats: [
        {
          stat: 12e3,
          type: "Stars on GitHub"
        },
        {
          stat: 11e3,
          type: "Active Users"
        },
        {
          stat: 22e3,
          type: "Powered Apps"
        }
      ]
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Description",
      name: "description"
    },
    {
      type: "object",
      label: "Stats",
      name: "stats",
      list: true,
      ui: {
        defaultItem: {
          stat: 12e3,
          type: "Stars on GitHub"
        },
        itemProps: (item) => {
          return {
            label: `${item.stat} ${item.type}`
          };
        }
      },
      fields: [
        {
          type: "number",
          label: "Stat",
          name: "stat"
        },
        {
          type: "string",
          label: "Type",
          name: "type"
        }
      ]
    }
  ]
};

// components/blocks/call-to-action.tsx
import Link3 from "next/link";
import { tinaField as tinaField7 } from "tinacms/dist/react";
var ctaBlockSchema = {
  name: "cta",
  label: "CTA",
  ui: {
    previewSrc: "/blocks/cta.png",
    defaultItem: {
      title: "Start Building",
      description: "Get started with TinaCMS today and take your content management to the next level.",
      actions: [
        {
          label: "Get Started",
          type: "button",
          link: "/"
        },
        {
          label: "Book Demo",
          type: "link",
          link: "/"
        }
      ]
    }
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea"
      }
    },
    {
      label: "Actions",
      name: "actions",
      type: "object",
      list: true,
      ui: {
        defaultItem: {
          label: "Action Label",
          type: "button",
          icon: {
            name: "Tina",
            color: "white",
            style: "float"
          },
          link: "/"
        },
        itemProps: (item) => ({ label: item.label })
      },
      fields: [
        {
          label: "Label",
          name: "label",
          type: "string"
        },
        {
          label: "Type",
          name: "type",
          type: "string",
          options: [
            { label: "Button", value: "button" },
            { label: "Link", value: "link" }
          ]
        },
        iconSchema,
        {
          label: "Link",
          name: "link",
          type: "string"
        }
      ]
    }
  ]
};

// components/blocks/video-hero.tsx
import * as React19 from "react";
import dynamic3 from "next/dynamic";
import Image3 from "next/image";
import { tinaField as tinaField8 } from "tinacms/dist/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
var ReactPlayer2 = dynamic3(() => import("react-player"), { ssr: false });
var videoHeroBlockSchema = {
  name: "video_hero",
  nameOverride: "video-hero",
  label: "Video Hero",
  ui: {
    previewSrc: "/blocks/video.png",
    defaultItem: {
      url: "https://www.youtube.com/watch?v=j8egYW7Jpgk",
      autoPlay: true,
      muted: true,
      loop: true,
      controls: false
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" }
      ]
    },
    {
      type: "string",
      label: "Url",
      name: "url"
    },
    {
      type: "boolean",
      label: "Use Image",
      name: "useImage"
    },
    {
      type: "image",
      label: "Hero Image Urls",
      name: "heroImageUrls",
      list: true
    },
    {
      type: "string",
      label: "Headline",
      name: "headline"
    },
    {
      type: "string",
      label: "Tagline",
      name: "tagline"
    },
    {
      type: "boolean",
      label: "Auto Play",
      name: "autoPlay"
    },
    {
      type: "boolean",
      label: "Muted",
      name: "muted"
    },
    {
      type: "boolean",
      label: "Loop",
      name: "loop"
    },
    {
      type: "boolean",
      label: "Controls",
      name: "controls"
    },
    {
      type: "string",
      label: "Callout Text",
      name: "calloutText"
    },
    {
      type: "string",
      label: "Callout Url",
      name: "calloutUrl"
    },
    {
      type: "string",
      label: "Callout Text 2",
      name: "calloutText2"
    },
    {
      type: "string",
      label: "Callout Url 2",
      name: "calloutUrl2"
    },
    {
      type: "number",
      label: "Video Scale (1 = 100%)",
      name: "videoScale"
    },
    {
      type: "number",
      label: "Brightness (1 = normal, <1 darker, >1 brighter)",
      name: "brightness"
    },
    {
      type: "number",
      label: "Slide Duration (seconds, only for images)",
      name: "slideDuration"
    },
    {
      type: "boolean",
      label: "Backdrop Dark Effect",
      name: "backdropDarkEffect"
    }
  ]
};

// components/blocks/about.tsx
import React20 from "react";
import { TinaMarkdown as TinaMarkdown3 } from "tinacms/dist/rich-text";
import Image4 from "next/image";
import dynamic4 from "next/dynamic";
import { tinaField as tinaField9 } from "tinacms/dist/react";
import { FaInstagram, FaLinkedin as FaLinkedin2, FaYoutube as FaYoutube2, FaGithub as FaGithub2, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import useEmblaCarousel2 from "embla-carousel-react";
import Autoplay2 from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
var ReactPlayer3 = dynamic4(() => import("react-player"), { ssr: false });
var aboutBlockSchema = {
  name: "about",
  label: "About",
  ui: {
    previewSrc: "/blocks/about.png",
    defaultItem: {
      imagePosition: "left",
      bodyEN: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.",
      bodyES: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.",
      autoplayDelayMs: 5e3
    }
  },
  fields: [
    sectionBlockSchemaField,
    sectionBlackGlassSchemaField,
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "rich-text",
      label: "Body EN",
      name: "bodyEN",
      templates: [scriptCopyBlockSchema]
    },
    {
      type: "rich-text",
      label: "Body ES",
      name: "bodyES",
      templates: [scriptCopyBlockSchema]
    },
    {
      type: "image",
      label: "Image Url",
      name: "imageUrl"
    },
    {
      type: "image",
      label: "Image Urls",
      name: "imageUrls",
      list: true
    },
    {
      type: "string",
      label: "Image Position",
      name: "imagePosition",
      options: ["left", "right"],
      ui: {
        component: "radio-group"
      }
    },
    {
      type: "string",
      label: "Social Networks",
      name: "socialNetworks",
      list: true,
      ui: {
        defaultItem: ["instagram"]
      }
    },
    {
      type: "number",
      label: "Image Y offset",
      name: "imageYOffset"
    },
    {
      type: "number",
      label: "Autoplay Delay (ms) - Set to 0 or leave empty to disable autoplay",
      name: "autoplayDelayMs"
    },
    {
      type: "string",
      label: "Example link text",
      name: "exampleLinkText"
    },
    {
      type: "string",
      label: "Example link url",
      name: "exampleLinkUrl"
    }
  ]
};

// components/blocks/services.tsx
import React22 from "react";
import { tinaField as tinaField11 } from "tinacms/dist/react";

// components/blocks/slideshow.tsx
import React21 from "react";
import { tinaField as tinaField10 } from "tinacms/dist/react";
var slideshowBlockSchema = {
  name: "slideshow",
  label: "Slideshow",
  ui: {
    previewSrc: "/blocks/services.png",
    defaultItem: {
      body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede."
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "image",
      label: "Image Urls",
      name: "imageUrls",
      list: true
    },
    {
      label: "Services",
      name: "services",
      type: "string",
      list: true
    },
    {
      label: "Services Description",
      name: "servicesDescription",
      type: "string",
      list: true
    },
    {
      type: "string",
      label: "Image Y offsets",
      name: "imageYOffsets",
      list: true
    },
    {
      type: "string",
      label: "Example Link Text",
      name: "exampleLinkTexts",
      list: true
    },
    {
      type: "string",
      label: "Example Link Urls",
      name: "exampleLinkUrls",
      list: true
    }
  ]
};

// components/blocks/services.tsx
var servicesBlockSchema = {
  name: "services",
  label: "Services",
  ui: {
    previewSrc: "/blocks/services.png",
    defaultItem: {
      body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede."
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "image",
      label: "Image Urls",
      name: "imageUrls",
      list: true
    },
    // {
    //   type: 'rich-text',
    //   label: 'Body',
    //   name: 'body',
    // },
    {
      label: "Services",
      name: "services",
      type: "string",
      list: true
    },
    {
      label: "Services Description",
      name: "servicesDescription",
      type: "string",
      list: true
    },
    {
      type: "string",
      label: "Image Y offsets",
      name: "imageYOffsets",
      list: true
    },
    {
      type: "string",
      label: "Example Link Text",
      name: "exampleLinkTexts",
      list: true
    },
    {
      type: "string",
      label: "Example Link Urls",
      name: "exampleLinkUrls",
      list: true
    }
  ]
};

// components/blocks/filters.tsx
import React23, { useEffect as useEffect3 } from "react";
import { tinaField as tinaField12 } from "tinacms/dist/react";
var filtersBlockSchema = {
  name: "filters",
  label: "Filters",
  ui: {
    previewSrc: "/blocks/filter.png",
    defaultItem: {
      body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede."
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Filters",
      name: "filters"
      // comma separated filters
    },
    {
      type: "string",
      label: "Default Filter",
      name: "default"
    }
  ]
};

// components/blocks/spacer.tsx
var spacerBlockSchema = {
  name: "spacer",
  label: "Spacer",
  ui: {
    previewSrc: "/blocks/content.png",
    defaultItem: {
      height: "50px"
    }
  },
  fields: [
    {
      type: "string",
      label: "Height",
      name: "height",
      description: "Any valid CSS height value, e.g. 100px, 8rem, or 10vh."
    }
  ]
};

// components/blocks/contact.tsx
import React24 from "react";
import { tinaField as tinaField13 } from "tinacms/dist/react";
var contactBlockSchema = {
  name: "contact",
  label: "Contact",
  ui: {
    previewSrc: "/blocks/content.png",
    defaultItem: {
      title: "Contact",
      description: "Tell us about your project.",
      submitButtonText: "Send",
      successMessage: "Thanks! We will be in touch soon.",
      submitErrorMessage: "There was an error sending your message.",
      requiredMessage: "Please complete all required fields.",
      submitUrl: "https://example.com/contact",
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true
        },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          required: true
        }
      ]
    }
  },
  fields: [
    sectionBlockSchemaField,
    sectionBlackGlassSchemaField,
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea"
      }
    },
    {
      type: "string",
      label: "Submit URL",
      name: "submitUrl",
      required: true,
      description: "External endpoint that receives form data as JSON via POST."
    },
    {
      type: "string",
      label: "Submit Button Text",
      name: "submitButtonText",
      required: true
    },
    {
      type: "string",
      label: "Success Message",
      name: "successMessage",
      required: true
    },
    {
      type: "string",
      label: "Required Validation Message",
      name: "requiredMessage",
      required: true
    },
    {
      type: "string",
      label: "Submit Error Message",
      name: "submitErrorMessage",
      required: true
    },
    {
      type: "object",
      list: true,
      label: "Fields",
      name: "fields",
      ui: {
        defaultItem: {
          name: "field_name",
          label: "Field Label",
          type: "text",
          required: false,
          checkboxDefault: false
        },
        itemProps: (item) => ({
          label: item?.label || item?.name || "Field"
        })
      },
      fields: [
        {
          type: "string",
          label: "Field Name (payload key)",
          name: "name",
          required: true
        },
        {
          type: "string",
          label: "Label",
          name: "label",
          required: true
        },
        {
          type: "string",
          label: "Type",
          name: "type",
          required: true,
          options: [
            { label: "Text", value: "text" },
            { label: "Textarea", value: "textarea" },
            { label: "Checkbox", value: "checkbox" }
          ]
        },
        {
          type: "boolean",
          label: "Required",
          name: "required"
        },
        {
          type: "boolean",
          label: "Checkbox Default Checked",
          name: "checkboxDefault"
        }
      ]
    }
  ]
};

// components/blocks/opening-times.tsx
import { tinaField as tinaField14 } from "tinacms/dist/react";
var openingTimesBlockSchema = {
  name: "openingTimes",
  label: "Opening Times",
  ui: {
    previewSrc: "/blocks/opening-times.png",
    defaultItem: {
      title: "es::Horario de Apertura;;en::Opening Times",
      description: "es::Nuestro horario semanal;;en::Our weekly schedule",
      days: [
        { day: 0, hours: "9:00 - 21:00", closed: false },
        { day: 1, hours: "9:00 - 21:00", closed: false },
        { day: 2, hours: "9:00 - 21:00", closed: false },
        { day: 3, hours: "9:00 - 21:00", closed: false },
        { day: 4, hours: "9:00 - 21:00", closed: false },
        { day: 5, hours: "10:00 - 14:00", closed: false },
        { day: 6, hours: "", closed: true }
      ]
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Description",
      name: "description"
    },
    {
      type: "object",
      label: "Days",
      name: "days",
      list: true,
      ui: {
        defaultItem: {
          day: 0,
          hours: "9:00 - 21:00",
          closed: false
        },
        itemProps: (item) => {
          const dayLabels = [
            "Monday / Lunes",
            "Tuesday / Martes",
            "Wednesday / Mi\xE9rcoles",
            "Thursday / Jueves",
            "Friday / Viernes",
            "Saturday / S\xE1bado",
            "Sunday / Domingo"
          ];
          return {
            label: dayLabels[item?.day ?? 0] || `Day ${item?.day}`
          };
        }
      },
      fields: [
        {
          type: "number",
          label: "Day of Week",
          name: "day",
          description: "0 = Monday, 1 = Tuesday, \u2026 6 = Sunday",
          ui: {
            component: "select",
            options: [
              { label: "Monday / Lunes", value: 0 },
              { label: "Tuesday / Martes", value: 1 },
              { label: "Wednesday / Mi\xE9rcoles", value: 2 },
              { label: "Thursday / Jueves", value: 3 },
              { label: "Friday / Viernes", value: 4 },
              { label: "Saturday / S\xE1bado", value: 5 },
              { label: "Sunday / Domingo", value: 6 }
            ]
          }
        },
        {
          type: "string",
          label: "Hours",
          name: "hours",
          description: 'e.g. "9:00 - 21:00"'
        },
        {
          type: "boolean",
          label: "Closed",
          name: "closed"
        }
      ]
    }
  ]
};

// components/blocks/contact-map.tsx
import { tinaField as tinaField15 } from "tinacms/dist/react";
import dynamic5 from "next/dynamic";
import { useEffect as useEffect5, useState as useState6 } from "react";
var LeafletMap2 = dynamic5(
  () => Promise.resolve().then(() => (init_contact_map_leaflet(), contact_map_leaflet_exports)).then((mod) => mod.LeafletMap),
  { ssr: false, loading: () => React.createElement(MapSkeleton, null) }
);
function MapSkeleton() {
  return React.createElement("div", { className: "w-full aspect-[16/9] rounded-lg bg-muted animate-pulse flex items-center justify-center" }, React.createElement("span", { className: "text-muted-foreground text-sm" }, "Loading map\u2026"));
}
var contactMapBlockSchema = {
  name: "contactMap",
  label: "Contact Map",
  ui: {
    previewSrc: "/blocks/content.png",
    defaultItem: {
      title: "es::Encu\xE9ntranos;;en::Find Us",
      description: "es::Ven a visitarnos;;en::Come visit us",
      address: "Calle de Verdi 42, Gr\xE0cia, Barcelona",
      zoom: 16
    }
  },
  fields: [
    sectionBlockSchemaField,
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Description",
      name: "description"
    },
    {
      type: "string",
      label: "Address",
      name: "address",
      description: "Full street address. The map will geocode this automatically."
    },
    {
      type: "number",
      label: "Zoom Level",
      name: "zoom",
      description: "Map zoom (1 = world, 18 = building). Default: 16"
    }
  ]
};

// tina/collection/page.ts
var Page = {
  label: "Pages",
  name: "page",
  path: "content/pages",
  format: "mdx",
  ui: {
    router: ({ document: document2 }) => {
      const filepath = document2._sys.breadcrumbs.join("/");
      if (filepath === "home") {
        return "/";
      }
      return `/${filepath}`;
    }
  },
  fields: [
    {
      type: "string",
      name: "theme",
      label: "Page Theme",
      description: 'Optional CSS theme class applied to this page (e.g. "pasteleria")'
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Sections",
      ui: {
        visualSelector: true
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
        contactMapBlockSchema
      ]
    }
  ]
};
var page_default = Page;

// tina/collection/tag.ts
var Tag = {
  label: "Tags",
  name: "tag",
  path: "content/tags",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Name",
      name: "name",
      isTitle: true,
      required: true
    }
  ]
};
var tag_default = Tag;

// tina/config.tsx
var config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "dummy-client-id",
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || // custom branch env override
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || // Vercel branch env
  process.env.HEAD || // Netlify branch env
  "main",
  token: process.env.TINA_TOKEN || "dummy-token",
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads"
    }
  },
  build: {
    publicFolder: "public",
    // The public asset folder for your framework
    outputFolder: "admin",
    // within the public folder
    basePath: next_config_default.basePath?.replace(/^\//, "") || ""
    // The base path of the app (could be /blog)
  },
  schema: {
    collections: [page_default, post_default, author_default, tag_default, global_default]
  }
});
var config_default = config;
export {
  config_default as default
};
