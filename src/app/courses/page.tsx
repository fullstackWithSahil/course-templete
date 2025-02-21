import { createClient } from '@/lib/server/supabase';
import CourseCard from "@/components/CourseCard";

export default async function Page() {
  const supabase = await createClient();
  let { data,error } = await supabase
    .from('courses')
    .select('*');
  if (error) {
    return <div>
      <p>The teacher has not created any courses yet</p>
    </div>
  }
  return (
    <div className="p-4 md:p-8">
      {/* Page Header - Matching existing style */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Available Courses
        </h1>
        <p className="text-muted-foreground text-lg text-center">
          Browse our selection of professional courses
        </p>
      </div>

        {data?.map((course) =><CourseCard
          key={course.id}
          logo={course.thumbnail}
          id={course.id}
          title={course.name}
          description={course.description}
          watch={false}
          buttonText="buy"
        />)}

        {/* Empty state */}
        {(!data || data.length === 0) && (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-muted-foreground">No courses available at the moment.</p>
          </div>
        )}
      </div>
  );
}