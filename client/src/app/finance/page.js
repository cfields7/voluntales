"use client";

import { useEffect, useState } from "react";
import { volunteerService } from "../services/volunteerService";
import Link from "next/link";
import Header from "../components/header";
import Background from "../components/background";
import Select from "react-select"; // Multi-select component for tags

export default function FinanceAssistancePage() {
  const [financeData, setFinanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    async function fetchFinanceData() {
      try {
        const res = await volunteerService.getFinance();
        const data = await res.json();
        setFinanceData(data);
        setFilteredData(data);

        // Extract unique tags from the fetched data
        const allTags = Array.from(new Set(data.flatMap(post => post.tag || [])));
        setTags(allTags.map(tag => ({ label: tag, value: tag })));
      } catch (error) {
        console.error("Error fetching finance data:", error);
      }
    }
    fetchFinanceData();
  }, []);

  // Filter the posts by selected tags
  useEffect(() => {
    const filteredPosts = financeData.filter(post => {
      const matchesTags =
        selectedTags.length === 0 ||
        (post.tag && post.tag.some(tag => selectedTags.includes(tag.value)));

      return matchesTags;
    });

    setFilteredData(filteredPosts);
  }, [selectedTags, financeData]);

  return (
    <div>
      <Header />
      <Background />
      <br />
      <br />
      <br />
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Financial Assistance Posts
        </h1>

        {/* Filters Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="w-full">
            <h3 className="text-white font-bold mb-2">Filter by Tags</h3>
            <Select
              isMulti
              options={tags}
              value={selectedTags}
              onChange={setSelectedTags}
              placeholder="Select Tags"
              className="bg-gray-700 text-black rounded-md"
            />
          </div>
        </div>

        {filteredData.length === 0 ? (
          <p className="text-white text-center">No finance posts available.</p>
        ) : (
          filteredData.map((post, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg text-white mb-4"
            >
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p>{post.body}</p>
              <div className="mt-2">
                <span className="font-bold">Financial Goal:</span> ${post.goal}
              </div>
              <div className="flex space-x-4">
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
                <Link href={`/finance/${post.id}`} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md">
                  View Full Post
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
