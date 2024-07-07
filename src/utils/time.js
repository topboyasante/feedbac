function getFormattedDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = today.toLocaleDateString("en-US", options);

  return formattedDate.replace(/(\d+),(,? \d{4})/, "$1,$2");
}

function convertTimestampToDate(timestamp) {
  if (!timestamp) return "";

  const { seconds, nanoseconds } = timestamp;
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;
  const date = new Date(milliseconds);

  // Format the date as desired
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return date.toLocaleDateString("en-US", options);
}

export { getFormattedDate, convertTimestampToDate };
