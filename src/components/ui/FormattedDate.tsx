"use client";

import { useEffect, useState } from "react";

export const FormattedDate = ({ date }: { date: string | Date }) => {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    setFormatted(new Date(date).toLocaleString());
  }, [date]);

  if (!formatted) return <span className="opacity-0">Loading...</span>;

  return <span>{formatted}</span>;
};
