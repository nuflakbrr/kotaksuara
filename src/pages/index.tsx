import { PollQuestion } from "@prisma/client";
import Head from "next/head";
import React from "react";

import Navbar from "../components/Navbar";
import QuestionCard from "../components/QuestionCard";
import { trpc } from "../utils/trpc";

export default function Home() {
  const [showToast, setShowToast] = React.useState(false);
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);

  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

  const copyToClipboard = (question: PollQuestion) => {
    navigator.clipboard.writeText(`${url}/question/${question.id}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  if (isLoading)
    return (
      <div className="antialiased min-h-screen flex items-center justify-center">
        <p className="text-white/40">Sedang Memuat...</p>
      </div>
    );

  return (
    <div className="p-6 min-h-screen w-screen items-stretch relative">
      <Head>
        <title>Beranda - KotakSuara by Naufal Akbar Nugroho</title>
      </Head>

      <Navbar />

      <div className="pt-10 pb-10">
        <div className="grid grid-cols-1 gap-y-5 md:grid-cols-4 md:gap-x-5 mt-10">
          {data?.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              copyToClipboard={copyToClipboard}
            />
          ))}
        </div>

        {/* Toast that will show at the bottom-right of the screen */}
        {showToast && (
          <div className="absolute bottom-5 right-10 flex items-center justify-center bg-sky-600 p-3 rounded-md w-1/5">
            <span className="text-xs font-semibold">
              Tautan berhasil di salin!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
