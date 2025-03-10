"use client";
import Link from "next/link";
import { timetable } from "@/lib/timetableData";

/** “HH:MM” → total minutes */
function timeToMinutes(time: string) {
  const [hh, mm] = time.split(":").map(Number);
  return hh*60 + mm;
}

// 5 요일
const days = ["월","화","수","목","금"];

export default function TimetablePage(){

  // 1) timetable 전체 순회해 가장 빠른 startTime, 가장 늦은 endTime 구하기
  let earliestMin = Infinity;
  let latestMin   = -Infinity;

  for(const cls of timetable){
    const startM = timeToMinutes(cls.startTime);
    const endM   = timeToMinutes(cls.endTime);
    if(startM < earliestMin) earliestMin = startM;
    if(endM > latestMin)     latestMin   = endM;
  }

  // 혹시 수업이 하나도 없으면 fallback
  if(earliestMin === Infinity || latestMin === -Infinity){
    earliestMin = 8*60;  // 08:00
    latestMin   = 22*60; // 22:00
  }

  // 2) minHour/maxHour => 정시 단위로 라벨링
  const minHour = Math.floor(earliestMin / 60);
  const maxHour = Math.ceil(latestMin / 60);

  // 3) 고정 높이 850px (예시)
  //    => pxPerMin = 850 / (latestMin - earliestMin)
  const containerHeight = 850;
  const totalMin = latestMin - earliestMin;
  const pxPerMin = containerHeight / totalMin;

  return (
    <div className="timetable-container" /* <- height:850px, overflow:hidden in CSS */>
      <h1 className="timetable-title">2025년 1학기</h1>

      {/* 상단 요일 헤더 */}
      <div className="days-header">
        {/* 왼쪽 라벨 영역 자리 확보 */}
        <div style={{ width:"60px" }}/>
        {days.map((day) => (
          <div key={day} className="day-header">
            {day}요일
          </div>
        ))}
      </div>

      {/* 본문: 왼쪽 시간 레이블 + 요일 columns */}
      <div className="flex" style={{ height:"calc(100% - 50px)" }}>
        {/* (A) 왼쪽 시간 레이블 */}
        <div className="time-labels">
          {
            // minHour..maxHour
            Array.from({ length: (maxHour - minHour + 1) }, (_, i) => {
              const hour = minHour + i;
              const topPx = (hour*60 - earliestMin) * pxPerMin;
              return (
                <div
                  key={hour}
                  className="time-line"
                  style={{ top: `${topPx}px` }}
                >
                  {hour}시
                </div>
              );
            })
          }
        </div>

        {/* (B) 요일 columns */}
        <div className="days-body">
          {days.map(day => (
            <div key={day} className="day-column">
              {
                timetable
                  .filter(cls => cls.day === day)
                  .map((cls) => {
                    const sM = timeToMinutes(cls.startTime);
                    const eM = timeToMinutes(cls.endTime);
                    const topPx = (sM - earliestMin)*pxPerMin;
                    const heightPx = (eM - sM)*pxPerMin;

                    return (
                      <Link
                        key={cls.id}
                        href={`/study-records/${encodeURIComponent(cls.subject)}`}
                        className={`class-block ${cls.color}`}
                        style={{
                          top: `${topPx}px`,
                          height: `${heightPx}px`,
                          left: "4px",
                          right: "4px",
                        }}
                      >
                        {/* 과목명(2줄까지), 교수/장소(2줄) */}
                        <p className="class-block-title">{cls.subject}</p>
                        <p className="class-block-sub">
                          {cls.professor}<br/>{cls.location}
                        </p>
                        <p className="class-block-sub">
                          {cls.startTime} ~ {cls.endTime}
                        </p>
                      </Link>
                    );
                  })
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
