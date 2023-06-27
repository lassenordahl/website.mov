import { useState, useEffect, useMemo, useCallback } from "react";

export const useClient = () => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return { client };
};

export const useTimeline = (start, max, repeat = false) => {
  const [step, setStep] = useState(start);

  const percent = useMemo(() => Math.floor((step / max) * 100), [step, max]);

  const prev = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step]);

  const next = useCallback(() => {
    if (repeat && step === max) setStep(0);
    if (step < max) setStep(step + 1);
  }, [step, max, repeat]);

  return {
    step,
    percent,
    next,
    prev,
  };
};
