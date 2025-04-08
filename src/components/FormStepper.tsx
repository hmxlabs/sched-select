import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";
import mainImage from "../assets/main.jpeg";
import logo from "../assets/logo.png";
import questions from "../db/questions.json";
import answers from "../db/answers.json";
import schedulers from "../db/schedulers.json";
import QuestionComponent from "./QuestionComponent";
import SchedulerListComponent from "./SchedulerListComponent";
import { SchedulerFeatures, Scheduler } from "../models/Schedulers";
import { Answer } from "../models/Answers";

const StyledBox = styled(Box)({
  backgroundImage: `url(${mainImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },

  "& > *": {
    position: "relative",
    zIndex: 2,
  },
});

const FormStepper: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
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
      setCurrentQuestionIndex((prev) => prev + 1);
    }
    setIsCurrentQuestionAnswered(false);
  };

  return (
    <StyledBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      {!showForm ? (
        <div>
          <Typography variant="h4" color="white" mb={3}>
            Let’s guide you to the best scheduler
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setShowForm(true);
            }}
            sx={{
              backgroundColor: "white",
              color: "#52A8EF",
              fontSize: "1.25rem",
              fontWeight: "bold",
              padding: "12px 24px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Let's Start
          </Button>
        </div>
      ) : (
        <Card
          sx={{
            width: { xs: "80%", sm: "80%", md: "70%", lg: "60%" },
            height: { xs: "60vh", sm: "70vh", md: "75vh" },
            maxWidth: "600px",
            minWidth: "320px",
            p: 3,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              p: 0,
            }}
          >
            <Box sx={{ justifyContent: "center", mt: 2 }}>
              <img
                src={logo}
                alt="Logo"
                style={{ maxWidth: "200px", width: "100%", height: "auto" }}
              />
            </Box>

            {currentQuestionIndex < questions.length && (
              <Box sx={{ justifyContent: "center", mt: 5 }}>
                <h3>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h3>
              </Box>
            )}

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {currentQuestionIndex < questions.length ? (
                <QuestionComponent
                  hint={questions[currentQuestionIndex].hint}
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
              ) : (
                <SchedulerListComponent schedulers={filteredSchedulers} />
              )}
            </Box>

            {currentQuestionIndex < questions.length && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    currentQuestionIndex > 0 ? "space-between" : "flex-end",
                  mt: 2,
                }}
              >
                {currentQuestionIndex > 0 && (
                  <Button
                    sx={{
                      backgroundColor: "#fff",
                      color: "#2591eb",
                      "&:hover": { backgroundColor: "#2591eb", color: "#fff" },
                    }}
                    variant="contained"
                    disabled={currentQuestionIndex === 0}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
                <Button
                  sx={{
                    backgroundColor: "#fff",
                    color: "#2591eb",
                    "&:hover": { backgroundColor: "#2591eb", color: "#fff" },
                  }}
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered}
                >
                  Next
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </StyledBox>
  );
};

export default FormStepper;
