"use client";

import { useState } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Sparkles,
  Send,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const [messages, setMessages] = useState<Message[]>([]);

  const askQuestion = async () => {
    if (!file) {
      alert("Please upload a PDF first");
      return;
    }

    if (!question.trim()) return;

    const currentQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", currentQuestion);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/ask",
        formData
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer,
        },
      ]);

      setQuestionCount((prev) => prev + 1);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Failed to generate answer.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}

        <aside className="w-80 min-h-screen border-r border-white/10 p-6">

         <h1 className="text-3xl font-bold mb-8 whitespace-nowrap">
  🧠 PaperMinds PRO
</h1>

          {/* Upload */}

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-6">
            <CardContent className="p-5">

              <div className="flex items-center gap-2 mb-4">
                <Upload size={18} />
                <span className="font-medium">
                  Upload PDF
                </span>
              </div>

              <label htmlFor="pdf-upload">

                <div className="cursor-pointer rounded-xl border-2 border-dashed border-indigo-500 p-6 text-center hover:bg-indigo-500/10 transition">

                  <Upload
                    className="mx-auto mb-3 text-indigo-400"
                    size={32}
                  />

                  <p className="font-semibold">
                    Click to Upload PDF
                  </p>

                  <p className="text-xs text-zinc-400 mt-2">
                    Research Papers, Reports,
                    Notes
                  </p>

                </div>

              </label>

              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] || null
                  )
                }
              />

              {file && (
                <div className="mt-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3">

                  <div className="flex items-center gap-2">

                    <FileText size={16} />

                    <span className="text-sm truncate">
                      {file.name}
                    </span>

                  </div>

                </div>
              )}

            </CardContent>
          </Card>

          {/* Status */}

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-4">

              <div className="flex gap-2 items-center">
                <Sparkles size={18} />
                <span>AI Status</span>
              </div>

              <p className="text-green-400 mt-3">
                Online
              </p>

            </CardContent>
          </Card>

        </aside>

        {/* Main */}

        <main className="flex-1 p-10 overflow-y-auto">

          <h2 className="text-5xl font-bold mb-3">
  PaperMinds PRO
</h2>

<p className="text-zinc-400 mb-8">
  AI-powered research assistant for analyzing,
  summarizing, and understanding academic documents.
</p>

          {/* Stats */}

          <div className="grid grid-cols-3 gap-4 mb-8">

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-4">
                <p className="text-zinc-400 text-sm">
                  📄 Documents
                </p>
                <h3 className="text-5xl font-bold">
                  {file ? 1 : 0}
                </h3>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-4">
                <p className="text-zinc-400 text-sm">
                  📄 Documents
                </p>
                <h3 className="text-5xl font-bold">
                  {questionCount}
                </h3>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-4">
                <p className="text-zinc-400 text-sm">
                  🟢 Status
                </p>
                <h3 className="text-green-400 font-bold">
                  Online
                </h3>
              </CardContent>
            </Card>

          </div>

          {/* Ask */}

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-6">
            <CardContent className="p-6">

              <Textarea
                placeholder="Ask anything about your document..."
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                className="bg-[#0B1020] border-zinc-700 min-h-[120px]"
              />

              <Button
                onClick={askQuestion}
               className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-8"
              >
                <Send className="mr-2 h-4 w-4" />
                Ask AI
              </Button>

            </CardContent>
          </Card>

          {/* Chat */}

          <div className="space-y-4">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`p-5 rounded-2xl max-w-4xl ${
  msg.role === "user"
    ? "bg-indigo-600 ml-auto"
    : "bg-white/5 backdrop-blur-xl border border-white/10"
}`}
                
              >

                <div className="font-semibold mb-2">
                  {msg.role === "user"
  ? "👤 You"
  : "🤖 PaperMinds AI"}
                </div>

                <div className="whitespace-pre-wrap">
                  {msg.content}
                </div>

              </div>

            ))}

            {loading && (

              <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl">

                <div className="font-semibold mb-2">
                  PaperMinds PRO
                </div>

                <div>
                  Analyzing document...
                </div>

              </div>

            )}

          </div>

        </main>
        <aside className="w-72 border-l border-white/10 p-6 bg-white/5 backdrop-blur-xl">

  <h2 className="text-xl font-bold mb-6">
    Research Insights
  </h2>

  <Card className="bg-white/5 border-white/10 mb-4">
    <CardContent className="p-4">
      <h3 className="font-semibold mb-2">
        Current Document
      </h3>

      <p className="text-sm text-zinc-400 break-words">
        {file ? file.name : "No document uploaded"}
      </p>
    </CardContent>
  </Card>

  <Card className="bg-white/5 border-white/10 mb-4">
    <CardContent className="p-4">
      <h3 className="font-semibold mb-3">
        Statistics
      </h3>

      <div className="space-y-2 text-sm">

        <div className="flex justify-between">
          <span>Documents</span>
          <span>{file ? 1 : 0}</span>
        </div>

        <div className="flex justify-between">
          <span>Questions</span>
          <span>{questionCount}</span>
        </div>

        <div className="flex justify-between">
          <span>Status</span>
          <span className="text-green-400">
            Online
          </span>
        </div>

      </div>
    </CardContent>
  </Card>

  <Card className="bg-white/5 border-white/10">
    <CardContent className="p-4">
      <h3 className="font-semibold mb-3">
        Features
      </h3>

      <ul className="space-y-2 text-sm text-zinc-400">
        <li>✓ Document Intelligence</li>
        <li>✓ AI Summarization</li>
        <li>✓ Context-Aware Q&A</li>
        <li>✓ Research Insights</li>
      </ul>
    </CardContent>
  </Card>

</aside>

      </div>
    </div>
  );
}