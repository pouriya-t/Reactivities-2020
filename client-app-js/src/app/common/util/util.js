export const combineDateAndTime = (date, time) => {
    const timeString = time.getHours() + ":" + time.getMinutes() + ":00";
  
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateString = `${year}-${month}-${day}`;
  
    return new Date(dateString + " " + timeString);
  };
  