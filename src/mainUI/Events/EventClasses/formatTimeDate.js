export function getTimeString(hours, mins) {
    var timeHR, timeMin;

    if (hours < 10)
        timeHR = "0" + hours;
    else
        timeHR = hours;

    if (mins < 10)
        timeMin = "0" + mins;
    else
        timeMin = mins;

    return timeHR + ":" + timeMin;
};

export function getDateString(month, day, year) {
    var dateMONTH, dateDAY;

    if (month < 10)
        dateMONTH = "0" + month;
    else
        dateMONTH = month;

    if (day < 10)
        dateDAY = "0" + day;
    else
        dateDAY = day;

    return dateMONTH + '-' + dateDAY + '-' + year;
}