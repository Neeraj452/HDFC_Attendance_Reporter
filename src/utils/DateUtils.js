import chrono from "chrono-node";
import Config from "./Config";

export default class DateUtils {
    static formatForCSV = (dateStr) => {
        let date = chrono.en_GB.parseDate(dateStr);
        let dd = date.getDate();
        let mm = date.getMonth() + 1; //January is 0 !
        let yyyy = date.getFullYear();
        return DateUtils.formatToTwoDigits(dd) + '/' + DateUtils.formatToTwoDigits(mm) + '/' + yyyy;
    };

    static formatToTwoDigits(number) {
        return ("0" + number).slice(-2);
    }
    static formatForFileName = () => {
        let date = new Date();
        let dd = date.getDate();
        let mm = Config.THREE_LETTER_MONTHS[date.getMonth()];
        let yyyy = date.getFullYear();
        const hour = date.getHours()
        const suffix = hour >= 12 ? "PM" : "AM";
        let h = date.getHours()
        h = DateUtils.formatToTwoDigits(h)
        if (h > 12) {
            h = h - 12
            if (h < 10) {
                h = DateUtils.formatToTwoDigits(h)
            }
        }
        let m = date.getMinutes()
        m = DateUtils.formatToTwoDigits(m)
        const time = h + ":" + m + " " + suffix
        return mm + " " + DateUtils.formatToTwoDigits(dd) + " " + yyyy + " " + time;
    }
}
