"use client";
import Link from "next/link";
import { timetable } from "@/lib/timetableData";
import "@/app/main-page/page.css";

function timeToMinutes(time: string): number {
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

const days = ["월", "화", "수", "목", "금"];

export default function TimetablePage() {
  // 데이터 디버깅
  console.log("Timetable Data:", timetable);

  // 데이터 로드 실패 시 처리
  if (!timetable || timetable.length === 0) {
    return (
      <div className="error-message">
        시간표 데이터를 로드할 수 없습니다. 데이터를 확인해주세요.
      </div>
    );
  }

  // 시간 범위 계산
  const earliestMin = Math.min(...timetable.map(cls => timeToMinutes(cls.startTime))) || 8 * 60;
  const latestMin = Math.max(...timetable.map(cls => timeToMinutes(cls.endTime))) || 22 * 60;
  const totalMin = latestMin - earliestMin;
  const containerHeight = 800; // 고정 높이 (필요 시 동적 조정 가능)
  const pxPerMin = containerHeight / totalMin;

  return (
    <main className="timetable-main">
      <h1 className="timetable-title">2025년 1학기 시간표</h1>
      <div className="timetable">
        {/* 요일 헤더 */}
        <div className="days-header">
          <div className="header-time-slot">시간</div>
          {days.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        {/* 시간표 본문 */}
        <div className="timetable-body" style={{ height: `${containerHeight}px` }}>
          {/* 시간 슬롯 */}
          <div className="time-slot-container">
            {Array.from(
              { length: Math.ceil(latestMin / 60) - Math.floor(earliestMin / 60) + 1 },
              (_, i) => {
                const hour = Math.floor(earliestMin / 60) + i;
                const topPx = (hour * 60 - earliestMin) * pxPerMin;
                return (
                  <div key={hour} className="time-slot" style={{ top: `${topPx}px` }}>
                    {hour}시
                  </div>
                );
              }
            )}
          </div>
          {/* 요일별 강의 블록 */}
          <div className="days-body">
            {days.map(day => (
              <div key={day} className="day-column" style={{ height: `${containerHeight}px` }}>
                {timetable
                  .filter(cls => cls.day === day)
                  .map(cls => {
                    const sM = timeToMinutes(cls.startTime);
                    const eM = timeToMinutes(cls.endTime);
                    const topPx = (sM - earliestMin) * pxPerMin;
                    const heightPx = (eM - sM) * pxPerMin;
                    return (
                      <Link
                        key={cls.id || cls.subject}
                        href={`/subject/${encodeURIComponent(cls.subject)}`}
                        className={`class-block event-${cls.color}`}
                        style={{
                          top: `${topPx}px`,
                          height: `${heightPx}px`,
                          width: "calc(100% - 12px)",
                          left: "6px",
                        }}
                      >
                        <div className="event-content">
                          <p className="class-block-title">{cls.subject}</p>
                          <p className="class-block-sub">{cls.professor}</p>
                          <p className="class-block-sub">{cls.location}</p>
                          <p className="class-block-sub">
                            {cls.startTime} ~ {cls.endTime}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}