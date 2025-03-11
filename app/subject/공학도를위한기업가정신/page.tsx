"use client";
import { useRouter } from "next/navigation";
import { timetable } from "@/lib/timetableData";

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const router = useRouter();
  const decodedSubject = decodeURIComponent(params.subject);
  const subjectData = timetable.find((cls) => cls.subject === decodedSubject);

  if (!subjectData) {
    return <div>해당 과목을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{decodedSubject}</h1>
      <p className="mb-2"><strong>교수:</strong> {subjectData.professor}</p>
      <p className="mb-2"><strong>장소:</strong> {subjectData.location}</p>
      <p className="mb-2"><strong>요일:</strong> {subjectData.day}</p>
      <p className="mb-4"><strong>시간:</strong> {subjectData.startTime} ~ {subjectData.endTime}</p>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        시간표로 돌아가기
      </button>
    </div>
  );
}