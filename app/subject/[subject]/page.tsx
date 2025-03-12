import { timetable } from "@/lib/timetableData";

export default async function SubjectPage(props: { params: Promise<{ subject: string }> }) {
  const params = await props.params;
  const subject = decodeURIComponent(params.subject); // URL에서 한글 복원
  const subjectClasses = timetable.filter(cls => cls.subject === subject);

  if (subjectClasses.length === 0) {
    return <div className="p-6 text-red-500">해당 과목을 찾을 수 없습니다: {subject}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{subject}</h1>
      {subjectClasses.map(cls => (
        <div key={cls.id} className="border rounded-lg p-4 mb-4 shadow-sm">
          <p><strong>요일:</strong> {cls.times.map(t => t.day).join(", ")}</p>
          <p><strong>시간:</strong> {cls.times.map(t => `${t.startTime} ~ ${t.endTime}`).join(", ")}</p>
          <p><strong>교수:</strong> {cls.professor}</p>
          <p><strong>장소:</strong> {cls.location}</p>
        </div>
      ))}
    </div>
  );
}