"use client";
import Link from "next/link";
import { timetable } from "@/lib/timetableData";

function timeToMinutes(time: string) {
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

const days = ["월", "화", "수", "목", "금"];

export default function TimetablePage() {
  if (!timetable || timetable.length === 0) {
    return <div>시간표 데이터를 로드 중입니다...</div>;
  }

  const earliestMin = Math.min(...timetable.map((cls) => timeToMinutes(cls.startTime))) || 8 * 60;
  const latestMin = Math.max(...timetable.map((cls) => timeToMinutes(cls.endTime))) || 22 * 60;

  const minHour = Math.floor(earliestMin / 60);
  const maxHour = Math.ceil(latestMin / 60);
  const containerHeight = 850;
  const totalMin = latestMin - earliestMin;
  const pxPerMin = containerHeight / totalMin;

  return (
    <div className="timetable-container" style={{ height: `${containerHeight}px`, overflow: "hidden" }}>
      <h1 className="timetable-title">2025년 1학기</h1>
      <div className="days-header">
        <div style={{ width: "60px" }} />
        {days.map((day) => (
          <div key={day} className="day-header">{day}요일</div>
        ))}
      </div>
      <div className="flex" style={{ height: `calc(100% - 50px)` }}>
        <div className="time-labels">
          {Array.from({ length: maxHour - minHour + 1 }, (_, i) => {
            const hour = minHour + i;
            const topPx = (hour * 60 - earliestMin) * pxPerMin;
            return (
              <div key={hour} className="time-line" style={{ top: `${topPx}px`, position: "absolute" }}>
                {hour}시
              </div>
            );
          })}
        </div>
        <div className="days-body">
          {days.map((day) => (
            <div key={day} className="day-column">
              {timetable.filter((cls) => cls.day === day).map((cls) => {
                const sM = timeToMinutes(cls.startTime);
                const eM = timeToMinutes(cls.endTime);
                const topPx = (sM - earliestMin) * pxPerMin;
                const heightPx = (eM - sM) * pxPerMin;
                return (
                  <Link
                    key={cls.id || cls.subject} // Fallback to subject if id is missing
                    href={`/subject/${encodeURIComponent(cls.subject)}`}
                    className={`class-block ${cls.color}`}
                    style={{ top: `${topPx}px`, height: `${heightPx}px`, position: "absolute", left: "4px", right: "4px" }}
                  >
                    <p className="class-block-title">{cls.subject}</p>
                    <p className="class-block-sub">{cls.professor} <br /> {cls.location}</p>
                    <p className="class-block-sub">{cls.startTime} ~ {cls.endTime}</p>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}