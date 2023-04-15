import { useEffect, useState } from "react";

export const LoadingAnimation = ({ className }) => {
  const [visibleDot, setVisibleDot] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleDot((prevVisibleDot) =>
        prevVisibleDot < 4 ? prevVisibleDot + 1 : 1
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getOpacity = (dotNumber) => {
    return visibleDot > dotNumber ? 1 : 0;
  };

  const dotStyle = (dotNumber) => ({
    opacity: getOpacity(dotNumber),
  });

  return (
    <p className={className}>
      Loading
      <span style={dotStyle(1)}>.</span>
      <span style={dotStyle(2)}>.</span>
      <span style={dotStyle(3)}>.</span>
    </p>
  );
};
