"use client";
import { useState } from "react";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegCopy } from "react-icons/fa";
import FeedbackModal from "../FeedbackModal";

export default function FeedbackButtons({
  userId,
  textToCopy,
}: {
  userId?: number;
  textToCopy: string;
}) {
  const [feedbackType, setFeedbackType] = useState<"like" | "dislike" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  const handleFeedback = (type: "like" | "dislike") => {
    setFeedbackType(type);
    setShowModal(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 text-gray-300 text-xl">
      <div className="flex space-x-3">
        <button
          onClick={() => handleFeedback("like")}
          aria-label="like"
          className="cursor-pointer"
        >
          <FaRegThumbsUp className="hover:text-green-500" />
        </button>
        <button
          onClick={() => handleFeedback("dislike")}
          aria-label="dislike"
          className="cursor-pointer"
        >
          <FaRegThumbsDown className="hover:text-red-400" />
        </button>
        <button
          onClick={handleCopy}
          aria-label="copy"
          className="cursor-pointer"
        >
          <FaRegCopy className="hover:text-blue-500" />
        </button>
      </div>

      {copySuccess && (
        <span className="text-sm text-[#9FF8F8] select-none">
          Copied successfully!
        </span>
      )}

      {showModal && feedbackType && (
        <FeedbackModal
          userId={userId ?? 0}
          feedbackType={feedbackType}
          token={token}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
