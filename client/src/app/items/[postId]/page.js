"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // For Next.js 13 App Router; if using the Pages Router, use useRouter from 'next/router'
import Header from "../../components/header";
import Background from "../../components/background";
import { volunteerService } from "../../services/volunteerService";

export default function FullPostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await volunteerService.getPostById(postId, "item");
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    fetchPost();
  }, [postId]);

  const formatDateTime = (dateTimeStr) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeStr).toLocaleString(undefined, options);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await volunteerService.postComment(
        postId,
        newComment,
        new Date().toISOString(),
        "item"
      );
      // Refresh comments after posting
      const res = await volunteerService.getPostById(postId, "item");
      const updatedPost = await res.json();
      setPost(updatedPost);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Background />
      <br />
      <br />
      <br />
      <div className="max-w-4xl mx-auto py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        <p className="mb-6">{post.body}</p>
        {post.timeSlots && post.timeSlots.length > 0 && (
          <div className="mb-6">
            {post.timeSlots.map((slot, i) => (
              <div key={i} className="flex items-center mb-1">
                <span className="font-bold">Start:</span>
                <span className="ml-2">{formatDateTime(slot.start)}</span>
                <span className="font-bold ml-4">End:</span>
                <span className="ml-2">{formatDateTime(slot.end)}</span>
              </div>
            ))}
          </div>
        )}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Visit Link
          </a>
        )}
      {/* Comments Section */}
      <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Comments ({post.comments?.length || 0})</h2>
          
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-4 bg-gray-800 rounded-lg text-white placeholder-gray-400"
              rows="3"
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments?.map((comment, index) => (
              <div key={index} className="flex items-start gap-4 bg-gray-800 p-4 rounded-lg">
                {/* Profile Icon */}
                <img
                  src={`/icon-${comment.profileIcon || '0'}.png`}
                  alt="Profile icon"
                  className="w-10 h-10 rounded-full"
                />
                
                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">
                      {comment.firstName} {comment.lastName}
                    </span>
                    <span className="text-gray-400 text-sm">
                      @{comment.username}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {formatDateTime(comment.datePosted)}
                    </span>
                  </div>
                  <p className="text-gray-200">{comment.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
