// src/utils/datetimeUtils.js

// Function to calculate the current datetime based on a timezone
export function getCurrentDatetime(timezone) {
  const nowUTC = new Date(
    Date.now() + new Date().getTimezoneOffset() * 60 * 1000
  );

  if (timezone && timezone.startsWith("UTC")) {
    try {
      const offset = parseUTCOffset(timezone);
      const localTime = new Date(nowUTC.getTime() + offset * 60 * 60 * 1000);
      return formatDatetime(localTime);
    } catch (error) {
      return formatDatetime(new Date());
    }
  } else {
    return formatDatetime(new Date());
  }
}

// Helper function to parse the UTC offset string
function parseUTCOffset(utcString) {
  const match = utcString.match(/^UTC([+-]\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid UTC format: ${utcString}`);
  }

  const sign = match[1][0] === "+" ? 1 : -1;
  const hours = parseInt(match[1].slice(1), 10);
  const minutes = parseInt(match[2], 10);

  return sign * (hours + minutes / 60);
}

// Helper function to format the datetime as "29th Dec 2024, 14:20"
function formatDatetime(date) {
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const ordinalSuffix = getOrdinalSuffix(day);
  return `${day}${ordinalSuffix} ${month} ${year}, ${hour}:${minute}`;
}

// Helper function to get the ordinal suffix for the day
function getOrdinalSuffix(day) {
  const dayInt = parseInt(day, 10);
  if ([11, 12, 13].includes(dayInt % 100)) {
    return "th";
  }
  switch (dayInt % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
