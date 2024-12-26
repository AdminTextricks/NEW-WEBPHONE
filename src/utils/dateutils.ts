import { format } from "date-fns";

const formateDate = (date: any, formate?: string) => {
  const dateObj = new Date(date);
  const dateFormat = formate ? formate : "MM/dd/yyyy";
  const formattedDate = format(dateObj, dateFormat);
  return formattedDate;
};
export { formateDate };

const calculateTimeDifference = (startTime: string, endTime: string) => {
  const parseDate = (dateString: string) => {
    const [datePart, timePart, meridian] = dateString.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);
    let [hours, minutes, seconds] = timePart.split(":").map(Number);
    if (meridian.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (meridian.toLowerCase() === "am" && hours === 12) hours = 0;
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };
  const start = parseDate(startTime);
  const end = parseDate(endTime);
  const diff = Math.abs(end.getTime() - start.getTime());
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let formattedTime = "";
  if (days > 0) formattedTime += `${days}D `;
  if (hours > 0 || days > 0)
    formattedTime += `${hours.toString().padStart(2, "0")}:`;
  formattedTime += `${minutes.toString().padStart(2, "0")}:`;
  formattedTime += `${seconds.toString().padStart(2, "0")}`;

  return formattedTime;
};

export { calculateTimeDifference };


const formatTimer = (elapsedTime: any) => {
  const days = Math.floor(elapsedTime / (24 * 3600));
  const hours = Math.floor((elapsedTime % (24 * 3600)) / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  const dayString = days > 0 ? `${days}D ` : "";
  const hourString =
    days > 0 || hours > 0 ? `${String(hours).padStart(2, "0")}:` : "";
  const minuteString = `${String(minutes).padStart(2, "0")}:`;
  const secondString = String(seconds).padStart(2, "0");

  return `${dayString}${hourString}${minuteString}${secondString}`;
};

export { formatTimer };
