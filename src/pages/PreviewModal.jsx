import React, { useState, useEffect } from "react";
import {
  X,
  Home,
  ChevronLeft,
  ChevronRight,
  Monitor,
  TabletSmartphone,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import RenderBlock from "@/components/RenderBlock";

// Device presets with their dimensions
const devicePresets = {
  desktop: { width: 1240, height: 800, name: "Desktop" },
  tablet: { width: 768, height: 1024, name: "iPad" },
  mobile: {
    "iphone-se": { width: 375, height: 667, name: "iPhone SE" },
    "iphone-12": { width: 390, height: 844, name: "iPhone 12/13/14" },
    "iphone-12-pro-max": { width: 428, height: 926, name: "iPhone 12 Pro Max" },
    "samsung-s21": { width: 360, height: 800, name: "Samsung Galaxy S21" },
    "samsung-s21-ultra": { width: 384, height: 854, name: "Samsung S21 Ultra" },
    "pixel-7": { width: 393, height: 851, name: "Google Pixel 7" },
  },
};

export default function PreviewModal({ open, onClose }) {
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [device, setDevice] = useState("desktop");
  const [mobileDevice, setMobileDevice] = useState("iphone-12");
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const isPreview = true;

  useEffect(() => {
    const storedPages = JSON.parse(localStorage.getItem("pages")) || [];
    const currentPageId = localStorage.getItem("currentPageId");
    const currentProject = JSON.parse(localStorage.getItem("currentProject"));
    setProjectName(currentProject?.name || "Project");

    const filtered = storedPages.filter(
      (page) => page.projectId === currentProject?.id,
    );

    const currentIndex = filtered.findIndex((p) => p.id === currentPageId);
    setPages(filtered);
    setCurrentPageIndex(currentIndex !== -1 ? currentIndex : 0);
  }, [open]);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMobileDropdown &&
        !event.target.closest(".mobile-dropdown-container")
      ) {
        setShowMobileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileDropdown]);

  const currentPage = pages[currentPageIndex];

  const currentBlocks = currentPage?.id
    ? JSON.parse(localStorage.getItem(`page_data_${currentPage.id}`)) || []
    : [];
  // Get current device dimensions
  const getCurrentDeviceDimensions = () => {
    if (device === "mobile") {
      return devicePresets.mobile[mobileDevice];
    }
    return devicePresets[device];
  };

  const currentDimensions = getCurrentDeviceDimensions();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="p-4 max-h-[95vh]">
        <div
          className="bg-white rounded shadow transition-all duration-300 border"
          style={{ width: `${currentDimensions.width}px` }}
        >
          {/* Header */}
          {/* <div className="flex justify-between items-center border-b px-4 py-2">
                        <h2 className="text-lg font-semibold">
                            Preview: {projectName} - {currentPage?.name}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPageIndex === 0}
                                onClick={() => setCurrentPageIndex((prev) => prev - 1)}
                                className="border rounded px-2 py-1 disabled:opacity-30"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm">
                                Page {currentPageIndex + 1} of {pages.length}
                            </span>
                            <button
                                disabled={currentPageIndex === pages.length - 1}
                                onClick={() => setCurrentPageIndex((prev) => prev + 1)}
                                className="border rounded px-2 py-1 disabled:opacity-30"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPageIndex(0)}
                                className="border rounded px-2 py-1"
                                title="Go to Home Page"
                            >
                                <Home size={16} />
                            </button>
                            <button onClick={onClose} className="ml-2 hover:text-red-500">
                                <X size={18} />
                            </button>
                        </div>
                    </div> */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
            <h2 className="text-lg font-semibold min-w-0 truncate">
              Preview: {projectName} - {currentPage?.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {/* Device Toggle */}
              <div className="flex items-center gap-1 border px-2 py-1 rounded">
                <button
                  onClick={() => setDevice("desktop")}
                  className={`p-1 rounded hover:bg-gray-100 ${device === "desktop" ? "bg-gray-200" : ""}`}
                  title="Desktop"
                >
                  <Monitor size={16} />
                </button>
                <button
                  onClick={() => setDevice("tablet")}
                  className={`p-1 rounded hover:bg-gray-100 ${device === "tablet" ? "bg-gray-200" : ""}`}
                  title="Tablet"
                >
                  <TabletSmartphone size={16} />
                </button>
                <button
                  onClick={() => setDevice("mobile")}
                  className={`p-1 rounded hover:bg-gray-100 ${device === "mobile" ? "bg-gray-200" : ""}`}
                  title="Mobile"
                >
                  <Smartphone size={16} />
                </button>
              </div>

              {/* Mobile Device Dropdown */}
              {device === "mobile" && (
                <div className="relative mobile-dropdown-container">
                  <button
                    onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                    className="flex items-center gap-1 border px-2 py-1 rounded text-sm hover:bg-gray-50"
                  >
                    <span>{devicePresets.mobile[mobileDevice].name}</span>
                    <ChevronDown size={14} />
                  </button>
                  {showMobileDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[200px]">
                      {Object.entries(devicePresets.mobile).map(
                        ([key, preset]) => (
                          <button
                            key={key}
                            onClick={() => {
                              setMobileDevice(key);
                              setShowMobileDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                              mobileDevice === key ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-gray-500 text-xs">
                              {preset.width} × {preset.height}
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Current Dimensions Display */}
              <div className="text-sm text-gray-600 border px-2 py-1 rounded bg-gray-50">
                {currentDimensions.width} × {currentDimensions.height}px
              </div>

              <button
                disabled={currentPageIndex === 0}
                onClick={() => setCurrentPageIndex((prev) => prev - 1)}
                className="border rounded px-2 py-1 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm">
                Page {currentPageIndex + 1} of {pages.length}
              </span>
              <button
                disabled={currentPageIndex === pages.length - 1}
                onClick={() => setCurrentPageIndex((prev) => prev + 1)}
                className="border rounded px-2 py-1 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPageIndex(0)}
                className="border rounded px-2 py-1"
                title="Go to Home Page"
              >
                <Home size={16} />
              </button>
              <button onClick={onClose} className="ml-2 hover:text-red-500">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className="overflow-y-auto p-4"
            style={{
              maxHeight: "calc(90vh - 48px)",
              position: "relative",
            }}
          >
            <div
              style={{
                pointerEvents: isPreview ? "none" : "auto",
              }}
            >
              {isPreview ? (
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "16px",
                    backgroundColor: "#fff",
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {currentBlocks && currentBlocks.length > 0 ? (
                    currentBlocks.map((block) => (
                      <div key={block.id} style={{ marginBottom: "12px" }}>
                        <RenderBlock
                          block={block}
                          blocks={currentBlocks}
                          isPreview={true}
                        />
                      </div>
                    ))
                  ) : (
                    <div
                      className="text-gray-400 text-center italic"
                      style={{
                        margin: "auto",
                        fontSize: "1rem",
                      }}
                    >
                      This page is empty. Add elements to see a preview.
                    </div>
                  )}
                </div>
              ) : (
                currentBlocks.map((block) => (
                  <RenderBlock
                    key={block.id}
                    block={block}
                    blocks={currentBlocks}
                    isPreview={false}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
