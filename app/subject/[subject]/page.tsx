import { timetable } from "@/lib/timetableData";

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subjectClasses = timetable.filter(cls => cls.subject === params.subject);

  if (subjectClasses.length === 0) {
    return <div>해당 과목을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{params.subject}</h1>
      {subjectClasses.map(cls => (
        <div key={cls.id} className="border p-4 mt-4">
          <p><strong>요일:</strong> {cls.day}</p>
          <p><strong>시간:</strong> {cls.startTime} ~ {cls.endTime}</p>
          <p><strong>교수:</strong> {cls.professor}</p>
          <p><strong>장소:</strong> {cls.location}</p>
        </div>
      ))}
    </div>
  );
}