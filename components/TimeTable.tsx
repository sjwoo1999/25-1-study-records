import React from "react";
import "./TimeTable.css";

// Define days
const days = ["월", "화", "수", "목", "금"];

// Course data (기존 데이터 유지)
const courses = [
  { no: 1, code: "ARCH101", section: "00", type: "전공필수", name: "건축학개론", professor: "김하늘", credits: "3(3)", timeRoom: "화(2) 하나과학관 지하 131호\n목(2) 하나과학관 지하 131호", retake: "", status: "신청", drop: "" },
  { no: 2, code: "BUSS259", section: "03", type: "전공선택", name: "벤처경영", professor: "박진규", credits: "3(3)", timeRoom: "화(6-8) 하나과학관 지하 217호", retake: "", status: "신청", drop: "" },
  { no: 3, code: "DCCS451", section: "00", type: "전공필수", name: "캡스톤디자인I", professor: "서민석,김명섭 조민호,김승연 한창희,강신후", credits: "1(2)", timeRoom: "화(19:00-20:00) 과학기술2관 310호", retake: "", status: "신청", drop: "" },
  { no: 4, code: "EGRN400", section: "00", type: "교양", name: "공학도를위한기업가정신", professor: "이세훈", credits: "3(3)", timeRoom: "목(5-6) 창의관 207호", retake: "", status: "신청", drop: "" },
  { no: 5, code: "SMRT468", section: "00", type: "전공선택", name: "스타트업창업방법론", professor: "김도웅", credits: "3(3)", timeRoom: "화(1) 미래융합 105호\n목(1) 미래융합 105호", retake: "", status: "신청", drop: "" },
  { no: 6, code: "SPGE220", section: "02", type: "교양", name: "스타트업CampusCEO2.0(I)", professor: "위강순", credits: "3(3)", timeRoom: "금(4-5) 교양관 210호", retake: "", status: "신청", drop: "" },
  { no: 7, code: "TEEN330", section: "00", type: "전공선택", name: "스타트업유니콘비즈니스모델과사례연구", professor: "정진선", credits: "3(3)", timeRoom: "수(2-3) 하나과학관 501A호", retake: "", status: "신청", drop: "" },
];

// 슬롯 정의 (기존 시간표 기준)
const slots = [
  { id: 0, time: "08:00~08:50" },
  { id: 1, time: "09:00~10:15" },
  { id: 2, time: "10:30~11:45" },
  { id: 3, time: "12:00~13:15" },
  { id: 4, time: "13:30~14:45" },
  { id: 5, time: "15:00~16:15" },
  { id: 6, time: "16:30~17:45" },
  { id: 7, time: "18:00~18:50" },
  { id: 8, time: "19:00~19:50" },
  { id: 9, time: "20:00~20:50" },
];

// 시간을 분 단위로 변환하는 헬퍼 함수
function timeToMinutes(time: string): number {
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

// 분을 시간 문자열로 변환하는 헬퍼 함수
function minutesToTime(minutes: number): string {
  const hh = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mm = (minutes % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

// 강의 시간 파싱 함수
function parseLectureTime(timeRoom: string): { day: string; startMin: number; endMin: number; room: string }[] {
  const entries = timeRoom.split("\n");
  return entries.map((entry) => {
    // 특수 시간 처리 (예: 19:00-20:00)
    if (entry.includes("19:00-20:00")) {
      return { day: "화", startMin: 19 * 60, endMin: 20 * 60, room: entry.split(") ")[1] };
    }

    // 슬롯 기반 시간 파싱
    const match = entry.match(/([월화수목금])\((\d+)(?:-(\d+))?\)\s*(.*)/);
    if (match) {
      const day = match[1];
      const startSlot = parseInt(match[2]);
      const endSlot = match[3] ? parseInt(match[3]) : startSlot;
      const room = match[4];

      const startTime = slots.find((s) => s.id === startSlot)?.time.split("~")[0];
      const endTime = slots.find((s) => s.id === endSlot)?.time.split("~")[1];
      if (!startTime || !endTime) throw new Error(`Invalid slot: ${entry}`);

      const startMin = timeToMinutes(startTime);
      const endMin = timeToMinutes(endTime);
      return { day, startMin, endMin, room };
    }
    throw new Error(`Invalid format: ${entry}`);
  });
}

export default function TimeTable() {
  // 시간 라벨 생성 (1시간 단위로 표시)
  const timeLabels = [];
  for (let hour = 8; hour <= 21; hour++) {
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    const rowStart = (hour - 8) * 4 + 2; // 15분 단위로 4개씩 계산
    timeLabels.push(
      <div key={hour} className="time-slot" style={{ gridRow: `${rowStart} / ${rowStart + 4}` }}>
        {timeStr}
      </div>
    );
  }

  return (
    <div className="timetable">
      {/* Header row */}
      <div className="header" style={{ gridColumn: "time", gridRow: "header" }}>
        시간
      </div>
      {days.map((day, index) => (
        <div key={day} className="header" style={{ gridColumn: index + 2, gridRow: "header" }}>
          {day}
        </div>
      ))}

      {/* Time slots */}
      {timeLabels}

      {/* Class blocks */}
      {courses.flatMap((course) => {
        const lectureTimes = parseLectureTime(course.timeRoom);
        return lectureTimes.map((entry, idx) => {
          const dayIndex = days.indexOf(entry.day) + 2; // 시간 열 이후 인덱스
          const startRow = Math.floor((entry.startMin - 8 * 60) / 15) + 2; // 08:00 기준 행 계산
          const endRow = Math.floor((entry.endMin - 8 * 60) / 15) + 2;

          return (
            <div
              key={`${course.code}-${idx}`}
              className={`class-block ${course.type}`}
              style={{ gridColumn: dayIndex, gridRow: `${startRow} / ${endRow}` }}
            >
              <div>{course.name}</div>
              <div>{course.professor}</div>
              <div>{entry.room}</div>
              <div>
                {minutesToTime(entry.startMin)} ~ {minutesToTime(entry.endMin)}
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}