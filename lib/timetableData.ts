export interface ClassTime {
  day: "월" | "화" | "수" | "목" | "금";
  startTime: string;
  endTime: string;
}

export interface Subject {
  id: number;
  subject: string;
  professor: string;
  location: string;
  color: string;
  times: ClassTime[];
}

export const timetable: Subject[] = [
  {
    id: 1,
    subject: "스타트업창업방법론",
    professor: "김도웅",
    location: "미래융합 105호",
    color: "green",
    times: [
      { day: "화", startTime: "09:00", endTime: "10:15" },
      { day: "목", startTime: "09:00", endTime: "10:15" },
    ],
  },
  {
    id: 2,
    subject: "건축학개론",
    professor: "김하늘",
    location: "하나과학관 지하 131호",
    color: "blue",
    times: [
      { day: "화", startTime: "10:30", endTime: "11:45" },
      { day: "목", startTime: "10:30", endTime: "11:45" },
    ],
  },
  {
    id: 3,
    subject: "스타트업유니콘비즈니스모델과사례연구",
    professor: "정진선",
    location: "하나과학관 501A호",
    color: "blue",
    times: [{ day: "수", startTime: "10:30", endTime: "13:15" }],
  },
  {
    id: 4,
    subject: "공학도를위한기업가정신",
    professor: "이세훈",
    location: "창의관 207호",
    color: "yellow",
    times: [{ day: "목", startTime: "15:00", endTime: "17:45" }],
  },
  {
    id: 5,
    subject: "스타트업CampusCEO2.0(I)",
    professor: "위강순",
    location: "교양관 210호",
    color: "orange",
    times: [{ day: "금", startTime: "13:30", endTime: "16:15" }],
  },
  {
    id: 6,
    subject: "벤처경영",
    professor: "박진규",
    location: "하나과학관 지하 217호",
    color: "pink",
    times: [{ day: "화", startTime: "16:30", endTime: "19:15" }],
  },
  {
    id: 7,
    subject: "캡스톤디자인I",
    professor: "서민석,김명섭,조민호 등",
    location: "과학기술2관 310호",
    color: "purple",
    times: [{ day: "화", startTime: "20:00", endTime: "20:50" }],
  },
];