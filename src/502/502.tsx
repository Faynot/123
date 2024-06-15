import { useEffect, useState } from "react";

const use502Redirect = () => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    window.addEventListener("error", (event) => {
      if (event.error && event.error.status === 502) {
        setHasError(true);
      }
    });

    if (hasError) {
      window.location.href = "/";
    }
  }, [hasError]);

  return hasError;
};

export default use502Redirect;
