"use client";
import { useState } from "react";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegCopy, FaDownload } from "react-icons/fa";
import FeedbackModal from "../FeedbackModal";

export default function FeedbackButtons({
  userId,
  textToCopy,
  onDownloadReport,
  runData,
}: {
  userId?: number;
  textToCopy: string;
  onDownloadReport?: (run: any) => void;
  runData?: any;
}) {
  const [feedbackType, setFeedbackType] = useState<"like" | "dislike" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState(false);

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
      setCopyError(false);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setCopyError(true);
      setCopySuccess(false);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  const handleDownload = () => {
    if (onDownloadReport && runData) {
      onDownloadReport(runData);
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
        {onDownloadReport && runData && (
          <button
            onClick={handleDownload}
            aria-label="download report"
            className="cursor-pointer"
          >
            <FaDownload className="hover:text-cyan-400" />
          </button>
        )}
      </div>

      {copySuccess && (
        <span className="text-sm text-[#9FF8F8] select-none">Copied successfully!</span>
      )}
      {copyError && (
        <span className="text-sm text-red-400 select-none">Failed to copy</span>
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