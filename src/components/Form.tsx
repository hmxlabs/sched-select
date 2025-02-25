import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import questions from "../db/questions.json";
import answers from "../db/answers.json";
import schedulers from "../db/schedulers.json";
import QuestionComponent from "./QuestionComponent";
import SchedulerListComponent from "./SchedulerListComponent";
import { SchedulerFeatures, Scheduler } from "../models/Schedulers";
import { Answer } from "../models/Answers";

import styles from "./Form.module.css";

export default function Form() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  // const [showForm, setShowForm] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCurrentQuestionAnswered, setIsCurrentQuestionAnswered] =
    useState(false);
  const [answersState, setAnswersState] = useState<Answer>({} as Answer);
  const [filteredSchedulers, setFilteredSchedulers] =
    useState<Scheduler[]>(schedulers);

  useEffect(() => {
    filterSchedulers(answersState);
  }, [answersState]);

  const handleAnswer = (answer: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswersState((prev) => ({ ...prev, [currentQuestion.key]: answer }));
    setIsCurrentQuestionAnswered(true);
  };

  const filterSchedulers = (answersState: Record<string, any>) => {
    const filtered = schedulers.filter((scheduler) => {
      return Object.keys(answersState).every((key) => {
        const userAnswer = answersState[key];
        const schedulerFeature =
          scheduler.features[key as keyof SchedulerFeatures];

        console.log(key, "=>", userAnswer, "vs", schedulerFeature);

        if (schedulerFeature === undefined) {
          return true;
        }

        if (typeof schedulerFeature === "boolean") {
          if (typeof userAnswer === "string") {
            const normalizedUserAnswer = userAnswer.toLowerCase() === "yes";
            return schedulerFeature === normalizedUserAnswer;
          }
          return schedulerFeature === userAnswer;
        }

        if (Array.isArray(schedulerFeature)) {
          return schedulerFeature.includes(userAnswer);
        }

        return schedulerFeature === userAnswer;
      });
    });

    setFilteredSchedulers(filtered);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isCurrentQuestionAnswered) {
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
    setIsCurrentQuestionAnswered(false);
  };

  return (
    <div
      className={styles.container}
      style={{
        background: `url("https://hmxlabs.io/assets/img/hpc-prem-cloud/on-prem.webp")
      no-repeat center center/cover`,
      }}
    >
      <div className={styles.logoContainer}>
        <img src={logo} alt="HMx" className={styles.logo} />
      </div>
      <div className={styles.formBox}>
        <div className={styles.progressBarContainer}>
          <motion.div
            className={styles.progressBar}
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
              className={styles.questionContainer}
            >
              <QuestionComponent
                question={questions[currentQuestionIndex].question}
                type={
                  answers[questions[currentQuestionIndex].key as keyof Answer]
                    .type
                }
                options={
                  answers[questions[currentQuestionIndex].key as keyof Answer]
                    .options
                }
                questionKey={questions[currentQuestionIndex].key}
                onAnswer={handleAnswer}
                allAnswers={answersState}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={styles.submissionContainer}
            >
              <SchedulerListComponent schedulers={filteredSchedulers} />
            </motion.div>
          )}
        </AnimatePresence>

        {!submitted && (
          <div className={styles.buttonContainer}>
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={styles.button}
            >
              Previous
            </button>
            <button onClick={handleNext} className={styles.button}>
              {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
