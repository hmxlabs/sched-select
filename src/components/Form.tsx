import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Snackbar, Box } from "@mui/material";
import questions from "../db/questions.json";
import answers from "../db/answers.json";
import schedulers from "../db/schedulers.json";
import QuestionComponent from "./QuestionComponent";
import SchedulerListComponent from "./SchedulerListComponent";
import { Scheduler } from "../models/Schedulers";
import { Answer } from "../models/Answers";
import {
  filterSchedulers,
  generateShareableLink,
  // scoreSchedulers,
} from "../utils/helpers";

import backgroundImage from '../assets/bg1.jpg';


export default function Form() {
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCurrentQuestionAnswered, setIsCurrentQuestionAnswered] =
    useState(false);
  const [answersState, setAnswersState] = useState<Answer>({} as Answer);
  const [filteredSchedulers, setFilteredSchedulers] =
    useState<Scheduler[]>(schedulers);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      setAnswersState(params as unknown as Answer);
      setIsReadOnly(true);
    }
  }, []);

  useEffect(() => {
    const updatedSchedulers = schedulers.map((scheduler) => {
      const isMatch = filterSchedulers(answersState, [scheduler]).length > 0;
      return { ...scheduler, isMatch: isMatch || false };
    });
    setFilteredSchedulers(updatedSchedulers);
  }, [answersState]);

  function shouldShowQuestion(question: any, allAnswers: any) {
    console.log(question.dependsOn, 'question.dependsOn')
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
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = { ...answersState, [currentQuestion.key]: answer };

    setAnswersState(newAnswers);
    setIsCurrentQuestionAnswered(true);

    setSearchParams(
      new URLSearchParams(
        Object.entries(newAnswers).map(([key, value]) => [key, String(value)])
      )
    );
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
        setSubmitted(true);
      }
    }
  };

  const resetForm = () => {
    setAnswersState({} as Answer);
    setCurrentQuestionIndex(0);
    setIsReadOnly(false);
    setFilteredSchedulers(schedulers);
    setSubmitted(false);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const customStyle = {
    '--bg-url': `url(${backgroundImage})`
  } as React.CSSProperties & { [key: string]: string };

  return (
    <div className="container" style={customStyle}>
      <div className="content">
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          message="URL copied to clipboard!"
        />

        {!submitted && !isReadOnly && (
          <Box className="side-panel" sx={{ order: { xs: 2, md: 0 } }}>
            <Box className="side-panel-content">
              <SchedulerListComponent schedulers={filteredSchedulers} compact />
            </Box>
          </Box>
        )}

        <Box className="formBox" sx={{ order: { xs: 1, md: 0 } }}>
          
          <AnimatePresence mode="wait">
            {!submitted ? (
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
      </div>
    </div>
  );
}
