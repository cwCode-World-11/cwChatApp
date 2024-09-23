const timeConversion = (second, nanosecond) => {
  const seconds = second;
  const nanoseconds = nanosecond;
  const timeStampInMs = seconds * 1000 + Math.floor(nanoseconds / 1000000);

  const date = new Date(timeStampInMs);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth()).padStart(2, "0");
  const year = date.getFullYear();
  let hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || hour;

  return {
    date: `${day}/${month}/${year}`,
    time: `${hour}:${minutes} ${period}`,
  };
};

export { timeConversion };
