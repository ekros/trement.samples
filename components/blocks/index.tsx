import { tinaField } from "tinacms/dist/react";
import { Page, PageBlocks } from "../../tina/__generated__/types";
import { Hero } from "./hero";
import { Content } from "./content";
import { Features } from "./features";
import { Testimonial } from "./testimonial";
import { Video } from "./video";
import { Callout } from "./callout";
import { Stats } from "./stats";
import { CallToAction } from "./call-to-action";
import { VideoHero } from "./video-hero";
import { About } from "./about";
import { Services } from "./services";
import { Filters } from "./filters";
import { Slideshow } from "./slideshow";
import { Spacer } from "./spacer";
import { Contact } from "./contact";
import { OpeningTimes } from "./opening-times";
import { ContactMap } from "./contact-map";

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values">) => {
  if (!props.blocks) return null;
  return (
    <>
      {props.blocks.map(function (block, i) {
        if (!block) return null;
        return (
          <div key={i} data-tina-field={tinaField(block)}>
            <Block {...block} />
          </div>
        );
      })}
    </>
  );
};

const Block = (block: PageBlocks) => {
  switch ((block as any).__typename) {
    case "PageBlocksVideo":
      return <Video data={block as any} />;
    case "PageBlocksVideo_hero":
      return <VideoHero data={block as any} />;
    case "PageBlocksHero":
      return <Hero data={block as any} />;
    case "PageBlocksCallout":
      return <Callout data={block as any} />;
    case "PageBlocksStats":
      return <Stats data={block as any} />;
    case "PageBlocksContent":
      return <Content data={block as any} />;
    case "PageBlocksFeatures":
      return <Features data={block as any} />;
    case "PageBlocksTestimonial":
      return <Testimonial data={block as any} />;
    case "PageBlocksCta":
      return <CallToAction data={block as any} />;
    case "PageBlocksAbout":
      return <About data={block as any} />;
    case "PageBlocksServices":
      return <Services data={block as any} />;
    case "PageBlocksFilters":
      return <Filters data={block as any} />;
    case "PageBlocksSlideshow":
      return <Slideshow data={block as any} />;
    case "PageBlocksSpacer":
      return <Spacer data={block as any} />;
    case "PageBlocksContact":
      return <Contact data={block as any} />;
    case "PageBlocksOpeningTimes":
      return <OpeningTimes data={block as any} />;
    case "PageBlocksContactMap":
      return <ContactMap data={block as any} />;
    default:
      if (process.env.NODE_ENV !== "production") {
        console.warn("Unknown page block type:", (block as any)?.__typename, block);
      }
      return null;
  }
};
