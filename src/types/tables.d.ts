export interface Words {
  UserId: string;
  Word: string;
  NextTime: string;
  StudyTime: string,
  Times: number,
  IsUsing?: boolean,
}

export interface Times {
  UserId: string;
  Times: number,
  DayDelay?: number,
}