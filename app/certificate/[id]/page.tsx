import NoCourses from "@/components/NoCourses";
import Content from "./Content";
import { supabaseClient } from "@/lib/server/Supabase";
import { currentUser } from "@clerk/nextjs/server";
import { generateCertificate } from "@/lib/server/generateCertificate";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = supabaseClient();
  const user = await currentUser();

  if (!user) {
    return <NoCourses text="You have not purchased this course" />;
  }

  /** 1️⃣ Check if certificate already exists */
  const { data: existingCertificate } = await supabase
    .from("certificates")
    .select("*")
    .eq("course", Number(id))
    .eq("student", user.id)
    .maybeSingle();

  if (existingCertificate) {
    return (
      <Content
        firstName={user.firstName || ""}
        pdfUrl={existingCertificate.certificate as string}
      />
    );
  }

  /** 2️⃣ Fetch videos */
  const { data: videos } = await supabase
    .from("videos")
    .select("id")
    .eq("course", Number(id));

  /** 3️⃣ Fetch student progress */
  const { data: student } = await supabase
    .from("students")
    .select("watchedVideos")
    .eq("course", Number(id))
    .eq("student", user.id)
    .maybeSingle();

  if (!videos || !student || !student.watchedVideos) {
    return <NoCourses text="You have not completed this course" />;
  }

  console.log(videos.length,student.watchedVideos.length)
  const completed = videos.length === student.watchedVideos.length;

  if (!completed) {
    return <NoCourses text="You have not completed this course" />;
  }

  /** 4️⃣ Generate certificate */
  const pdfUrl = await generateCertificate({
    name: user.firstName || "Student",
    teacher: process.env.TEACHER_NAME || "Instructor",
    courseId: id,
    userId: user.id,
  });

  /** 5️⃣ Save certificate (idempotent) */
  await supabase
    .from("certificates")
    .upsert({
      certificate: pdfUrl,
      student: user.id,
      course: Number(id),
    })

  return <Content firstName={user.firstName || ""} pdfUrl={pdfUrl} />;
}
