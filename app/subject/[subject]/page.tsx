// app/subject/[subject]/page.tsx
import { timetable } from "@/lib/timetableData";

export default async function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = decodeURIComponent(params.subject);
  const subjectClasses = timetable.filter(cls => cls.subject === subject);

  if (subjectClasses.length === 0) {
    return <div style={{ color: "red", padding: "2rem" }}>해당 과목을 찾을 수 없습니다: {subject}</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        {subject}
      </h1>
      {subjectClasses.map(cls => (
        <div key={cls.id} style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <p><strong>요일:</strong> {cls.times.map(t => t.day).join(", ")}</p>
          <p><strong>시간:</strong> {cls.times.map(t => `${t.startTime}~${t.endTime}`).join(", ")}</p>
          <p><strong>교수:</strong> {cls.professor}</p>
          <p><strong>장소:</strong> {cls.location}</p>
        </div>
      ))}
    </div>
  );
}
