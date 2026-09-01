"use client";

import React from "react";
import { TestBuilderForm } from "@/components/dashboard/TestBuilderForm";
import api from "@/lib/axios";

export default function CreateTestPage() {
  const handleSubmit = async (data: any) => {
    await api.post("/quizzes/create", data);
  };

  return <TestBuilderForm onSubmit={handleSubmit} />;
}
