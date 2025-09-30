"use client";
import { useEffect, useState } from "react";
import { useSendFeedback } from "../../../hooks/useFetchFeedback";

function SuccessPopup({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-60 bg-black/60">
      <div className="bg-[#9FF8F8] text-black rounded p-4 shadow-lg">
        {message}
      </div>
    </div>
  );
}

function FloatingError({ message }: { message: string }) {
  return (
    <div className="absolute bottom-full  left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm px-3 py-1 rounded shadow-md z-50 animate-fadeIn">
      {message}
    </div>
  );
}

export default function FeedbackModal({
  userId,
  feedbackType,
  token,
  onClose,
}: {
  userId: number;
  feedbackType: "like" | "dislike";
  token?: string;
  onClose: () => void;
}) {
  const [comment, setComment] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const { submitFeedback, loading, error, success, clear } = useSendFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setLocalError("Review cannot be empty");
      setTimeout(() => setLocalError(null), 2000);
      return;
    }
    setLocalError(null);
    await submitFeedback({
      feedbackType,
      comment: comment.trim(),
      userId,
      token: token ?? "",
    });
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
    <>
      {success ? (
        <SuccessPopup message={success} />
      ) : (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
        >
          <div className=" relative bg-[#C3D1E8] text-black p-10  rounded-xl w-[40vw] lg:h-[53vh] xl:h-[45vh] 2xl:h-[45vh] shadow-xl border border-gray-700">
            <h2 id="feedback-modal-title" className="text-2xl font-bold mb-4">
              {feedbackType === "like"
                ? "You liked this response"
                : "You disliked this response"}
            </h2>

            {error && (
              <div className="p-2 bg-red-600 text-white rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 relative" role="form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment (required)..."
                className="w-full h-[23vh] p-2 rounded-lg border border-[#0B182F] text-black focus:outline-none resize-none"
                disabled={loading}
                aria-label="Leave a comment"
              />

              <div className="relative flex justify-end space-x-2 mt-2">
                {localError && <FloatingError message={localError} />}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1 rounded-lg border border-[#0B182F] text-black cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1 rounded-lg bg-[#0B182F] text-white cursor-pointer"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
