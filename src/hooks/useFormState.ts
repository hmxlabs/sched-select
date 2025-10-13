import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Answer } from '../models/Answers';
import { Scheduler } from '../models/Schedulers';
import { filterSchedulers, scoreSchedulers } from '../utils/helpers';
import schedulers from '../db/schedulers.json';

export const useFormState = () => {
  const [answersState, setAnswersState] = useState<Answer>({} as Answer);
  const [filteredSchedulers, setFilteredSchedulers] = useState<Scheduler[]>(schedulers);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0 && isInitialLoad) {
      // This is a shared link - make it read-only
      setAnswersState(params as unknown as Answer);
      setIsReadOnly(true);
    }
    setIsInitialLoad(false);
  }, [searchParams, isInitialLoad]);

  useEffect(() => {
    const updatedSchedulers = schedulers.map((scheduler) => {
      const isMatch = filterSchedulers(answersState, [scheduler]).length > 0;
      return { ...scheduler, isMatch: isMatch || false };
    });
    setFilteredSchedulers(updatedSchedulers);
  }, [answersState]);

  const updateAnswers = useCallback((newAnswers: Answer) => {
    setAnswersState(newAnswers);
    setSearchParams(
      new URLSearchParams(
        Object.entries(newAnswers).map(([key, value]) => [key, String(value)])
      )
    );
  }, [setSearchParams]);

  const resetForm = useCallback(() => {
    setAnswersState({} as Answer);
    setIsReadOnly(false);
    setIsInitialLoad(false);
    setFilteredSchedulers(schedulers);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const finalizeResults = useCallback(() => {
    const final = scoreSchedulers(answersState, filteredSchedulers);
    setFilteredSchedulers(final);
  }, [answersState, filteredSchedulers]);

  return {
    answersState,
    filteredSchedulers,
    isReadOnly,
    updateAnswers,
    resetForm,
    finalizeResults,
  };
};
