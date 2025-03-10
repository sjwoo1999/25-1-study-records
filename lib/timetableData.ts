// lib/timetableData.ts

export type Class = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  professor: string;
  location: string;
  color: string;
};

const periodTimes: { [key: number]: { start: string; end: string } } = {
  0: { start: "08:00", end: "08:50" },
  1: { start: "09:00", end: "10:15" },
  2: { start: "10:30", end: "11:45" },
  3: { start: "12:00", end: "13:15" },
  4: { start: "13:30", end: "14:45" },
  5: { start: "15:00", end: "16:15" },
  6: { start: "16:30", end: "17:45" },
  7: { start: "18:00", end: "18:50" },
  8: { start: "19:00", end: "19:50" },
  9: { start: "20:00", end: "20:50" },
  10: { start: "21:00", end: "21:50" },
  11: { start: "22:00", end: "22:50" },
};

function parseClassTime(dayPeriod: string): { day: string; startTime: string; endTime: string } {
  const [day, period] = dayPeriod.split("(");
  const periodStr = period.replace(")", "");
  const periods = periodStr.split("-").map(Number);
  const startPeriod = periods[0];
  const endPeriod = periods[periods.length - 1];
  const startTime = periodTimes[startPeriod].start;
  const endTime = periodTimes[endPeriod].end;
  return { day, startTime, endTime };
}

export const timetable: Class[] = [
  // 1. 건축학개론: 화(2), 목(2)
  {
    id: 1,
    ...parseClassTime("화(2)"),
    subject: "건축학개론",
    professor: "김하늘",
    location: "하나과학관 지하 131호",
    color: "bg-blue-100",
  },
  {
    id: 2,
    ...parseClassTime("목(2)"),
    subject: "건축학개론",
    professor: "김하늘",
    location: "하나과학관 지하 131호",
    color: "bg-blue-100",
  },
  // 2. 벤처경영: 화(6-8)
  {
    id: 3,
    ...parseClassTime("화(6-8)"),
    subject: "벤처경영",
    professor: "박진규",
    location: "하나과학관 지하 217호",
    color: "bg-green-100",
  },
  // 3. 캡스톤디자인I: 화(10-11)
  {
    id: 4,
    ...parseClassTime("화(10-11)"),
    subject: "캡스톤디자인I",
    professor: "서민석,김명섭,조민호,김승연,한창희,강신후",
    location: "과학기술2관 310호",
    color: "bg-yellow-100",
  },
  // 4. 공학도를위한기업가정신: 목(5-6)
  {
    id: 5,
    ...parseClassTime("목(5-6)"),
    subject: "공학도를위한기업가정신",
    professor: "이세훈",
    location: "창의관 207호",
    color: "bg-pink-100",
  },
  // 5. 스타트업창업방법론: 화(1), 목(1)
  {
    id: 6,
    ...parseClassTime("화(1)"),
    subject: "스타트업창업방법론",
    professor: "김도웅",
    location: "미래융합 105호",
    color: "bg-purple-100",
  },
  {
    id: 7,
    ...parseClassTime("목(1)"),
    subject: "스타트업창업방법론",
    professor: "김도웅",
    location: "미래융합 105호",
    color: "bg-purple-100",
  },
  // 6. 스타트업CampusCEO2.0(I): 금(4-5)
  {
    id: 8,
    ...parseClassTime("금(4-5)"),
    subject: "스타트업CampusCEO2.0(I)",
    professor: "위강순",
    location: "교양관 210호",
    color: "bg-orange-100",
  },
  // 7. 스타트업유니콘비즈니스모델과사례연구: 수(2-3)
  {
    id: 9,
    ...parseClassTime("수(2-3)"),
    subject: "스타트업유니콘비즈니스모델과사례연구",
    professor: "정진선",
    location: "하나과학관 501A호",
    color: "bg-red-100",
  },
];