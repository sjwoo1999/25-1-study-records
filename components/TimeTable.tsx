"use client";
import Link from "next/link";
import { timetable } from "@/lib/timetableData";
import "@/app/main-page/page.css";  // 페이지 전용 CSS
import React from "react";

function timeToMinutes(time: string) {
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

const days = ["월", "화", "수", "목", "금"];

export default function TimetablePage() {
  if (!timetable || timetable.length === 0) {
    return <div>시간표 데이터를 로드 중입니다...</div>;
  }

  const earliestMin = Math.min(...timetable.map(cls => timeToMinutes(cls.startTime))) || 8 * 60;
  const latestMin = Math.max(...timetable.map(cls => timeToMinutes(cls.endTime))) || 22 * 60;
  const minHour = Math.floor(earliestMin / 60);
  const maxHour = Math.ceil(latestMin / 60);
  const totalMin = latestMin - earliestMin;
  // 컨테이너 높이를 조절(예: 800px로 고정 혹은 화면 비율에 따라 동적)
  const containerHeight = 800;
  const pxPerMin = containerHeight / totalMin;

  return (
    <main className="timetable-main">
      <h1 className="timetable-title">2025년 1학기 시간표</h1>
      <div className="timetable">
        {/* 헤더 영역 */}
        <div className="header">
          <div className="header-time-slot">시간</div>
          {days.map(day => (
            <div key={day} className="header-day">{day}요일</div>
          ))}
        </div>

        {/* 본문 영역: 스크롤 가능하도록 설정 */}
        <div className="timetable-body" style={{ height: containerHeight, overflowY: "auto" }}>
          {/* 시간 표시 컬럼 */}
          <div className="time-slot" style={{ position: "relative", minWidth: 60 }}>
            {Array.from({ length: maxHour - minHour + 1 }, (_, i) => {
              const hour = minHour + i;
              const topPx = (hour * 60 - earliestMin) * pxPerMin;
              return (
                <div
                  key={hour}
                  className="time-slot"
                  style={{ position: "absolute", top: topPx }}
                >
                  {hour}시
                </div>
              );
            })}
          </div>

          {/* 요일별 컬럼 */}
          <div className="days-body">
            {days.map(day => (
              <div
                key={day}
                className="day-column"
                style={{
                  position: "relative",
                  height: containerHeight,
                  minWidth: 180,
                }}
              >
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
                        className={`event event-${cls.color}`}
                        style={{
                          position: "absolute",
                          top: topPx,
                          height: heightPx,
                          left: 4,
                          width: "calc(100% - 8px)",
                        }}
                      >
                        <p className="class-block-title">{cls.subject}</p>
                        <p className="class-block-sub">{cls.professor}</p>
                        <p className="class-block-sub">{cls.location}</p>
                        <p className="class-block-sub">
                          {cls.startTime} ~ {cls.endTime}
                        </p>
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
