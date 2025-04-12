const handleDuplicateError = (err: any) => {
  // Extract value within quotes using regex
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1] ? match[1] : "";

  const errorMessage = `${extractedMessage} is already in use`;

  return {
    statusCode: 400,
    message: "Duplicate Entry",
    errorMessage,
  };
};

export default handleDuplicateError;
