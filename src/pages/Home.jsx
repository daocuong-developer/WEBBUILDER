// src/pages/Home.jsx
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { FileText, File } from "lucide-react";

export default function Home() {
    const [pages, setPages] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const storedPages = JSON.parse(localStorage.getItem("pages")) || [];
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        setPages(storedPages);
        setPosts(storedPosts);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        Danh sách Trang và Bài viết
                    </h2>

                    {/* Pages */}
                    {pages.length > 0 && (
                        <>
                            <h3 className="text-xl font-semibold mb-2 text-gray-700">📄 Trang</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {pages.map((page, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
                                    >
                                        <p className="text-gray-800 font-medium">Tên trang:</p>
                                        <p className="text-blue-600 font-semibold">{page.name}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Posts */}
                    {posts.length > 0 && (
                        <>
                            <h3 className="text-xl font-semibold mb-2 text-gray-700">📝 Bài viết</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {posts.map((post, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
                                    >
                                        <h4 className="text-lg font-bold text-blue-700">{post.title}</h4>
                                        <p className="text-gray-700 mt-1 text-sm">{post.content}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Empty State */}
                    {pages.length === 0 && posts.length === 0 && (
                        <p className="text-gray-500 text-center mt-10">Chưa có trang hoặc bài viết nào được lưu.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
