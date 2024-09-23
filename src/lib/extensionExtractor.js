function extensionExtractor(fileName) {
  const seperateUsingDot = fileName.split(".");
  return seperateUsingDot.length > 1 ? seperateUsingDot.pop() : "";
}

export default extensionExtractor;
