"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import "./page.css"; // 유일한 .timetable 정의

// 요일, 시간 상수
const DAYS = ["월", "화", "수", "목", "금"] as const;
const START_HOUR = 9;
const END_HOUR = 21;
const END_MINUTES = END_HOUR*60 + 30; // 21:30 =>1290
const START_MINUTES = START_HOUR*60;  // 540 =>09:00
const TIME_INTERVAL = 15; //15분

function timeToMinutes(time:string):number {
  const [hh,mm] = time.split(":").map(Number);
  if(isNaN(hh)||isNaN(mm)||hh<0||mm<0||mm>=60){
    console.error(`Invalid time format: "${time}"`);
    return START_MINUTES; // fallback =>09:00
  }
  return hh*60+mm;
}
function getStartRow(time:string):number {
  const mins=timeToMinutes(time);
  if(mins<START_MINUTES)return 2;
  if(mins>END_MINUTES)return 52;
  const index=(mins-START_MINUTES)/TIME_INTERVAL; //0..50
  return Math.floor(index)+2;
}
function getEndRow(time:string):number {
  const mins=timeToMinutes(time);
  if(mins<START_MINUTES)return 2;
  if(mins>END_MINUTES)return 52;
  const index=(mins-START_MINUTES)/TIME_INTERVAL;
  return Math.ceil(index)+2;
}

// 예시 데이터
export interface ClassTime {
  day: "월"|"화"|"수"|"목"|"금";
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

// 정시 라벨
function generateHourLabels():JSX.Element[] {
  const labels=[];
  for(let hour=START_HOUR; hour<=END_HOUR; hour++){
    const timeStr=`${hour.toString().padStart(2,"0")}:00`;
    const row=getStartRow(timeStr);
    labels.push(
      <div key={timeStr} className="time-slot"
        style={{gridColumn:1, gridRow:`${row} / ${row+1}`}}>
        {timeStr}
      </div>
    );
  }
  return labels;
}
// 15분 간격 라인
function generateRowLines():JSX.Element[] {
  const lines=[];
  for(let m=START_MINUTES+TIME_INTERVAL; m<=END_MINUTES; m+=TIME_INTERVAL){
    const rowIndex=Math.floor((m-START_MINUTES)/TIME_INTERVAL)+2;
    const isHour=(m%60===0);
    lines.push(
      <div key={`line-${m}`} className={isHour?"row-line hour-line":"row-line"}
        style={{gridColumn:"2 / 7", gridRow:rowIndex}} />
    );
  }
  return lines;
}

export default function MainPage(){
  // 디버깅: 실제 grid-column, grid-row 확인
  useEffect(()=>{
    const blocks=document.querySelectorAll(".timetable-class-block");
    blocks.forEach(b=>{
      const style=window.getComputedStyle(b);
      console.log(`Block: ${b.textContent?.slice(0,10)} => Column: ${style.gridColumnStart}, Row: ${style.gridRowStart} / ${style.gridRowEnd}`);
    });
  },[]);

  const hourLabels=generateHourLabels();
  const rowLines=generateRowLines();

  // 수업 블록
  const classBlocks=timetable.flatMap((subj)=>
    subj.times.map((slot, idx)=>{
      const dayIndex=DAYS.indexOf(slot.day);
      if(dayIndex===-1){
        console.warn(`Invalid day: "${slot.day}"`);
        return null;
      }
      const col=dayIndex+2;
      const startRow=getStartRow(slot.startTime);
      const endRow=getEndRow(slot.endTime);
      if(startRow>=endRow){
        console.warn(`Time range error: ${slot.startTime} ~ ${slot.endTime}`);
        return null;
      }
      return(
        <Link href="#" key={`${subj.id}-${idx}`}>
          <div className={`timetable-class-block ${subj.color}`}
            style={{gridColumn:col, gridRow:`${startRow} / ${endRow}`}}>
            <div className="subject">{subj.subject}</div>
            <div>{subj.professor}</div>
            <div>{subj.location}</div>
            <div>{slot.startTime} ~ {slot.endTime}</div>
          </div>
        </Link>
      );
    })
  ).filter(Boolean);

  return(
    <div className="timetable">
      {/* 헤더 => row=1 */}
      <div className="header" style={{gridColumn:1,gridRow:1}}>시간</div>
      {DAYS.map((day,i)=>(
        <div key={day} className="header"
          style={{gridColumn:i+2,gridRow:1}}>
          {day}
        </div>
      ))}
      {rowLines}
      {hourLabels}
      {classBlocks}
    </div>
  );
}
