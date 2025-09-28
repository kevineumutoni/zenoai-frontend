'use client'
import DashboardTopBar from "./components/TopBar";
import DashboardMain from "./components/MainPage";
import { RunLike } from "../../app/utils/types/chat";

const user = { id: 1, token: "your_token_here" };

const sendMessage = async (params: {
  conversationId?: string | null;
  userInput: string;
  files?: File[];
  filePreviews?: { file: File; previewUrl: string }[];
}): Promise<RunLike> => {
  return {
    id: Date.now(),
    user_input: params.userInput,
    status: "completed",
    final_output: "Hello!",
    output_artifacts: [],
    started_at: new Date().toISOString(),
  };
};

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen">
      <DashboardTopBar />
      <DashboardMain user={user} sendMessage={sendMessage} />
    </main>
  );
}