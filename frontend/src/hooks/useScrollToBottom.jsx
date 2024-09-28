import React, { useEffect, useRef } from "react";

const useScrollToBottom = (dependencies) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [dependencies]);

  return containerRef;
};

export default useScrollToBottom;
