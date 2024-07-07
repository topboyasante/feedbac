const countContainersByMonth = (data) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const startDate = new Date(currentYear - 1, currentMonth + 1, 1);

  // Initialize monthCount with all months in the past year with 0 containers
  const monthCount = {};

  for (
    let date = startDate;
    date <= currentDate;
    date.setMonth(date.getMonth() + 1)
  ) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthYearKey = `${monthNames[month]} ${year}`;
    monthCount[monthYearKey] = 0;
  }

  // Count containers for each month
  data.forEach((container) => {
    const date = new Date(container.createdAt.seconds * 1000);
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthYearKey = `${monthNames[month]} ${year}`;

    if (monthCount[monthYearKey] !== undefined) {
      monthCount[monthYearKey]++;
    }
  });

  // Convert the monthCount object to an array of objects
  const result = Object.keys(monthCount).map((monthYearKey) => ({
    month: monthYearKey,
    containers: monthCount[monthYearKey],
  }));

  return result;
};

const countFeedbackByMonth = (feedbackData) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const startDate = new Date(currentYear - 1, currentMonth + 1, 1);

  // Initialize monthCount with all months in the past year with 0 feedbacks
  const monthCount = {};

  for (
    let date = startDate;
    date <= currentDate;
    date.setMonth(date.getMonth() + 1)
  ) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthYearKey = `${monthNames[month]} ${year}`;
    monthCount[monthYearKey] = 0;
  }

  // Count feedback for each month
  feedbackData.forEach((feedback) => {
    const date = new Date(feedback.createdAt.seconds * 1000);
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthYearKey = `${monthNames[month]} ${year}`;

    if (monthCount[monthYearKey] !== undefined) {
      monthCount[monthYearKey]++;
    }
  });

  // Convert the monthCount object to an array of objects
  const result = Object.keys(monthCount).map((monthYearKey) => ({
    month: monthYearKey,
    feedback: monthCount[monthYearKey],
  }));

  return result;
};

export { countContainersByMonth, countFeedbackByMonth };
