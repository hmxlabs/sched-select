import { Scheduler, SchedulerFeatures } from "../models/Schedulers";

export const scoreSchedulers = (
  answersState: Record<string, any>,
  schedulers: Scheduler[]
) => {
  return schedulers.map((scheduler) => {
    let totalMatch = 0;
    let unknownCount = 0;

    Object.keys(answersState).forEach((key) => {
      let userAnswer = answersState[key];
      const schedulerFeature =
        scheduler.features[key as keyof SchedulerFeatures];

      if (schedulerFeature === undefined || schedulerFeature === "unknown" || schedulerFeature === null) {
        unknownCount += 1;
        return;
      };

      if (typeof schedulerFeature === "boolean") {
        userAnswer = ["yes", "true"].includes(String(userAnswer).toLowerCase());
        if (userAnswer === true && schedulerFeature === true) {
          totalMatch += 1;
        } else if (userAnswer === false) {
          totalMatch += 1;
        }
      }

      if (typeof schedulerFeature === "number") {
        userAnswer = Number(userAnswer);
        if (!isNaN(userAnswer) && schedulerFeature >= userAnswer) {
          totalMatch += 1;
        }
      } else if (Array.isArray(schedulerFeature)) {
        if (Array.isArray(userAnswer)) {
          const matchedCount = userAnswer.filter((answer: string) =>
            schedulerFeature.includes(answer)
          ).length;
          totalMatch += matchedCount;
        } else if (typeof userAnswer === "string") {
          const userAnswers = userAnswer.split(",").map((a) => a.trim());
          const matchedCount = userAnswers.filter((answer) =>
            schedulerFeature.includes(answer)
          ).length;
          totalMatch += matchedCount;
        } else {
          if (schedulerFeature.includes(userAnswer)) {
            totalMatch += 1;
          }
        }
      }

      if (typeof schedulerFeature === "string") {
        if (schedulerFeature === userAnswer) {
          totalMatch += 1;
        }
      }
    });

    return {
      ...scheduler,
      totalMatch,
      unknownCount,
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

      if (schedulerFeature === undefined || schedulerFeature === "unknown" || schedulerFeature === null) return true;

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

export const formatKey = (key: string): string => {
  const acronyms = ['CPU', 'GPU', 'AWS', 'GCP', 'K8', 'ARM', 'API'];

  const spaced = key.replace(/([a-z])([A-Z])/g, '$1 $2');

  return spaced
    .split(' ')
    .map(word => {
      const match = acronyms.find(acronym =>
        word.toLowerCase().includes(acronym.toLowerCase())
      );
      return match ?? word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

