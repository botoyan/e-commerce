type AllowedPattern = "letters" | "numbers" | "alphanumeric";

const createKeyDownHandler = (pattern: AllowedPattern) => {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Enter",
    ];

    if (
      allowedKeys.includes(e.key) ||
      (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
      return;
    }

    const patterns: Record<AllowedPattern, RegExp> = {
      letters: /^[a-zA-Z\s]+$/,
      numbers: /^[0-9]$/,
      alphanumeric: /^[a-zA-Z0-9]$/,
    };

    if (!patterns[pattern].test(e.key)) {
      e.preventDefault();
    }
  };
};

export default createKeyDownHandler;
