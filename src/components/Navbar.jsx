// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Folder,
  LayoutGrid,
  FileText,
  Eye,
  Code2,
  Save,
  Home,
  ChevronDown,
  Menu,
  File,
  Plus,
  Settings,
  Layers,
  Undo,
  Redo,
} from "lucide-react";

import ProjectManager from "@/components/ProjectManager";
import PageManager from "@/components/PageManager";
import PostManager from "@/components/PostManager";
import { handleExport } from "@/utils/exportHtml";
import { useSave } from "@/contexts/SaveContext";
import { toast } from "react-toastify";
import PreviewModal from "@/pages/PreviewModal";
import { useUndo } from "@/contexts/UndoContext";

export default function Navbar({ handleSave }) {
  const [showPosts, setShowPosts] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pagesRef = useRef();
  const postsRef = useRef();
  const projectDropdownRef = useRef();
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showPageManager, setShowPageManager] = useState(false);
  const [showPagesDropdown, setShowPagesDropdown] = useState(false);

    const pages = JSON.parse(localStorage.getItem("pages")) || [];
    const currentPageId = localStorage.getItem("currentPageId");
    const currentPage = pages.find((p) => p.id === currentPageId);
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const navigate = useNavigate();
    const { recordState, handleUndo, handleRedo, canUndo, canRedo } = useUndo();


  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentProject, setCurrentProject] = useState(() => {
    return JSON.parse(localStorage.getItem("currentProject")) || null;
  });

  const projectPages = pages.filter(
    (page) => page.projectId === currentProject?.id,
  );
  const { saveFn } = useSave();

  // preview
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleClick = () => {
    if (saveFn) {
      saveFn();
    } else toast.success("Không có gì để lưu hoặc chưa vào trang chỉnh sửa.");
  };

  useEffect(() => {
    const stored = localStorage.getItem("currentProject");
    if (stored) {
      try {
        setCurrentProject(JSON.parse(stored));
      } catch (err) {
        console.error("Invalid currentProject in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    const handleCloseProject = () => {
      setShowProjectManager(false);

      setProjects(JSON.parse(localStorage.getItem("projects")) || []);
      setCurrentProject(
        JSON.parse(localStorage.getItem("currentProject")) || null,
      );
    };
    const handleClosePage = () => setShowPageManager(false);

    window.addEventListener("close-project-manager", handleCloseProject);
    window.addEventListener("close-page-manager", handleClosePage);
    return () => {
      window.removeEventListener("close-project-manager", handleCloseProject);
      window.removeEventListener("close-page-manager", handleClosePage);
    };
  }, []);

  const handleProjectsUpdate = (updatedProjects, newCurrentProject = null) => {
    setProjects(updatedProjects);
    if (newCurrentProject) {
      setCurrentProject(newCurrentProject);
      localStorage.setItem("currentProject", JSON.stringify(newCurrentProject));
    }
  };

  return (
    <div className="border-b shadow-sm bg-white">
      <div className="flex justify-between items-center px-4 py-3">
        <div className=" flex items-center gap-4">
          <Link to="/" className="flex items-center text-xl font-bold">
            <span className="mr-2">
              <Layers size={24} />
            </span>
            Web Builder
          </Link>

          <div className="hidden sm:flex items-center gap-4">
            {/* projectDropdownRef */}
            <div className="relative" ref={projectDropdownRef}>
              <button
                onClick={() => setShowProjectDropdown((prev) => !prev)}
                className="min-w-[200px] border px-3 py-1 rounded flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder size={16} />
                  {currentProject?.name || "Select Project"}
                </div>
                <ChevronDown size={16} />
              </button>

              {showProjectDropdown && (
                <div className="absolute z-50 left-0 mt-1 w-[200px] bg-white border rounded shadow-md  animate-in fade-in slide-in-from-top-1 duration-100">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        localStorage.setItem(
                          "currentProject",
                          JSON.stringify(project),
                        );
                        setCurrentProject(project);
                        setShowProjectDropdown(false);
                        navigate(`/post/${project.id}`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <Folder size={16} /> {project.name}
                    </button>
                  ))}
                  <div className="border-t my-1" />
                  <button
                    onClick={() => {
                      setShowProjectDropdown(false);
                      setShowProjectManager(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Plus size={16} /> New Project
                  </button>
                  <button
                    onClick={() => {
                      setShowProjectDropdown(false);
                      setShowProjectManager(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings size={16} /> Manage Projects
                  </button>
                </div>
              )}

              {/* Truyền handleProjectsUpdate và setCurrentProject xuống ProjectManager */}
              {showProjectManager && (
                <ProjectManager
                  onClose={() => setShowProjectManager(false)}
                  onProjectsUpdate={handleProjectsUpdate}
                />
              )}
            </div>

            {/* Home Dropdown from Pages */}
            <div className="relative" ref={pagesRef}>
              <button
                onClick={() => setShowPagesDropdown(!showPagesDropdown)}
                className="w-56 border px-3 py-1 rounded flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  {currentPage?.id === currentPageId ? (
                    <Home size={16} />
                  ) : (
                    <File size={16} />
                  )}
                  {currentPage?.name || "Home"}
                </div>
                <ChevronDown size={16} />
              </button>

              {showPagesDropdown && (
                <div className="absolute left-0 mt-1 w-56 bg-white border rounded shadow-md z-20">
                  {projectPages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        localStorage.setItem("currentPageId", page.id);
                        navigate(`/edit-page/${page.id}`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      {page.id === currentPageId ? (
                        <Home size={16} />
                      ) : (
                        <File size={16} />
                      )}
                      {page.name}
                    </button>
                  ))}

                  <div className="border-t my-1"></div>
                  <button
                    onClick={() => setShowPageManager(true)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Plus size={16} /> Add New Page
                  </button>
                  <button
                    onClick={() => setShowPageManager(true)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings size={16} /> Manage Pages
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="border p-2 rounded"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setShowProjectManager(true)}
            className="border px-3 py-1 rounded flex items-center gap-2"
          >
            <Folder size={16} /> Project
          </button>

          {showProjectManager && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
                {/* Truyền handleProjectsUpdate và setCurrentProject xuống ProjectManager */}
                <ProjectManager
                  onClose={() => setShowProjectManager(false)}
                  onProjectsUpdate={handleProjectsUpdate}
                />
              </div>
            </div>
          )}

          <div className="relative" ref={pagesRef}>
            <button
              onClick={() => setShowPageManager(true)}
              className="border px-3 py-1 rounded flex items-center gap-2"
            >
              <LayoutGrid size={16} /> Pages
            </button>

            {showPageManager && <PageManager />}
          </div>

          <div className="relative" ref={postsRef}>
            <button
              onClick={() => setShowPosts(!showPosts)}
              className="border px-3 py-1 rounded flex items-center gap-2"
            >
              <FileText size={16} /> Posts
            </button>
            {showPosts && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowPosts(false);
                }}
              >
                <PostManager onClose={() => setShowPosts(false)} />
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPreviewModal(true)}
            className="border px-3 py-1 rounded flex items-center gap-2"
          >
            <Eye size={16} /> Preview
          </button>

          <button
            onClick={handleExport}
            className="border px-3 py-1 rounded flex items-center gap-2"
          >
            <Code2 size={16} /> Export
          </button>
          <button
            onClick={handleClick}
            className="border px-3 py-1 rounded flex items-center gap-2"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <PreviewModal
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
}
