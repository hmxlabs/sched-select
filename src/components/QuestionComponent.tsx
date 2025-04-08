import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
  Button,
  FormGroup,
  Checkbox
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface QuestionProps {
  question: string;
  hint: string;
  questionKey: string;
  type: string;
  options?: any[];
  allAnswers: any;
  disabled?: boolean;
  onAnswer: (answer: any) => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  hint,
  type,
  options,
  onAnswer,
  allAnswers,
  questionKey,
  disabled,
}) => {
  const renderInput = () => {
    switch (type) {
      case "boolean":
        return (
          <FormControl component="fieldset" disabled={disabled}>
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
                sx={{ color: "#fff" }}
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
                sx={{ color: "#fff" }}
              />
            </RadioGroup>
          </FormControl>
        );
      case "multipleChoice":
        return (
          <FormControl component="fieldset" disabled={disabled}>
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
                  sx={{ color: "#fff" }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case "multiSelect":
        return (
          <FormControl component="fieldset" disabled={disabled}>
            <FormGroup>
              {options?.map((option, index) => {
                return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={
                        typeof allAnswers[questionKey] === "string"
                        ? allAnswers[questionKey].split(",").includes(option)
                        : Array.isArray(allAnswers[questionKey])
                          ? allAnswers[questionKey].includes(option)
                          : false
                      }
                      onChange={(e) => {
                        const newAnswers = e.target.checked
                          ? [...(allAnswers[questionKey] || []), option]
                          : (allAnswers[questionKey] || []).filter(
                              (item: string) => item !== option
                            );
                        onAnswer(newAnswers);
                      }}
                      sx={{
                        color: "#fff",
                        "&.Mui-checked": { color: "#2591eb" },
                      }}
                    />
                  }
                  label={option}
                  sx={{ color: "#fff" }}
                />
              )}
              
              )}
            </FormGroup>
          </FormControl>
        );
      case "rankedChoice":
        return (
          <FormControl component="fieldset" disabled={disabled}>
            <RadioGroup
              aria-label={question}
              name={questionKey}
              value={allAnswers[questionKey] ?? ""}
              onChange={(e) => onAnswer(Number(e.target.value))}
            >
              {options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.rank}
                  control={
                    <Radio
                      sx={{
                        color: "#fff",
                        "&.Mui-checked": { color: "#2591eb" },
                      }}
                    />
                  }
                  label={option.value}
                  sx={{ color: "#fff" }}
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
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <h2 className="questionText">{question}</h2>
        {hint && (
          <Tooltip title={hint} arrow>
            <Button sx={{ minWidth: 0, padding: 0 }}>
              <HelpOutlineIcon sx={{ color: "white" }} fontSize="small" />
            </Button>
          </Tooltip>
        )}
      </Box>

      {renderInput()}
    </Box>
  );
};

export default QuestionComponent;
