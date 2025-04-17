import { useEffect, useState } from "react";
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
      if (currentQuestionIndex < questions.length - 1) {
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

  return (
    <div className="container">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        message="URL copied to clipboard!"
      />

      {!submitted && !isReadOnly && (
        <Box className="side-panel">
          <Box className="side-panel-content">
            <SchedulerListComponent schedulers={filteredSchedulers} compact />
          </Box>
        </Box>
      )}

      <div className="formBox">
        {/* Progress Bar */}
        <div className="progressBarContainer">
          <motion.div
            className="progressBar"
            initial={{ width: "0%" }}
            animate={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key={questions[currentQuestionIndex].key}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="questionContainer"
            >
              <QuestionComponent
                question={questions[currentQuestionIndex].question}
                hint={questions[currentQuestionIndex].hint}
                type={
                  answers[questions[currentQuestionIndex].key as keyof Answer]
                    ?.type
                }
                options={
                  answers[questions[currentQuestionIndex].key as keyof Answer]
                    ?.options
                }
                questionKey={questions[currentQuestionIndex].key}
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
              {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
