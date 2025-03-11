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

// 시간 형식 검증 헬퍼 함수
function isValidTimeFormat(time: string): boolean {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
}

// 교시 연속성 검증 헬퍼 함수
function arePeriodsConsecutive(periods: number[]): boolean {
  for (let i = 1; i < periods.length; i++) {
    if (periods[i] !== periods[i - 1] + 1) return false;
  }
  return true;
}

function parseClassTime(dayPeriod: string): { day: string; startTime: string; endTime: string } {
  // 입력 파싱
  const [day, periodPart] = dayPeriod.split("(");
  if (!day || !periodPart) {
    console.warn(`Invalid format in "${dayPeriod}". Expected format: "day(period)".`);
    return { day: day || "Unknown", startTime: "00:00", endTime: "00:00" };
  }

  const periodStr = periodPart.replace(")", "");
  const periods = periodStr.split("-").map(Number);

  // 교시 번호 유효성 검사
  const startPeriod = periods[0];
  const endPeriod = periods[periods.length - 1];
  if (isNaN(startPeriod) || isNaN(endPeriod)) {
    console.warn(`Invalid period numbers in "${dayPeriod}".`);
    return { day, startTime: "00:00", endTime: "00:00" };
  }

  if (!(startPeriod in periodTimes) || !(endPeriod in periodTimes)) {
    console.warn(`Period numbers ${startPeriod} or ${endPeriod} not defined in periodTimes for "${dayPeriod}".`);
    return { day, startTime: "00:00", endTime: "00:00" };
  }

  // 연속성 검증 (단일 교시일 경우 생략)
  if (periods.length > 1 && !arePeriodsConsecutive(periods)) {
    console.warn(`Non-consecutive periods in "${dayPeriod}".`);
    return { day, startTime: "00:00", endTime: "00:00" };
  }

  // 시간 설정
  const startTime = periodTimes[startPeriod].start;
  const endTime = periodTimes[endPeriod].end;

  // 시간 형식 검증
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
    console.warn(`Invalid time format in periodTimes for "${dayPeriod}".`);
    return { day, startTime: "00:00", endTime: "00:00" };
  }

  return { day, startTime, endTime };
}

// timetable 데이터 생성
export const timetable: Class[] = [
  { id: 1, ...parseClassTime("화(2)"), subject: "건축학개론", professor: "김하늘", location: "하나과학관 지하 131호", color: "blue" },
  { id: 2, ...parseClassTime("목(2)"), subject: "건축학개론", professor: "김하늘", location: "하나과학관 지하 131호", color: "blue" },
  { id: 3, ...parseClassTime("화(6-8)"), subject: "벤처경영", professor: "박진규", location: "하나과학관 지하 217호", color: "green" },
  { id: 4, ...parseClassTime("화(10-11)"), subject: "캡스톤디자인I", professor: "서민석,김명섭,조민호,김승연,한창희,강신후", location: "과학기술2관 310호", color: "yellow" },
  { id: 5, ...parseClassTime("목(5-6)"), subject: "공학도를위한기업가정신", professor: "이세훈", location: "창의관 207호", color: "pink" },
  { id: 6, ...parseClassTime("화(1)"), subject: "스타트업창업방법론", professor: "김도웅", location: "미래융합 105호", color: "purple" },
  { id: 7, ...parseClassTime("목(1)"), subject: "스타트업창업방법론", professor: "김도웅", location: "미래융합 105호", color: "purple" },
  { id: 8, ...parseClassTime("금(4-5)"), subject: "스타트업CampusCEO2.0(I)", professor: "위강순", location: "교양관 210호", color: "orange" },
  { id: 9, ...parseClassTime("수(2-3)"), subject: "스타트업유니콘비즈니스모델과사례연구", professor: "정진선", location: "하나과학관 501A호", color: "red" },
];

// 데이터 검증
timetable.forEach((classItem) => {
  if (classItem.startTime === "00:00" && classItem.endTime === "00:00") {
    console.warn(`Invalid time range for class ID ${classItem.id}: ${classItem.subject}`);
  }
});