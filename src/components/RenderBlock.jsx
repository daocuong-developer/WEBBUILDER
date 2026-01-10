import React from "react";
import HeadingBlock from "@/components/Blocks/HeadingBlock";
import ParagraphBlock from "@/components/Blocks/ParagraphBlock";
import ButtonBlock from "@/components/Blocks/ButtonBlock";
import ImageBlock from "@/components/Blocks/ImageBlock";
import ContainerBlock from "@/components/Blocks/ContainerBlock";
import QuoteBlock from "@/components/Blocks/QuoteBlock";
import RichtextBlock from "@/components/Blocks/RichtextBlock";
import IconBlock from "@/components/Blocks/IconBlock";
import SectionBlock from "@/components/Blocks/SectionBlock";
import ColumnsBlock from "@/components/Blocks/ColumnsBlock";
import DividerBlock from "@/components/Blocks/SpacerBlock";
import GalleryBlock from "@/components/Blocks/GalleryBlock";
import VideoBlock from "@/components/Blocks/VideoBlock";
import AudioBlock from "@/components/Blocks/AudioBlock";
import FormBlock from "@/components/Blocks/FormBlock";
import CtaBlock from "@/components/Blocks/CtaBlock";
import TestimonialBlock from "@/components/Blocks/TestimonialBlock";
import AccordionBlock from "@/components/Blocks/AccordionBlock";
import TabsBlock from "@/components/Blocks/TabsBlock";
import SocialBlock from "@/components/Blocks/SocialBlock";
import MapBlock from "@/components/Blocks/MapBlock";
import EmbedBlock from "@/components/Blocks/EmbedBlock";
import HeaderBlock from "@/components/Blocks/HeaderBlock";
import FooterBlock from "@/components/Blocks/FooterBlock";

export default function RenderBlockComponent({
  block,
  blocks,
  onSelect,
  onChange,
  isPreview = false,
  onSelectColumn,
  selectedColumnInfo,
}) {
  if (!block || typeof block !== "object" || !block.type) {
    return null;
  }

  const commonBlockProps = {
    block,
    blocks,
    onSelect: onSelect,
    onChange,
    isPreview,
    onSelectColumn,
    selectedColumnInfo,
  };

  switch (block.type) {
    case "heading":
      return <HeadingBlock {...commonBlockProps} />;
    case "paragraph":
      return <ParagraphBlock {...commonBlockProps} />;
    case "button":
      return <ButtonBlock {...commonBlockProps} />;
    case "image":
      return <ImageBlock {...commonBlockProps} />;
    case "container":
      return <ContainerBlock {...commonBlockProps} />;
    case "quote":
      return <QuoteBlock {...commonBlockProps} />;
    case "richtext":
      return <RichtextBlock {...commonBlockProps} />;
    case "icon":
      return <IconBlock {...commonBlockProps} />;
    case "section":
      return <SectionBlock {...commonBlockProps} />;
    case "columns":
      return <ColumnsBlock {...commonBlockProps} />;
    // case "spacer":
    //     return <SpacerBlock {...commonBlockProps} />;
    case "divider":
      return <DividerBlock {...commonBlockProps} />;
    case "gallery":
      return <GalleryBlock {...commonBlockProps} />;
    case "video":
      return <VideoBlock {...commonBlockProps} />;
    case "audio":
      return <AudioBlock {...commonBlockProps} />;
    case "form":
      return <FormBlock {...commonBlockProps} />;
    case "cta":
      return <CtaBlock {...commonBlockProps} />;
    case "testimonial":
      return <TestimonialBlock {...commonBlockProps} />;
    case "accordion":
      return <AccordionBlock {...commonBlockProps} />;
    case "tabs":
      return <TabsBlock {...commonBlockProps} />;
    case "social":
      return <SocialBlock {...commonBlockProps} />;
    case "map":
      return <MapBlock {...commonBlockProps} />;
    case "embed":
      return <EmbedBlock {...commonBlockProps} />;
    case "header":
      return <HeaderBlock {...commonBlockProps} />;
    case "footer":
      return <FooterBlock {...commonBlockProps} />;
    default:
      // Optional: A fallback for unknown block types
      return (
        <div
          className="p-4 bg-red-100 text-red-700 border border-red-400 rounded-md"
          onClick={handleSelect}
        >
          Unknown Block Type: <strong>{block.type}</strong> (ID: {block.id})
        </div>
      );
  }
}
