const getFirstLetter = (str: string): string => {
  const trimmedString = str.trimStart(); // Removes any leading spaces
  return trimmedString.charAt(0); // Returns the first character
};

export { getFirstLetter };