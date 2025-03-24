"use client";
import React, { useState } from "react";
import SelectOption from "./_components/SelectOption";
import TopicInput from "./_components/TopicInput";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormDataType {
  courseType?: string;
  difficultyLevel?: string;
  topic?: string;
}

export default function CreateCourse() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({});
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUserInput = (fieldName: keyof FormDataType, fieldValue: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const generateCourseOutline = async () => {
    setLoading(true);

    try {
      // Create FormData instance and append the fields
      const formDataToSend = new FormData();
      formDataToSend.append("userName", "John Doe");
      formDataToSend.append("courseType", formData.courseType || "");
      formDataToSend.append("difficultyLevel", formData.difficultyLevel || "");
      formDataToSend.append("msg", formData.topic || "");

      // Append PDF files
      files.forEach((file) => {
        formDataToSend.append("pdfFiles", file);
      });

      // Post to your API endpoint
      const res = await fetch("/api/generate-course-ouline", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      toast.success("Please wait while your course is generating!");
      router.replace("/dashboard");
      toast("Your course content is generating, Click on Refresh Button");
      console.log(data);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to generate course outline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
      <h2 className="font-bold text-4xl text-primary">
        Start Building your Personal Study Material
      </h2>
      <p className="text-gray-500 text-lg">
        Fill all details in order to generate study material for your next project
      </p>
      <div className="mt-10">
        {step === 0 ? (
          <SelectOption
            selectedStudyType={(value: string) => handleUserInput("courseType", value)}
          />
        ) : (
          <TopicInput
            setDifficultyLevel={(value: string) => handleUserInput("difficultyLevel", value)}
            setTopic={(value: string) => handleUserInput("topic", value)}
            handleFileChange={handleFileChange}
          />
        )}
      </div>
      <div className="flex justify-between w-[60%] mt-32">
        {step !== 0 ? (
          <Button variant="outline" onClick={() => setStep(0)} disabled={loading}>
            Previous
          </Button>
        ) : (
          <div />
        )}
        {step === 0 ? (
          <Button onClick={() => setStep(1)} disabled={loading}>
            Next
          </Button>
        ) : (
          <Button onClick={generateCourseOutline} disabled={loading}>
            {loading ? "Processing..." : "Generate"}
          </Button>
        )}
      </div>
    </div>
  );
}
