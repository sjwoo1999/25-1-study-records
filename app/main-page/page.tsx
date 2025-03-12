"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import './page.css';

// ========== 1) 요일 & 상수 ==========
const DAYS = ["월", "화", "수", "목", "금"] as const;
const START_HOUR = 9;          // 09:00
const END_HOUR = 21;           // 21:00
const END_MINUTES = END_HOUR * 60 + 30; // 21:30 => 1290
const START_MINUTES = START_HOUR * 60;  // 540 => 09:00
const TIME_INTERVAL = 15;               // 15분 단위

// ========== 2) 인터페이스 ==========
export interface ClassTime {
  day: "월" | "화" | "수" | "목" | "금";
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}
export interface Subject {
  id: number;
  subject: string;
  professor: string;
  location: string;
  color: string;
  times: ClassTime[];
}

// ========== 3) 예시 데이터 ==========
const timetable: Subject[] = [
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
    subject: "공학도를위한기업가정신",
    professor: "이세훈",
    location: "창의관 207호",
    color: "yellow",
    times: [{ day: "목", startTime: "15:00", endTime: "17:45" }],
  },
  {
    id: 4,
    subject: "벤처경영",
    professor: "박진규",
    location: "하나과학관 지하 217호",
    color: "pink",
    times: [{ day: "화", startTime: "16:30", endTime: "19:15" }],
  },
  {
    id: 5,
    subject: "캡스톤디자인I",
    professor: "서민석,김명섭,조민호 등",
    location: "과학기술2관 310호",
    color: "purple",
    times: [{ day: "화", startTime: "20:00", endTime: "20:50" }],
  },
];

// ========== 4) 유틸 함수 (time->minutes->row) ==========
function timeToMinutes(time: string): number {
  const [hh, mm] = time.split(":").map(Number);
  if (isNaN(hh) || isNaN(mm) || hh < 0 || mm < 0 || mm >= 60) {
    console.error(`Invalid time format: "${time}"`);
    return START_MINUTES; // fallback => 09:00
  }
  return hh * 60 + mm;
}
function getStartRow(time: string): number {
  const mins = timeToMinutes(time);
  if (mins < START_MINUTES) return 2;
  if (mins > END_MINUTES) return 52;
  const index = (mins - START_MINUTES) / TIME_INTERVAL; // 0..50
  return Math.floor(index) + 2; // row=2 => 09:00
}
function getEndRow(time: string): number {
  const mins = timeToMinutes(time);
  if (mins < START_MINUTES) return 2;
  if (mins > END_MINUTES) return 52;
  const index = (mins - START_MINUTES) / TIME_INTERVAL;
  return Math.ceil(index) + 2;
}

// ========== 5) 정시 라벨, 가로선 생성 ==========
function generateHourLabels(): JSX.Element[] {
  const labels: JSX.Element[] = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    const row = getStartRow(timeStr);
    labels.push(
      <div
        key={timeStr}
        className="time-slot"
        style={{
          gridColumn: 1,
          gridRow: `${row} / ${row + 1}`,
        }}
      >
        {timeStr}
      </div>
    );
  }
  return labels;
}
function generateRowLines(): JSX.Element[] {
  const lines: JSX.Element[] = [];
  for (let m = START_MINUTES + TIME_INTERVAL; m <= END_MINUTES; m += TIME_INTERVAL) {
    const rowIndex = Math.floor((m - START_MINUTES) / TIME_INTERVAL) + 2;
    const isHour = (m % 60 === 0);
    lines.push(
      <div
        key={`line-${m}`}
        className={isHour ? "row-line hour-line" : "row-line"}
        style={{
          gridColumn: "2 / 7",
          gridRow: rowIndex,
        }}
      />
    );
  }
  return lines;
}

// ========== 6) 메인 컴포넌트 ==========
export default function MainPage() {
  // 디버깅: 실제 배치 로그
  useEffect(() => {
    const blocks = document.querySelectorAll(".timetable-class-block");
    blocks.forEach((b) => {
      const style = window.getComputedStyle(b);
      console.log(
        `Block: ${b.textContent?.slice(0,10)} => Column: ${style.gridColumnStart}, Row: ${style.gridRowStart} / ${style.gridRowEnd}`
      );
    });
  }, []);

  // 라벨, 가로선
  const hourLabels = generateHourLabels();
  const rowLines = generateRowLines();

  // 수업 블록
  const classBlocks = timetable.flatMap((subj) =>
    subj.times.map((slot, idx) => {
      const dayIndex = DAYS.indexOf(slot.day); 
      if (dayIndex === -1) {
        console.warn(`Invalid day: "${slot.day}" (subject: ${subj.subject})`);
        return null;
      }
      const col = dayIndex + 2; // 월=2, 화=3, 수=4, 목=5, 금=6
      const startRow = getStartRow(slot.startTime);
      const endRow = getEndRow(slot.endTime);
      if (startRow >= endRow) {
        console.warn(`Time range error: ${slot.startTime} ~ ${slot.endTime}`);
        return null;
      }
      return (
        <Link href={`/subject/${encodeURIComponent(subj.subject)}`} key={`${subj.id}-${idx}`}>
          <div
            className={`timetable-class-block ${subj.color || "gray"}`}
            style={{
              gridColumn: col,
              gridRow: `${startRow} / ${endRow}`,
            }}
          >
            <div className="subject">{subj.subject}</div>
            <div>{subj.professor}</div>
            <div>{subj.location}</div>
            <div>{slot.startTime} ~ {slot.endTime}</div>
          </div>
        </Link>
      );
    })
  ).filter(Boolean);

  return (
    <>
      <style jsx>{`
        .timetable {
          display: grid;
          grid-template-columns: 100px repeat(5, 1fr);
          grid-template-rows: 50px repeat(50, 30px);
          gap: 2px;
          max-width: 1200px;
          width: 90%;
          margin: 20px auto;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #34495e;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 2px solid #2c3e50;
          text-transform: uppercase;
        }
        .time-slot {
          background-color: #ecf0f1;
          font-size: 12px;
          color: #7f8c8d;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #dfe6e9;
          font-weight: 500;
        }
        .timetable-class-block {
          background-color: #fff;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 13px;
          line-height: 1.5;
          margin: 2px;
          border: 1px solid #ccc;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
          position: relative;
        }
        .timetable-class-block .subject {
          font-weight: bold;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .timetable-class-block.green { background-color: #2ecc71; color: #fff; }
        .timetable-class-block.blue { background-color: #3498db; color: #fff; }
        .timetable-class-block.yellow { background-color: #f1c40f; color: #2c3e50; }
        .timetable-class-block.orange { background-color: #ff9800; color: #fff; }
        .timetable-class-block.pink { background-color: #ff69b4; color: #fff; }
        .timetable-class-block.purple { background-color: #9b59b6; color: #fff; }
        .timetable-class-block.red { background-color: #e74c3c; color: #fff; }
        .timetable-class-block.gray { background-color: #bdc3c7; color: #2c3e50; }
        .timetable-class-block:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .row-line {
          border-top: 1px solid #d5d8dc;
        }
        .row-line.hour-line {
          border-top: 2px solid #95a5a6;
        }
        @media (max-width: 768px) {
          .timetable {
            grid-template-columns: 60px repeat(5, 1fr);
            grid-template-rows: 40px repeat(50, 25px);
            margin: 10px;
            gap: 1px;
          }
          .timetable-class-block {
            font-size: 11px;
            padding: 4px 6px;
          }
          .header {
            font-size: 13px;
          }
          .time-slot {
            font-size: 10px;
          }
        }
      `}</style>

      <div className="timetable">
        {/* 헤더 (시간 / 요일) => row=1 */}
        <div className="header" style={{ gridColumn: 1, gridRow: 1 }}>
          시간
        </div>
        {DAYS.map((day, i) => (
          <div
            key={day}
            className="header"
            style={{ gridColumn: i + 2, gridRow: 1 }}
          >
            {day}
          </div>
        ))}

        {/* 15분 간격 라인 + 정시 라벨 */}
        {rowLines}
        {hourLabels}

        {/* 실제 수업 블록 */}
        {classBlocks}
      </div>
    </>
  );
}
