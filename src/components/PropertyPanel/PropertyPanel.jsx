// src/components/PropertyPanel/PropertyPanel.jsx
import React from "react";

// Import tất cả các component con render thuộc tính
import TextOptions from "./properties/textOptions";
import ButtonOptions from "./properties/buttonOptions";
import ImageOptions from "./properties/imageOptions";
import ContainerOptions from "./properties/containerOptions";
import QuoteOptions from "./properties/quoteOptions";
import RichtextOptions from "./properties/richtextOptions";
import IconOptions from "./properties/iconOptions";
import SectionOptions from "./properties/sectionOptions";
import ColumnsOptions from "./properties/columnsOptions";
import SpacerOptions from "./properties/spacerOptions";
import DividerOptions from "./properties/dividerOptions";
import GalleryOptions from "./properties/galleryOptions"; 
import VideoOptions from "./properties/videoOptions";
import AudioOptions from "./properties/audioOptions";
import FormOptions from "./properties/formOptions";
import CtaOptions from "./properties/ctaOptions";
import TestimonialOptions from "./properties/testimonialOptions";
import AccordionOptions from "./properties/accordionOptions";
import TabsOptions from "./properties/tabsOptions";
import SocialOptions from "./properties/socialOptions";
import MapOptions from "./properties/mapOptions";
import EmbedOptions from "./properties/embedOptions";
import HeaderOptions from "./properties/headerOptions";
import FooterOptions from "./properties/footerOptions";

export default function PropertyPanel({ block = { selectedContainerBlock }, onChange = { handleChange } }) {
    const handleChange = (key, value) => {
        if (key === "level") {
            const fontSizeMap = {
                h1: 32,
                h2: 28,
                h3: 24,
                h4: 20,
                h5: 16,
                h6: 14,
            };
            onChange({
                ...block,
                props: {
                    ...block.props,
                    [key]: value,
                    fontSize: fontSizeMap[value] || 16,
                },
            });
            return;
        }

        onChange({
            ...block,
            props: {
                ...block.props,
                [key]: value,
            },
        });
    };

    // Hàm render Text Content chung (cho heading và paragraph)
    const renderTextContentInput = () => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
            <textarea
                className="w-full border rounded px-2 py-1"
                rows="3"
                value={block.props.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
            />
        </div>
    );

    // Hàm render Heading Level (chỉ cho heading)
    const renderHeadingLevelSelect = () => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading Level</label>
            <select
                className="w-full border rounded px-2 py-1"
                value={block.props.level || "h1"}
                onChange={(e) => handleChange("level", e.target.value)}
            >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
            </select>
        </div>
    );

    return (
        <div className="space-y-4 p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Component Properties</h3>
            {block ? (
                (() => {
                    const commonProps = { block, handleChange };

                    switch (block.type) {
                        case "heading":
                            return (
                                <>
                                    {renderTextContentInput()}
                                    {renderHeadingLevelSelect()}
                                    <TextOptions {...commonProps} />
                                </>
                            );
                        case "paragraph":
                            return (
                                <>
                                    {renderTextContentInput()}
                                    <TextOptions {...commonProps} />
                                </>
                            );
                        case "button":
                            return <ButtonOptions {...commonProps} />;
                        case "image":
                            return <ImageOptions {...commonProps} />;
                        case "container":
                            return <ContainerOptions {...commonProps} />;
                        case "quote":
                            return <QuoteOptions {...commonProps} />;
                        case "richtext":
                            return <RichtextOptions {...commonProps} />;
                        case "icon":
                            return <IconOptions {...commonProps} />;
                        case "section":
                            return <SectionOptions {...commonProps} />;
                        case "columns":
                            return <ColumnsOptions {...commonProps} />;
                        case "spacer":
                            return <SpacerOptions {...commonProps} />;
                        case "divider":
                            return <DividerOptions {...commonProps} />;
                        case "gallery": // Mới thêm
                            return <GalleryOptions {...commonProps} />;
                        case "video":
                            return <VideoOptions {...commonProps} />;
                        case "audio":
                            return <AudioOptions {...commonProps} />;
                        case "form":
                            return <FormOptions {...commonProps} />;
                        case "cta":
                            return <CtaOptions {...commonProps} />;
                        case "testimonial":
                            return <TestimonialOptions {...commonProps} />;
                        case "accordion":
                            return <AccordionOptions {...commonProps} />;
                        case "tabs":
                            return <TabsOptions {...commonProps} />;
                        case "social":
                            return <SocialOptions {...commonProps} />;
                        case "map":
                            return <MapOptions {...commonProps} />;
                        case "embed":
                            return <EmbedOptions {...commonProps} />;
                        case "header":
                            return <HeaderOptions {...commonProps} />;
                        case "footer":
                            return <FooterOptions {...commonProps} />;
                        default:
                            return <p className="text-gray-600">No properties available for this component type.</p>;
                    }
                })()
            ) : (
                <p className="text-gray-600">Select a component to see its properties.</p>
            )}
        </div>
    );
}
