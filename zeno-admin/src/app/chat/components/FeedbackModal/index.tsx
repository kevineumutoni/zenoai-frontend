"use client";
import { useEffect, useState } from "react";
import { useSendFeedback } from "../../../hooks/usesendFeedback";

export default function FeedbackModal({
  responseId,
  responseText,
  userId,
  feedbackType,
  token,
  onClose,
}: {
  responseId: string;
  responseText: string;
  userId: number;
  feedbackType: "like" | "dislike";
  token?: string;
  onClose: () => void;
}) {
  const [comment, setComment] = useState("");
  const { submitFeedback, loading, error, success, clear } = useSendFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFeedback({ responseId, responseText, feedbackType, comment: comment.trim(), userId, token });
  };

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => {
        clear();
        onClose();
      }, 900);
      return () => clearTimeout(t);
    }
  }, [success, onClose, clear]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#C3D1E8] text-black p-6 rounded-xl w-[40vw] h-[40vh] shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">
          {feedbackType === "like" ? "You liked this response" : "You disliked this response"}
        </h2>

        {success ? (
          <div className="p-3 bg-[#0B182F] text-white rounded mb-4 text-center">
            Feedback submitted successfully
          </div>
        ) : null}

        {error && <div className="p-2 bg-red-600 text-white rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment (optional)..."
            className="w-full h-[23vh] p-2 rounded-lg border border-[#0B182F] text-black focus:outline-none resize-none"
          />

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1 rounded-lg border border-[#0B182F] text-black">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-3 py-1 rounded-lg bg-[#0B182F] text-white">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
