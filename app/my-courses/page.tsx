import NoCourses from "@/components/NoCourses";
import { supabaseClient } from "@/lib/server/Supabase";
import { currentUser } from "@clerk/nextjs/server";
import Card from "./Coursecart";

export default async function Page() {
  const user = await currentUser();
  if (!user) {
    return (
      <main className="my-24 px-4">
        <NoCourses text="You have not purchased any courses" />
      </main>
    );
  }

  const supabase = supabaseClient();

  const { data: students, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("student", user.id)
    .eq("teacher", process.env.NEXT_PUBLIC_TEACHER!);

  if (studentError) {
    console.error(studentError);
    return <main className="my-24 px-4">Something went wrong</main>;
  }

  if (!students || students.length === 0) {
    return (
      <main className="my-24 px-4">
        <NoCourses text="You have not purchased any courses" />
      </main>
    );
  }

  const courseIds = students.map((s) => s.course);
  if (courseIds.length === 0) {
    return (
      <main className="my-24 px-4">
        <NoCourses text="You have not purchased any courses" />
      </main>
    );
  }

  const { data: courses, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .in("id", courseIds as number[]);

  if (courseError) {
    console.error(courseError);
    return <main className="my-24 px-4">Something went wrong</main>;
  }

  const formattedData = courses?.map((course) => {
    const studentData = students.find((s) => s.course === course.id);
    return {
      ...course,
      watchedVideos: studentData?.watchedVideos ?? [],
    };
  });

  return (
    <main className="my-24 px-4">
      {formattedData?.map((course) => (
        <Card
          key={course.id}
          title={course.name || ""}
          description={course.description || ""}
          logo={course.thumbnail || ""}
          id={course.id}
          watchedVideos={course.watchedVideos}
        />
      ))}
    </main>
  );
}
