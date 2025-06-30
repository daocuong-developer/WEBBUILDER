import React, { useState } from "react";
import { X } from "lucide-react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { ChevronDown } from "lucide-react";

const CreatePostModal = ({ onClose }) => {
    const [content, setContent] = useState("");
    const [selectedPage, setSelectedPage] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-[70%] rounded-lg shadow-lg p-6 relative">
                {/* Close Button */}
                <button className="absolute top-4 right-4 text-gray-500 hover:text-black" onClick={onClose}>
                    <X />
                </button>

                <h2 className="text-xl font-semibold mb-6">Create New Post</h2>

                <form className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Title</label>
                        <input type="text" placeholder="Post title" className="w-full border rounded-md px-3 py-2" />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Excerpt</label>
                        <input
                            type="text"
                            placeholder="Brief description of your post"
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Page</label>
                        <div className="relative">
                            <select
                                value={selectedPage}
                                onChange={(e) => setSelectedPage(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 appearance-none pr-10"
                            >
                                <option value="">-- Select target page --</option>
                                <option value="home">Homepage</option>
                                <option value="blog">Blog</option>
                                <option value="news">News</option>
                                <option value="tutorials">Tutorials</option>
                            </select>

                            {/* Custom dropdown icon */}
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Technology"
                                className="w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Featured Image URL</label>
                            <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                className="w-full border rounded-md px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Tags</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Add tag..."
                                className="flex-1 border rounded-md px-3 py-2"
                            />
                            <button type="button" className="bg-gray-200 px-4 py-2 rounded-md">
                                Add
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Content</label>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            placeholder="Write your post content here..."
                            className="bg-white "
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
