import { Textarea } from "../../components/ui/textarea";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { FileUpload } from "../../components/ui/upload";

interface TopicInputProps {
  setTopic: (topic: string) => void;
  setDifficultyLevel: (level: string) => void;
  handleFileChange: (files: File[]) => void;
}

const TopicInput: React.FC<TopicInputProps> = ({ setTopic, setDifficultyLevel }) => {
  return (
    <div>
      <h2>
        Enter the topic or paste the content for which you want to generate
        study material
      </h2>
      <Textarea
        placeholder="Start writing here"
        className="mt-2"
        onChange={(event) => setTopic(event.target.value)}
      />

      <h2 className="mt-5 mb-3">Select the difficulty level</h2>
      <Select onValueChange={(value) => setDifficultyLevel(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Difficulty Level" />
        </SelectTrigger>
        <SelectContent  className="absolute z-50 bg-black">
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Moderate">Moderate</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
          
        </SelectContent>
      </Select>
      <FileUpload/>
    </div>
  );
};

export default TopicInput;
