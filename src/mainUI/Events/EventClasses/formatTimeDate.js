export function getTimeString(hours, mins) {
    if (hours < 10)
        var timeHR = "0" + hours;
    else
        var timeHR = hours;

    if (mins < 10)
        var timeMin = "0" + mins;
    else
        var timeMin = mins;

    return timeHR + ":" + timeMin;
};

export function getDateString(month, day, year) {
    if (month < 10)
        var dateMONTH = "0" + month;
    else
        var dateMONTH = month;

    if (day < 10)
        var dateDAY = "0" + day;
    else
        var dateDAY = day;

    return dateMONTH + '-' + dateDAY + '-' + year;
}