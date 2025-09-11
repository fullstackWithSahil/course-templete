import NoCourses from "@/components/NoCourses";
import { supabaseClient } from "@/lib/server/Supabase";
import { currentUser } from "@clerk/nextjs/server";
import Card from "./Card";

export default async function Page() {
  const user = await currentUser();
  if (!user) {
    return <NoCourses text="You haven't purchased any courses" />;
  }

  const supabase = supabaseClient();
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("*")
    .eq("student", user.id)
    .eq("teacher", process.env.NEXT_PUBLIC_TEACHER!);

  if (studentsError) {
    console.error("Error fetching students:", studentsError);
    return <NoCourses text="Something went wrong fetching your courses" />;
  }

  if (!students || students.length === 0) {
    return <NoCourses text="You have not purchased any courses" />;
  }

  const courseIds = students.map((s) => s.course);
  if (courseIds.length === 0) {
    return <NoCourses text="You have not purchased any courses" />;
  }

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .in("id", courseIds as number[]);

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    return <NoCourses text="Something went wrong fetching your courses" />;
  }

  const formattedData = courses?.map((course) => {
    const studentData = students.find(
      (s) => Number(s.course) === course.id
    );
    return {
      ...course,
      watchedVideos: studentData?.watchedVideos ?? [],
    };
  });

  console.log({formattedData})

  return (
    <main className="my-24 px-4">
      {formattedData?.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          name={course.name || ""}
          thumbnail={course.thumbnail || ""}
          watchedVideos={course.watchedVideos}
          description={course.description || ""}
        />
      ))}
    </main>
  );
}
