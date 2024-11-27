const REGEX = RegExp('^[+-]\\d{2}:\\d{2}$');

export class DateUtils {
  static parseDate(strDate: string): Date {
    const dateParts = strDate.split('-');
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
  }

  static formatDateToYYYYMMDD(date: Date) {
    return `${date.getFullYear()}-${DateUtils.padWithLeadingZeros(
      date.getMonth() + 1,
      2,
    )}-${DateUtils.padWithLeadingZeros(date.getDate(), 2)}`;
  }

  static padWithLeadingZeros(num: number, totalLength: number) {
    return String(num).padStart(totalLength, '0');
  }

  static parseDateWithTimezone(
    date: Date,
    offset = 7,
  ): {
    year: string;
    month: string;
    day: string;
    hours: string;
    minutes: string;
    seconds: string;
  } {
    const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000; // get utc milliseconds
    const timezoneDate = new Date(utc + offset * 60 * 60 * 1000); // get Date instance, ISO type (can convert to any timezone)

    // Get date time from UTC +- offset. NOTE: all method below convert to local time
    const hours = timezoneDate.getHours();
    const minutes = timezoneDate.getMinutes();
    const seconds = timezoneDate.getSeconds();
    const day = timezoneDate.getDate();
    const month = timezoneDate.getMonth() + 1;
    const year = timezoneDate.getFullYear();

    return {
      year: DateUtils.padWithLeadingZeros(year, 2),
      month: DateUtils.padWithLeadingZeros(month, 2),
      day: DateUtils.padWithLeadingZeros(day, 2),
      hours: DateUtils.padWithLeadingZeros(hours, 2),
      minutes: DateUtils.padWithLeadingZeros(minutes, 2),
      seconds: DateUtils.padWithLeadingZeros(seconds, 2),
    };
  }

  static getCurrentTimeAtTimezone(offset = 7): { date: string; time: string } {
    const now = new Date();
    const parsed = DateUtils.parseDateWithTimezone(now, offset);

    const dateArr = [parsed.year, parsed.month, parsed.day];
    const timeArr = [parsed.hours, parsed.minutes, parsed.seconds];

    return { date: dateArr.join('-'), time: timeArr.join(':') };
  }

  /** Number of days in range [start, end) or (start, end]. Should count 1 if want to count number of days between */
  static getNumberOfDiffDays(dateStr1: string, dateStr2: string): number {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    const diff = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
    return Math.round(diff);
  }

  static addDays(strDate: string, numDays: number): Date {
    const date = DateUtils.parseDate(strDate);
    date.setDate(date.getDate() + numDays);
    return date;
  }

  static getTomorrowOf(strDate: string): string {
    return DateUtils.formatDateToYYYYMMDD(DateUtils.addDays(strDate, 1));
  }

  static getYesterdayOf(strDate: string): string {
    return DateUtils.formatDateToYYYYMMDD(DateUtils.addDays(strDate, -1));
  }

  static getAfterDayOf(strDate: string, days: number): string {
    return DateUtils.formatDateToYYYYMMDD(DateUtils.addDays(strDate, days));
  }

  static getBeforeDaysOf(strDate: string, days: number): string {
    return DateUtils.formatDateToYYYYMMDD(DateUtils.addDays(strDate, -days));
  }

  static getMinDate(dateStr1: string, dateStr2: string): string {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 < date2 ? dateStr1 : dateStr2;
  }

  static getMaxDate(dateStr1: string, dateStr2: string): string {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 > date2 ? dateStr1 : dateStr2;
  }

  static isBefore(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 < date2;
  }

  static isAfter(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 > date2;
  }

  static isEquals(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1.getTime() === date2.getTime();
  }

  static isBetween(dateStr: string, startDateStr: string, endDateStr: string): boolean {
    const date = DateUtils.parseDate(dateStr);
    const startDate = DateUtils.parseDate(startDateStr);
    const endDate = DateUtils.parseDate(endDateStr);
    return date >= startDate && date <= endDate;
  }

  static isBeforeOrEquals(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 <= date2;
  }

  static isAfterOrEquals(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 >= date2;
  }

  static getDateRangeOfQuarter(year: number, quarter: number): { start: string; end: string } {
    if (quarter < 1 || quarter > 4) {
      throw new Error('Quarter must be between 1 and 4');
    }

    const startDate = new Date(year, (quarter - 1) * 3, 1);
    const endDate = new Date(year, quarter * 3, 0);

    return {
      start: DateUtils.formatDateToYYYYMMDD(startDate),
      end: DateUtils.formatDateToYYYYMMDD(endDate),
    };
  }

  static getDateRangeOfMonth(year: number, month: number): { start: string; end: string } {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return {
      start: DateUtils.formatDateToYYYYMMDD(startDate),
      end: DateUtils.formatDateToYYYYMMDD(endDate),
    };
  }

  static splitIntoTenDayIntervals(startDate: string, endDate: string, interval = 10): [string, string][] {
    if (interval < 1) throw new Error('Interval must be greater than 0');

    if (DateUtils.isAfter(startDate, endDate)) {
      throw new Error('Start date must be before end date');
    }

    let currentStart = startDate;
    let currentEnd = DateUtils.getAfterDayOf(currentStart, interval - 1);

    const intervals: [string, string][] = [];

    while (DateUtils.isAfter(endDate, currentEnd)) {
      intervals.push([currentStart, currentEnd]);
      currentStart = DateUtils.getTomorrowOf(currentEnd);
      currentEnd = DateUtils.getAfterDayOf(currentStart, interval - 1);
    }

    // Add the last interval
    intervals.push([currentStart, endDate]);
    return intervals;
  }

  static splitRangeIntoMonths(start: string, end: string): { start: string; end: string }[] {
    let startDate = new Date(start);
    const endDate = new Date(end);
    const result: { start: string; end: string }[] = [];

    while (startDate < endDate) {
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      const lastDayOfMonth = new Date(year, month + 1, 0);

      if (lastDayOfMonth < endDate) {
        result.push({
          start: DateUtils.formatDateToYYYYMMDD(startDate),
          end: DateUtils.formatDateToYYYYMMDD(lastDayOfMonth),
        });
      } else {
        result.push({
          start: DateUtils.formatDateToYYYYMMDD(startDate),
          end: end,
        });
      }
      // startDate.setMonth(month + 1); // month range is wrong if startDate is not first of month, eg: 2024-01-15 - 2024-12-31 will return [2024-01-15, 2022-01-31], [2022-02-15, 2022-02-28], ...
      startDate = new Date(year, month + 1, 1); // always set from [startDate, lastDateOfMonth]
    }
    return result;
  }

  static checkTimeRangeOverlap(
    target: { start: string; end: string },
    rangesToCheck: { start: string; end: string }[],
  ): boolean {
    for (const range of rangesToCheck) {
      if (
        DateUtils.isBetween(target.start, range.start, range.end) ||
        DateUtils.isBetween(target.end, range.start, range.end)
      ) {
        return true;
      }
    }
    return false;
  }

  static getOverlappingInterval(
    leftRange: { start: string; end: string },
    rightRange: { start: string; end: string },
    inclusive = true, // inclusive: [start, end] or exclusive: (start, end)
  ): { start: string; end: string } | null {
    const startOverlap = DateUtils.getMaxDate(leftRange.start, rightRange.start);
    const endOverlap = DateUtils.getMinDate(leftRange.end, rightRange.end);

    if (DateUtils.isAfter(startOverlap, endOverlap) || (!inclusive && startOverlap === endOverlap)) {
      return null;
    }

    return { start: startOverlap, end: endOverlap };
  }

  static parseNumberToDateOld(numDate: number): Date {
    // yyyyMMdd to yyyy-mm-dd
    const strDate = numDate.toString();
    const year = parseInt(strDate.substring(0, 4));
    const month = parseInt(strDate.substring(4, 6));
    const day = parseInt(strDate.substring(6, 8));
    return new Date(year, month - 1, day);
  }

  static parseNumberToDate(numDate: number): Date {
    const strDate = numDate.toString();
    const regex = /^(\d{4})(\d{2})(\d{2})$/;

    if (!regex.test(strDate)) {
      throw new Error('Invalid date format. Expected format: yyyyMMdd');
    }

    const parsed = strDate.match(regex);
    if (!parsed || parsed.length < 4) {
      throw new Error('Parse date failed. Expected format: yyyyMMdd');
    }

    const [, year, month, day] = parsed;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  static parseNumberToString(numDate: number): string {
    return DateUtils.parseDateToString(DateUtils.parseNumberToDate(numDate));
  }

  static parseStringToDate(strDate: string): Date {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (regex.test(strDate) === false) {
      throw new Error('Invalid date format. Expected format: yyyy-MM-dd');
    }

    const dateParts = strDate.split('-');
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
  }

  static parseStringToNumber(strDate: string): number {
    return DateUtils.parseDateToNumber(DateUtils.parseStringToDate(strDate));
  }

  static parseDateToString(date: Date): string {
    return `${date.getFullYear()}-${DateUtils.padWithLeadingZeros(
      date.getMonth() + 1,
      2,
    )}-${DateUtils.padWithLeadingZeros(date.getDate(), 2)}`;
  }

  static parseDateToNumber(date: Date): number {
    return parseInt(
      `${date.getFullYear()}${DateUtils.padWithLeadingZeros(date.getMonth() + 1, 2)}${DateUtils.padWithLeadingZeros(
        date.getDate(),
        2,
      )}`,
    );
  }

  static getDateStringListOfRange(start: string, end: string): string[] {
    const dateList: string[] = [];
    let currentDate = start;

    while (DateUtils.isBeforeOrEquals(currentDate, end)) {
      dateList.push(currentDate);
      currentDate = DateUtils.getTomorrowOf(currentDate);
    }
    return dateList;
  }

  static getPreviousRangeOf(start: string, end: string): { start: string; end: string } {
    // const startDate = DateUtils.parseDate(start);
    // const endDate = DateUtils.parseDate(end);
    // const duration = endDate.getTime() - startDate.getTime();
    // const previousStartDate = new Date(startDate.getTime() - duration);
    // const previousEndDate = new Date(endDate.getTime() - duration);

    // return {
    //   start: DateUtils.formatDateToYYYYMMDD(previousStartDate),
    //   end: DateUtils.formatDateToYYYYMMDD(previousEndDate),
    // };

    const daysDifference = DateUtils.getNumberOfDiffDays(start, end) + 1;
    const previousStartDate = DateUtils.getBeforeDaysOf(start, daysDifference);
    const previousEndDate = DateUtils.getBeforeDaysOf(end, daysDifference);
    // const previousEndDate = DateUtils.getBeforeDaysOf(start, 1);
    // const previousStartDate = DateUtils.getBeforeDaysOf(previousEndDate, daysDifference - 1);
    return {
      start: previousStartDate,
      end: previousEndDate,
    };
  }

  /**
   *
   * @example
   * input = [
   *   { start: '2024-04-05', end: '2024-04-07' },
   *   { start: '2024-04-04', end: '2024-04-06' },
   *   { start: '2024-04-02', end: '2024-04-04' },
   *   { start: '2024-03-29', end: '2024-03-31' },
   *   { start: '2024-03-22', end: '2024-03-24' },
   *   { start: '2024-03-06', end: '2024-03-08' },
   * ];
   *
   * output = [
   *   { start: '2024-03-06', end: '2024-03-08' },
   *   { start: '2024-03-22', end: '2024-03-24' },
   *   { start: '2024-03-29', end: '2024-03-31' },
   *   { start: '2024-04-02', end: '2024-04-06' },
   * ];
   */
  static combineDateRanges(ranges: { start: string; end: string }[]): { start: string; end: string }[] {
    if (ranges.length < 2) {
      return ranges;
    }
    ranges.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()); // sort by start date - ASC

    const result: { start: string; end: string }[] = [];
    let index = 0;
    while (index < ranges.length - 1) {
      const current = ranges[index];
      const next = ranges[index + 1];

      if (DateUtils.isAfterOrEquals(current.end, next.start)) {
        result.push({
          start: current.start,
          end: DateUtils.getMaxDate(current.end, next.end),
        });
        index++; // skip next range in loop
      } else {
        result.push(current);
      }
      index++;
    }
    return result;
  }
}
