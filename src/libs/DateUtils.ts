
import { getISOWeek } from 'date-fns';

export default class DateUtils {
  private constructor() {
    /* */
  }

  static DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];

  static getLastMonday(date: Date | undefined = undefined): string {
    const current = date ?? new Date();
    const dayOfWeek = current.getDay();
    const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust if Sunday
    const lastMonday = new Date(current.setDate(diff));
    return lastMonday.toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'
  }

  static getWeekDay(index: number): string {
    if (index < 0 || index >= this.DAYS.length) {
      throw new Error(`Invalid index ${index}`);
    }

    return this.DAYS[index];
  }

  static getWeekNumber<DateType extends Date>(date: DateType | number | string ): number {
    return getISOWeek(date);
  }

}
