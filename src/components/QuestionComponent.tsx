import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
} from "@mui/material";

interface QuestionProps {
  question: string;
  questionKey: string;
  type: string;
  options?: any[];
  allAnswers: any;
  onAnswer: (answer: any) => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  type,
  options,
  onAnswer,
  allAnswers,
  questionKey,
}) => {
  const renderInput = () => {

    switch (type) {
      case "boolean":
        return (
          <FormControl component="fieldset">
            <RadioGroup
              aria-label={question}
              name={questionKey}
              value={
                allAnswers[questionKey] !== undefined
                  ? String(allAnswers[questionKey])
                  : ""
              }
              onChange={(e) => onAnswer(e.target.value === "true")}
              row
            >
              <FormControlLabel
                value="true"
                control={
                  <Radio
                    sx={{
                      color: "#fff",
                      "&.Mui-checked": { color: "#2591eb" },
                    }}
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                value="false"
                control={
                  <Radio
                    sx={{
                      color: "#fff",
                      "&.Mui-checked": { color: "#2591eb" },
                    }}
                  />
                }
                label="No"
              />
            </RadioGroup>
          </FormControl>
        );
      case "multipleChoice":
        return (
          <FormControl component="fieldset">
            <RadioGroup
              aria-label={question}
              name={question}
              value={allAnswers[questionKey] ?? ""}
              onChange={(e) => onAnswer(e.target.value)}
            >
              {options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={
                    <Radio
                      sx={{
                        color: "#fff",
                        "&.Mui-checked": { color: "#2591eb" },
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>{question}</h2>
      {renderInput()}
    </Box>
  );
};

export default QuestionComponent;
