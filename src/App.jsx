// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddPage from "./pages/AddPage";
import AddPost from "./pages/AddPost";
import ManagePosts from "./pages/ManagePosts";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import CustomPage from "./pages/CustomPage";
import EditablePage from "@/pages/EditablePage";
import PreviewModal from "@/pages/PreviewModal";

export default function App() {
    const pages = JSON.parse(localStorage.getItem("pages")) || [];
    const currentPageId = localStorage.getItem("currentPage");
    const currentPage = pages.find((p) => p.id === currentPageId);

    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Mặc định chuyển hướng về trang "current" */}
                {/* <Route path="/" element={currentPage ? <Navigate to={currentPage.slug} /> : <Home />} /> */}
                <Route path="/" element={<Home />} />

                {/* Các route có sẵn */}
                <Route path="/add-page" element={<AddPage />} />
                <Route path="/add-post" element={<AddPost />} />
                <Route path="/manage-posts" element={<ManagePosts />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
                <Route path="/preview" element={<PreviewModal />} />
                
                {/* Các page được tạo từ PageManager */}
                {pages.map((page) => (
                    <Route key={page.id} path={page.slug} element={<CustomPage page={page} />} />
                ))}

                {/* <Route path="/edit-page/:id" element={<EditablePage />} /> */}
                <Route path="/edit-page/:id" element={<EditablePage />} />
            </Routes>
        </Router>
    );
}