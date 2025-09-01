import { Form, Spinner } from "@heroui/react";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import apiClient from "../../../api/ApiClient";
import { motion } from "framer-motion";

interface BaseStateProps {
  children: (props: { loading: boolean }) => ReactNode; // ✅ render prop
  title: string;
  description: string;
  endpoint: string;
  payload: Record<string, any>;
  formDisabled: boolean;
  heading?: ReactNode;
  updateFormData: (payload: Record<string, any>) => void;
  isActive: boolean;
  onSubmitActions: (data: any) => boolean;
  formData: Record<string, any>;
}

// 🔹 Persian → English digit map
const persianToEnglishDigits = (input: string) => {
  if (!input) return input;
  const map: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  return input.replace(/[۰-۹]/g, (d) => map[d] || d);
};

export default function BaseState({
  children,
  title,
  description,
  endpoint,
  isActive,
  payload,
  formDisabled,
  heading,
  onSubmitActions,
  updateFormData,
}: BaseStateProps) {
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isActive]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formDataKeys = Array.from(formData.keys());
    const updatedPayload: Record<string, any> = structuredClone(payload);

    const setNestedValue = (obj: any, path: string, value: any) => {
      const parts = path.split(".");
      let current = obj;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // special case: arrays like stage1Scores.Mathematics
        if (part.startsWith("stage") && i === 0 && i + 1 < parts.length) {
          const subjectId = parts[i + 1];
          if (!Array.isArray(current[part])) current[part] = [];
          const existing = current[part].find(
            (x: any) => x.subjectId === subjectId
          );
          if (existing) {
            existing.percentage = value;
          } else {
            current[part].push({ subjectId, percentage: value });
          }
          return;
        }

        if (i === parts.length - 1) {
          if (value === null && !formDataKeys.includes(path)) {
            delete current[part];
          } else {
            current[part] = value;
          }
        } else {
          if (!current[part] || typeof current[part] !== "object")
          current[part] = {};
          current = current[part];
        }
      }
    };

    for (const [key] of formData.entries()) {
      const el = e.currentTarget.elements.namedItem(key) as
        | HTMLInputElement
        | HTMLSelectElement
        | null;

      let finalValue: any = formData.get(key);

      // 🔹 Normalize Persian digits first
      if (typeof finalValue === "string") {
        finalValue = persianToEnglishDigits(finalValue);
      }
      console.log(el?.type + " das ")
      if (el instanceof HTMLInputElement && el.type === "checkbox") {

        finalValue = el.checked;
      } else if (el instanceof HTMLSelectElement && el.multiple) {
        finalValue = formData
          .getAll(key)
          .map((val) =>
            typeof val === "string" ? persianToEnglishDigits(val) : val
          );
      } else if (finalValue === "true") finalValue = true;
      else if (finalValue === "false") finalValue = false;
      else if (
        finalValue !== "" &&
        !isNaN(Number(finalValue.replace(/,/g, ""))) &&
        !["phone", "nationalId", "code"].includes(key)
      ) {
        finalValue = Number(finalValue.replace(/,/g, ""));
      }

      console.log("➡️ Final Value:", key, finalValue);

      // ✅ Allow 0, false, and other falsy-but-valid values
      if (
        finalValue !== "" &&
        finalValue !== null &&
        finalValue !== undefined
      ) {
        setNestedValue(updatedPayload, key, finalValue);
      }
    }

    console.log("📄 Form Data Entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    console.log(
      "✅ Final JSON Payload:",
      JSON.stringify(updatedPayload, null, 2)
    );

    if (!isActive) return;
    setLoading(true);
  if (updatedPayload.notAttended1404) {
    // if true → clear exam related fields
    if ("examTotalSpecial" in updatedPayload) updatedPayload.examTotalSpecial = null;
    if ("examFinalTotal" in updatedPayload) updatedPayload.examFinalTotal = null;
    if ("finalQuotaScore" in updatedPayload) updatedPayload.finalQuotaScore = null;
    if ("finalQuotaRank" in updatedPayload) updatedPayload.finalQuotaRank = null;}
  // } else {
  //   // if false → clear academic GPA
  //   if ("academicGpaTotal" in updatedPayload) updatedPayload.academicGpaTotal = null;
  // }
    try {
      const response = await apiClient.post(endpoint, updatedPayload);
      if (response.status.toString().startsWith("2")) {
        if (onSubmitActions(response.data)) {
          updateFormData(updatedPayload);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex justify-center my-5 relative flex-col"
    >
      {formDisabled && (
        <div className="absolute top-0 left-0 w-full h-full bg-content1/50 z-[30] flex justify-center items-center">
          <Spinner color="primary" variant="simple" />
        </div>
      )}
      {!isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-content1/70 absolute top-0 left-0 w-full z-[100]"
        />
      )}
      {heading}
      <div className="mb-10">
        <h2 className="font-bold text-secondary">{title}</h2>
        <p className="mt-1 text-default-700">{description}</p>
      </div>
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col mb-20 md:grid gap-5 md:grid-cols-2"
      >
        {children({ loading })}
      </Form>
    </div>
  );
}
