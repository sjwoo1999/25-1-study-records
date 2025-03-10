// app/page.tsx
import { timetable } from "@/lib/timetableData";
import Link from "next/link";

const days = ["월", "화", "수", "목", "금"];
const timeSlots = Array.from({ length: 30 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

const getRowIndex = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return (hour - 8) * 2 + (minute === 30 ? 1 : 0) + 2;
};

export default function Timetable() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">주간 시간표</h1>
      <div className="grid grid-cols-[auto_repeat(5,minmax(0,1fr))] grid-rows-[auto_repeat(30,minmax(40px,1fr))] gap-px bg-gray-200 rounded-lg overflow-hidden shadow-lg">
        {/* Corner cell */}
        <div className="row-start-1 col-start-1 bg-gray-50"></div>

        {/* Day headers */}
        {days.map((day, index) => (
          <div
            key={day}
            className={`row-start-1 col-start-${index + 2} bg-gray-50 text-center font-semibold text-gray-700 py-2`}
          >
            {day}요일
          </div>
        ))}

        {/* Time slots */}
        {timeSlots.map((time, index) => (
          <div
            key={time}
            className={`row-start-${index + 2} col-start-1 bg-gray-50 text-right pr-3 text-sm text-gray-600 flex items-center justify-end`}
          >
            {time}
          </div>
        ))}

        {/* Class blocks */}
        {timetable.map((cls) => {
          const startRow = getRowIndex(cls.startTime);
          const endRow = getRowIndex(cls.endTime);
          const dayIndex = days.indexOf(cls.day);

          return (
            <Link
              key={cls.id}
              href={`/study-records/${encodeURIComponent(cls.subject)}`}
              className="group relative p-2 rounded-md shadow-sm hover:shadow-md transition-shadow"
              style={{
                gridRow: `${startRow} / ${endRow}`,
                gridColumn: dayIndex + 2,
                backgroundColor: cls.color,
              }}
            >
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                {cls.subject}
              </h3>
              <p className="text-xs text-gray-700">{cls.professor}</p>
              <p className="text-xs text-gray-600">{cls.location}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}