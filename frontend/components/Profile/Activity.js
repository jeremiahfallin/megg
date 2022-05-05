import { Box, Grid, Tooltip } from "@chakra-ui/react";

export default function Activity({ activity }) {
  Date.prototype.isLeapYear = function () {
    var year = this.getFullYear();
    if ((year & 3) != 0) return false;
    return year % 100 != 0 || year % 400 == 0;
  };

  // Get Day of Year
  Date.prototype.getDOY = function () {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if (mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
  };

  const days = {};

  activity.forEach((day) => {
    days[new Date(day.year, day.month, day.day).getDOY()] = day.gamesPlayed;
  });

  return (
    <Grid
      gridTemplateRows="repeat(7, 10px)"
      gridTemplateColumns={"repeat(52, 10px)"}
      gridAutoFlow={"column"}
      gap={"4px"}
      justifyContent={"center"}
    >
      {Array.from(Array(365).keys()).map((i) => {
        if (days.hasOwnProperty(i)) {
          return (
            <Tooltip label={`${days[i]} games played`}>
              <Box
                key={i}
                h="10px"
                w="10px"
                bg={days.hasOwnProperty(i) ? "green.200" : "gray.600"}
              />
            </Tooltip>
          );
        }
        return (
          <Box
            key={i}
            h="10px"
            w="10px"
            bg={days.hasOwnProperty(i) ? "green.200" : "gray.600"}
          />
        );
      })}
    </Grid>
  );
}
