import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snackbar, Box } from "@mui/material";
import questions from "../db/questions.json";
import answers from "../db/answers.json";
import QuestionComponent from "./QuestionComponent";
import SchedulerListComponent from "./SchedulerListComponent";
import LoadingSpinner from "./LoadingSpinner";
import { Answer } from "../models/Answers";
import { useFormState } from "../hooks/useFormState";
import { generateShareableLink } from "../utils/helpers";

import backgroundImage from '../assets/bg1.jpg';


export default function Form() {
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCurrentQuestionAnswered, setIsCurrentQuestionAnswered] =
    useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    answersState,
    filteredSchedulers,
    isReadOnly,
    updateAnswers,
    resetForm: resetFormState,
    finalizeResults,
  } = useFormState();

  function shouldShowQuestion(question: any, allAnswers: any) {
    if (!question.dependsOn) return true;

    return question.dependsOn.every((dep: any) => {
      const userAnswer = allAnswers[dep.key];

      if (userAnswer === undefined) return false;

      const normalizedAnswer =
        typeof userAnswer === "string"
          ? userAnswer === "true"
            ? true
            : userAnswer === "false"
            ? false
            : isNaN(Number(userAnswer))
            ? userAnswer
            : Number(userAnswer)
          : userAnswer;

      return normalizedAnswer === dep.value;
    });
  }

  const visibleQuestions = useMemo(() => {
    return questions.filter((question) =>
      shouldShowQuestion(question, answersState)
    );
  }, [answersState]);

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleAnswer = (answer: string | boolean | number | string[]) => {
    const currentQuestion = visibleQuestions[currentQuestionIndex];
    const newAnswers = { ...answersState, [currentQuestion.key]: answer };

    updateAnswers(newAnswers);
    setIsCurrentQuestionAnswered(true);
  };

  const handleNavigation = (direction: "next" | "back") => {
    if (direction === "back" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (
      direction === "next" &&
      (isReadOnly || isCurrentQuestionAnswered)
    ) {
      if (currentQuestionIndex < visibleQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsCurrentQuestionAnswered(false);
      } else {
        setIsLoading(true);
        // Simulate processing time for better UX
        setTimeout(() => {
          finalizeResults();
          setSubmitted(true);
          setIsLoading(false);
        }, 500);
      }
    }
  };

  const resetForm = () => {
    resetFormState();
    setCurrentQuestionIndex(0);
    setSubmitted(false);
  };

  const customStyle = {
    '--bg-url': `url(${backgroundImage})`
  } as React.CSSProperties & { [key: string]: string };

  return (
    <div className="container" style={customStyle}>
      <div className={submitted ? "content" : "content full-width"}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          message="URL copied to clipboard!"
        />

        {!submitted && (
          <Box className="side-panel form-side-panel">
            <Box className="side-panel-content">
              <SchedulerListComponent schedulers={filteredSchedulers} compact />
            </Box>
          </Box>
        )}

        {isLoading ? (
          <LoadingSpinner message="Processing your results..." />
        ) : !submitted && visibleQuestions.length > 0 && currentQuestionIndex < visibleQuestions.length ? (
            <Box className="formBox form-main-box">
              <AnimatePresence mode="wait">
                <motion.div
                  key={visibleQuestions[currentQuestionIndex].key}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="questionContainer"
                >
                  <QuestionComponent
                    question={visibleQuestions[currentQuestionIndex].question}
                    hint={visibleQuestions[currentQuestionIndex].hint}
                    type={
                      answers[
                        visibleQuestions[currentQuestionIndex].key as keyof Answer
                      ]?.type
                    }
                    options={
                      answers[
                        visibleQuestions[currentQuestionIndex].key as keyof Answer
                      ]?.options
                    }
                    questionKey={visibleQuestions[currentQuestionIndex].key}
                    onAnswer={handleAnswer}
                    allAnswers={answersState}
                    disabled={isReadOnly}
                  />
                </motion.div>
              </AnimatePresence>

              {!submitted && (
                <div className="buttonContainer">
                  <button
                    onClick={() => handleNavigation("back")}
                    disabled={currentQuestionIndex === 0}
                    className="button"
                  >
                    Previous
                  </button>
                  <button onClick={() => handleNavigation("next")} className="button">
                    {currentQuestionIndex < visibleQuestions.length - 1
                      ? "Next"
                      : "Submit"}
                  </button>
                </div>
              )}

              {/* Progress Bar */}
              <div className="progressBarContainer">
                <motion.div
                  className="progressBar"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${
                      ((currentQuestionIndex + 1) / visibleQuestions.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
                <p className="progressBarText">{currentQuestionIndex + 1} of {visibleQuestions.length} questions</p>
              </div>
            </Box>
          ) : !submitted && visibleQuestions.length === 0 ? (
            <Box className="formBox form-main-box">
              <div className="questionContainer">
                <h2>No questions available</h2>
                <p>There are no questions to display at this time.</p>
              </div>
            </Box>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SchedulerListComponent
                schedulers={filteredSchedulers}
                generateShareableLink={() =>
                  generateShareableLink(setOpenSnackbar)
                }
                resetForm={resetForm}
              />
            </motion.div>
          )}
      </div>
    </div>
  );
}
