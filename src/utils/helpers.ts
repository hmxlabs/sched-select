import { Scheduler, SchedulerFeatures } from "../models/Schedulers";

export const scoreSchedulers = (
  answersState: Record<string, any>,
  schedulers: Scheduler[]
) => {
  return schedulers.map((scheduler) => {
    let totalScore = 0;

    Object.keys(answersState).forEach((key) => {
      let userAnswer = answersState[key];
      const schedulerFeature =
        scheduler.features[key as keyof SchedulerFeatures];

      if (schedulerFeature === undefined) return;

      if (typeof schedulerFeature === "boolean") {
        userAnswer = ["yes", "true"].includes(String(userAnswer).toLowerCase());
        if (userAnswer === true && schedulerFeature === true) {
          totalScore += 1;
        } else if (userAnswer === false) {
          totalScore += 1;
        }
      }

      if (typeof schedulerFeature === "number") {
        userAnswer = Number(userAnswer);
        if (!isNaN(userAnswer) && schedulerFeature >= userAnswer) {
          totalScore += 1;
        }
      } else if (Array.isArray(schedulerFeature)) {
        if (Array.isArray(userAnswer)) {
          const matchedCount = userAnswer.filter((answer: string) =>
            schedulerFeature.includes(answer)
          ).length;
          totalScore += matchedCount;
        } else if (typeof userAnswer === "string") {
          const userAnswers = userAnswer.split(",").map((a) => a.trim());
          const matchedCount = userAnswers.filter((answer) =>
            schedulerFeature.includes(answer)
          ).length;
          totalScore += matchedCount;
        } else {
          if (schedulerFeature.includes(userAnswer)) {
            totalScore += 1;
          }
        }
      }

      if (typeof schedulerFeature === "string") {
        if (schedulerFeature === userAnswer) {
          totalScore += 1;
        }
      }
    });

    return {
      ...scheduler,
      score: totalScore,
    };
  });
};

export const filterSchedulers = (
  answersState: Record<string, any>,
  schedulers: Scheduler[]
) => {
  return schedulers.filter((scheduler) =>
    Object.keys(answersState).every((key) => {
      let userAnswer = answersState[key];
      const schedulerFeature =
        scheduler.features[key as keyof SchedulerFeatures];

      if (schedulerFeature === undefined) return true;

      if (typeof schedulerFeature === "boolean") {
        userAnswer = ["yes", "true"].includes(String(userAnswer).toLowerCase());
        if (userAnswer === true) {
          return schedulerFeature === true;
        }

        return true;
      }

      if (typeof schedulerFeature === "number") {
        userAnswer = Number(userAnswer);
        return !isNaN(userAnswer) && schedulerFeature >= userAnswer;
      }

      if (Array.isArray(schedulerFeature)) {
        if (Array.isArray(userAnswer)) {
          return userAnswer.some((answer: string) =>
            schedulerFeature.includes(answer)
          );
        }
        if (typeof userAnswer === "string") {
          userAnswer = userAnswer.split(",");
          return userAnswer.some((answer: string) =>
            schedulerFeature.includes(answer)
          );
        }
        return schedulerFeature.includes(userAnswer);
      }

      return schedulerFeature === userAnswer;
    })
  );
};

export const generateShareableLink = (
  setOpenSnackbar: (state: boolean) => void
) => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => setOpenSnackbar(true));
};
