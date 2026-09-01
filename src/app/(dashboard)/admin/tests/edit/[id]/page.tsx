"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TestBuilderForm } from "@/components/dashboard/TestBuilderForm";
import api from "@/lib/axios";

export default function EditTestPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setInitialData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error loading test data.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuiz();
  }, [id]);

  const handleSubmit = async (data: any) => {
    await api.put(`/quizzes/${id}`, data);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center font-display text-2xl font-black text-navy italic">
        Loading Assessment Record...
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center font-display text-2xl font-black text-navy">
        {error || "Assessment Record Not Found."}
      </div>
    );
  }

  return <TestBuilderForm initialData={initialData} isEdit={true} onSubmit={handleSubmit} />;
}
