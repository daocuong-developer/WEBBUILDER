// // utils/componentCategories.js
// const componentCategories = [
//   {
//     id: "basic",
//     label: "Basic Components",
//     icon: "square",
//     components: [
//       { type: "heading", label: "Heading", icon: "heading" },
//       { type: "paragraph", label: "Paragraph", icon: "text" },
//       { type: "button", label: "Button", icon: "mouse" },
//     ],
//   },
//   {
//     id: "media",
//     label: "Media",
//     icon: "image",
//     components: [{ type: "image", label: "Image", icon: "image" }],
//   },
//   {
//     id: "layout",
//     label: "Layout",
//     icon: "layout",
//     components: [{ type: "container", label: "Container", icon: "layout" }],
//   },
// ];

// export default componentCategories;

const componentCategories = [
    {
        id: "basic",
        label: "Basic Components",
        icon: "square",
        components: [
            { type: "heading", label: "Heading", icon: "heading" },
            { type: "paragraph", label: "Paragraph", icon: "text" },
            { type: "button", label: "Button", icon: "mouse" },
            { type: "quote", label: "Quote", icon: "quote" },
            { type: "richtext", label: "Rich Text", icon: "italic" },
            { type: "icon", label: "Icon", icon: "star" },
        ],
    },
    {
        id: "layout",
        label: "Layout",
        icon: "layout",
        components: [
            { type: "container", label: "Container", icon: "layout" },
            { type: "section", label: "Section", icon: "square" },
            { type: "columns", label: "Column Layout", icon: "columns" },
            { type: "spacer", label: "Spacer", icon: "arrow-down" },
            { type: "divider", label: "Divider", icon: "minus" },
        ],
    },
    {
        id: "media",
        label: "Media",
        icon: "image",
        components: [
            { type: "image", label: "Image", icon: "image" },
            { type: "gallery", label: "Image Gallery", icon: "images" },
            { type: "video", label: "Video", icon: "video" },
            { type: "audio", label: "Audio", icon: "music" },
        ],
    },
    {
        id: "interactive",
        label: "Interactive",
        icon: "cursor",
        components: [
            { type: "form", label: "Form", icon: "form-input" },
            { type: "cta", label: "Call to Action", icon: "megaphone" },
            { type: "testimonial", label: "Testimonial", icon: "message-square" },
            { type: "accordion", label: "Accordion", icon: "chevron-down" },
            { type: "tabs", label: "Tabs", icon: "layout-panel-top" },
        ],
    },
    {
        id: "utility",
        label: "Utility",
        icon: "settings",
        components: [
            { type: "social", label: "Social Share", icon: "share-2" },
            { type: "map", label: "Map", icon: "map-pin" },
            { type: "embed", label: "Embed Code", icon: "code" },
        ],
    },
    {
        id: "navigation",
        label: "Header & Footer",
        icon: "menu",
        components: [
            { type: "header", label: "Header", icon: "menu" },
            { type: "footer", label: "Footer Block", icon: "layout-panel-top" },
        ],
    },
];

export default componentCategories;
