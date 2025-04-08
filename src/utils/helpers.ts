import { Scheduler, SchedulerFeatures } from "../models/Schedulers";

export const scoreSchedulers = (answersState: Record<string, any>, schedulers: Scheduler[]) => {
  return schedulers.map((scheduler) => {
    let totalScore = 0;

    Object.keys(answersState).forEach((key) => {
      let userAnswer = answersState[key];
      const schedulerFeature = scheduler.features[key as keyof SchedulerFeatures];

      if (schedulerFeature === undefined) return;

      if (typeof schedulerFeature === "boolean") {
        userAnswer = ["yes", "true"].includes(String(userAnswer).toLowerCase());
        if (schedulerFeature === userAnswer) {
          totalScore += 1;
        }
      }

      if (typeof schedulerFeature === "number") {
        userAnswer = Number(userAnswer);
        if (schedulerFeature >= userAnswer) {
          totalScore += 1;
        }
      }

      if (Array.isArray(schedulerFeature)) {
        if (Array.isArray(userAnswer)) {
          const matchedCount = userAnswer.filter((answer: string) => schedulerFeature.includes(answer)).length;
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

export const filterSchedulers = (answersState: Record<string, any>, schedulers: Scheduler[]) => {
  return schedulers.filter((scheduler) =>
    Object.keys(answersState).every((key) => {
      let userAnswer = answersState[key];
      const schedulerFeature = scheduler.features[key as keyof SchedulerFeatures];

      if (schedulerFeature === undefined) return true;

      if (typeof schedulerFeature === "boolean") {
        userAnswer = ["yes", "true"].includes(String(userAnswer).toLowerCase());
        return schedulerFeature === userAnswer;
      }

      if (typeof schedulerFeature === "number") {
        userAnswer = Number(userAnswer);
        return schedulerFeature >= userAnswer;
      }

      if (Array.isArray(schedulerFeature)) {
        if (Array.isArray(userAnswer)) {
          return userAnswer.every((answer: string) => schedulerFeature.includes(answer));
        }
        if (typeof userAnswer === "string") {
            userAnswer = userAnswer.split(",");
            return userAnswer.every((answer: string) => schedulerFeature.includes(answer));
        }
        return schedulerFeature.includes(userAnswer);
      }

      return schedulerFeature === userAnswer;
    })
  );
};

export const generateShareableLink = (setOpenSnackbar: (state: boolean) => void) => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => setOpenSnackbar(true));
};