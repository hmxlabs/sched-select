import React, { memo } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
  Button,
  FormGroup,
  Checkbox,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
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
                control={<Radio className="radio-icon" />}
                className="radio-label"
                label="Yes"
              />
              <FormControlLabel
                value="false"
                control={<Radio className="radio-icon" />}
                className="radio-label"
                label="No"
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
                  control={<Radio className="radio-icon" />}
                  className="radio-label"
                  label={option}
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
                        className="checkbox-icon"
                        checked={
                          typeof allAnswers[questionKey] === "string"
                            ? allAnswers[questionKey]
                                .split(",")
                                .includes(option)
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
                      />
                    }
                    label={option}
                    className="checkbox-label"
                  />
                );
              })}
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
                  control={<Radio className="radio-icon" />}
                  className="radio-label"
                  label={option.value}
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
    <Box className="layout-column-center">
      <Box className="layout-row-center">
        <h2 className="questionText">{question}
          {hint && (
            <Tooltip title={hint} arrow>
              <Button className="help-button">
                <InfoOutlineIcon className="help-button-icon" fontSize="small" />
              </Button>
            </Tooltip>
          )}
        </h2>
        
      </Box>
      {renderInput()}
    </Box>
  );
};

export default memo(QuestionComponent);
