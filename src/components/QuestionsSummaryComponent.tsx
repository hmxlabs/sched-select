import React from "react";
import { Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import questions from "../db/questions.json";
import answers from "../db/answers.json";
import { Answer } from "../models/Answers";

interface QuestionsSummaryProps {
  userAnswers: Record<string, string | boolean | number | string[]>;
}

const QuestionsSummaryComponent: React.FC<QuestionsSummaryProps> = ({
  userAnswers,
}) => {
  // Get the questions that were answered
  const answeredQuestions = questions.filter(
    (q) => userAnswers[q.key] !== undefined
  );

  const formatAnswer = (questionKey: string, answer: string | boolean | number | string[]): string => {
    const answerConfig = answers[questionKey as keyof Answer];
    
    if (!answerConfig) {
      return String(answer);
    }

    // Handle boolean type - display Yes/No
    if (answerConfig.type === "boolean") {
      // Convert string "true"/"false" to boolean if needed
      const boolValue = typeof answer === "string" 
        ? answer === "true" 
        : Boolean(answer);
      return boolValue ? "Yes" : "No";
    }

    // Handle rankedChoice type - find the display value from the rank number
    if (answerConfig.type === "rankedChoice") {
      const options = answerConfig.options as Array<{ value: string; rank: number }>;
      // Answer is stored as the rank number, find the matching option
      const answerRank = typeof answer === "string" ? Number(answer) : answer;
      const matchingOption = options.find(opt => opt.rank === answerRank);
      return matchingOption ? matchingOption.value : String(answer);
    }

    // Handle multiSelect type - array of selected options
    if (answerConfig.type === "multiSelect" && Array.isArray(answer)) {
      return answer.join(", ");
    }

    return String(answer);
  };

  return (
    <div className="submissionBox summaryBox">
      <h3 className="submissionTitle">Your Selections</h3>

      <div className="questionsSummaryList">
        {answeredQuestions.map((question) => {
          const answer = userAnswers[question.key];
          return (
            <Box key={question.key} className="questionSummaryItem">
              <div className="questionSummaryQuestion">
                <CheckCircleIcon className="summary-indicator" />
                <span className="questionSummaryText">{question.question}</span>
              </div>
              <div className="questionSummaryAnswer">
                <strong>{formatAnswer(question.key, answer)}</strong>
              </div>
            </Box>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionsSummaryComponent;
