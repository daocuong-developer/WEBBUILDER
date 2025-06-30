// HeaderOptions.jsx
import React from "react";

const HeaderOptions = ({ block, handleChange }) => {
    const renderInput = (label, key, type = "text") => (
        <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                value={block.props[key] || ""}
                onChange={(e) => handleChange(key, type === "number" ? Number(e.target.value) : e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
            />
        </div>
    );

    const renderToggle = (label, key) => (
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-700">{label}</label>
            <input type="checkbox" checked={!!block.props[key]} onChange={(e) => handleChange(key, e.target.checked)} />
        </div>
    );

    const handleNavLinkChange = (index, key, value) => {
        const updatedLinks = [...(block.props.navLinks || [])];
        updatedLinks[index][key] = value;
        handleChange("navLinks", updatedLinks);
    };

    const handleSubmenuChange = (navIndex, subIndex, key, value) => {
        const updatedLinks = [...(block.props.navLinks || [])];
        const submenu = updatedLinks[navIndex].submenu || [];
        submenu[subIndex][key] = value;
        updatedLinks[navIndex].submenu = submenu;
        handleChange("navLinks", updatedLinks);
    };

    const addNavLink = () => {
        const updatedLinks = [...(block.props.navLinks || []), { text: "New Link", href: "#", submenu: [] }];
        handleChange("navLinks", updatedLinks);
    };

    const removeNavLink = (index) => {
        const updatedLinks = [...(block.props.navLinks || [])];
        updatedLinks.splice(index, 1);
        handleChange("navLinks", updatedLinks);
    };

    const moveNavLink = (index, direction) => {
        const updatedLinks = [...(block.props.navLinks || [])];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= updatedLinks.length) return;
        [updatedLinks[index], updatedLinks[targetIndex]] = [updatedLinks[targetIndex], updatedLinks[index]];
        handleChange("navLinks", updatedLinks);
    };

    const addSubmenu = (navIndex) => {
        const updatedLinks = [...(block.props.navLinks || [])];
        updatedLinks[navIndex].submenu = updatedLinks[navIndex].submenu || [];
        updatedLinks[navIndex].submenu.push({ text: "Sub Item", href: "#" });
        handleChange("navLinks", updatedLinks);
    };

    const removeSubmenu = (navIndex, subIndex) => {
        const updatedLinks = [...(block.props.navLinks || [])];
        updatedLinks[navIndex].submenu.splice(subIndex, 1);
        handleChange("navLinks", updatedLinks);
    };

    return (
        <div>
            {renderInput("Brand Name", "brandName")}
            {renderInput("Logo URL", "logoSrc")}
            {renderInput("Logo Alt Text", "logoAlt")}
            {renderInput("Logo Height", "logoHeight")}
            {renderInput("Logo Max Width", "logoMaxWidth")}
            {renderInput("Background Color", "backgroundColor", "color")}
            {renderInput("Text Color", "color", "color")}
            {renderInput("Padding", "padding")}
            {renderInput("Height", "height")}
            {renderInput("Box Shadow", "boxShadow")}
            {renderToggle("Fixed Header", "isFixed")}

            <hr className="my-4" />

            {renderInput("Navigation Link Color", "navLinkColor", "color")}
            {renderInput("Navigation Hover Color", "navLinkHoverColor", "color")}
            {renderInput("Font Size (px)", "navLinkFontSize")}
            {renderInput("Font Weight", "navLinkFontWeight")}

            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Navigation Alignment</label>
                <select
                    value={block.props.navAlignment || "right"}
                    onChange={(e) => handleChange("navAlignment", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Navigation Links</label>
                {(block.props.navLinks || []).map((link, index) => (
                    <div key={index} className="border p-2 rounded mb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <input
                                type="text"
                                value={link.text}
                                onChange={(e) => handleNavLinkChange(index, "text", e.target.value)}
                                placeholder="Text"
                                className="border rounded px-2 py-1 text-sm w-1/3"
                            />
                            <input
                                type="text"
                                value={link.href}
                                onChange={(e) => handleNavLinkChange(index, "href", e.target.value)}
                                placeholder="Href"
                                className="border rounded px-2 py-1 text-sm w-1/2"
                            />
                            <button type="button" onClick={() => moveNavLink(index, -1)} className="text-xs px-1">
                                ↑
                            </button>
                            <button type="button" onClick={() => moveNavLink(index, 1)} className="text-xs px-1">
                                ↓
                            </button>
                            <button type="button" onClick={() => removeNavLink(index)} className="text-xs text-red-500">
                                ✕
                            </button>
                        </div>

                        {/* Submenu Management */}
                        {(link.submenu || []).map((sub, subIdx) => (
                            <div key={subIdx} className="ml-4 flex items-center gap-2 mb-1">
                                <input
                                    type="text"
                                    value={sub.text}
                                    onChange={(e) => handleSubmenuChange(index, subIdx, "text", e.target.value)}
                                    placeholder="Submenu Text"
                                    className="border rounded px-2 py-1 text-sm w-1/3"
                                />
                                <input
                                    type="text"
                                    value={sub.href}
                                    onChange={(e) => handleSubmenuChange(index, subIdx, "href", e.target.value)}
                                    placeholder="Submenu Href"
                                    className="border rounded px-2 py-1 text-sm w-1/2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSubmenu(index, subIdx)}
                                    className="text-xs text-red-500"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addSubmenu(index)} className="ml-4 text-xs text-blue-600">
                            + Add Submenu
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addNavLink} className="mt-2 text-xs text-blue-600">
                    + Add Link
                </button>
            </div>

            {renderToggle("Show Search Box", "showSearch")}
            {renderInput("Search Placeholder", "searchPlaceholder")}

            {renderToggle("Show Sign Up Button", "showSignUp")}
            {renderInput("Sign Up Text", "signUpText")}
            {renderInput("Sign Up Link", "signUpLink")}
            {renderInput("Sign Up Background Color", "signUpBgColor", "color")}
            {renderInput("Sign Up Text Color", "signUpTextColor", "color")}

            {renderToggle("Show Sign In Link", "showSignIn")}
            {renderInput("Sign In Text", "signInText")}
            {renderInput("Sign In Link", "signInLink")}
            {renderInput("Sign In Text Color", "signInTextColor", "color")}
        </div>
    );
};

export default HeaderOptions;
