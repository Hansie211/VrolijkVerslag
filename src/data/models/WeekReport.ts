//import { v4 as uuid } from 'uuid';
import { mockUuid as uuid } from 'src/data/mock-uuid';

export class DayReport {
  description = '';
  images: string[] = [];
}
export default class WeekReport {
  theme: string;
  startDate: Date;
  id: string;

  dayReports: { [key: number]: DayReport };

  static create(theme: string, startDate: Date): WeekReport {
    return new WeekReport(uuid(), theme, startDate);
  }

  private constructor(id: string, theme: string, startDate: Date) {
    this.id = id;
    this.theme = theme;
    this.startDate = startDate;

    this.dayReports = {};
    for (let i = 0; i < 5; i++) {
      this.dayReports[i] = new DayReport();
    }
  }
}
