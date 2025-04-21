export function isToday(date) {
  if (
    new Date().getDate() === new Date(date).getDate() &&
    new Date().getMonth() === new Date(date).getMonth()
  ) {
    return true;
  } else {
    return false;
  }
}

export function isInCurrentWeek(date) {
  const today = new Date();
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay()
  );
  const endOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + (6 - today.getDay())
  );

  return date >= startOfWeek && date <= endOfWeek;
}

export function isInWeekRange(startOfWeek, date) {
  const endOfWeek = new Date(
    new Date(startOfWeek).getTime() + 7 * 24 * 60 * 60 * 1000
  );

  return date >= startOfWeek && date <= endOfWeek;
}

export function isInCurrentMonth(date) {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return date >= startOfMonth && date <= endOfMonth;
}

export function isDateInPast(date) {
  const today = new Date();
  return date < today;
}

export function getDayNameFromDate(date) {
  return new Date(date).toLocaleDateString("en-UK", { weekday: "long" });
}

export function formatDate(date) {
  const formattedDate = new Date(date).toLocaleString("en-UK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return formattedDate;
}

export function generateRandomID(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export function generateSimplePassword(length = 8) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export function differenceInMinutes(date1, date2) {
  // Calculate the difference in milliseconds
  const diffMilliseconds = Math.abs(date1 - date2);

  // Convert milliseconds to minutes
  return Math.floor(diffMilliseconds / (60 * 1000));
}

export function generateQuoteName(email) {
  if (!email) {
    throw new Error("Please provide a valid email address.");
  }

  // Split the email address at the "@" symbol to get the first part.
  const emailPrefix = email.split("@")[0];

  // Get today's date and format it.
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  // Get the current time.
  const time = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

  // Combine the email prefix, the formatted date, and the time to get the quoteName.
  const quoteName = `${emailPrefix}_${formattedDate}_${time}`;

  return quoteName;
}
