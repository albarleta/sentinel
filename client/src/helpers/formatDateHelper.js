export const formatDate = (dateString) => {
  if (!dateString) return "Invalid date";
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", dateString);
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};
