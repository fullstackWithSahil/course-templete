"use client";
import supabaseClient from "@/lib/Supabase";
import { useAuth, useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import buyCourse from "@/actions/buyCourse";

export default function Card({
  logo,
  id,
  title,
  description,
  watch,
  buttonText
}: {
  logo: any;
  id: number;
  title: string;
  description: string;
  watch: boolean;
  buttonText?: string;
}) {
  const router = useRouter();
  const { userId } = useAuth();
  const {session} = useSession();
  const user = useUser();

  if(!userId){
    return <div>
      <p>you are not allowed to see this page</p>
    </div>
  }
  async function handelClick() {
    if (watch) {
        if (!userId) return;
        const supabase = supabaseClient(session);

        //checking if student exists
        const { data,error } = await supabase
            .from("students")
            .select("*")
            .eq("student", userId)
            .eq("course",id);
        
        if(error){
          console.log(error);
        }
        
        if (!data || data.length == 0){
          //creating a student
          await supabase.from("students").insert({
            student: userId,
            teacher: process.env.NEXT_PUBLIC_TEACHER,
            course: id,
            email: user.user?.primaryEmailAddress?.emailAddress
          });
        };
        
        router.push(`/my-courses/${id}`);
    }else{
      if(buttonText==="see Chats"){
        router.push(`/chats/${id}`);
        return;
      }
      // handle logic to buy the course
      const data = await buyCourse(userId!,id);
      if(!data.success){
        toast(data.message);
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg my-3">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Logo Section */}
        <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 p-4">
          <img src={logo} alt="logo" className="w-full object-contain" />
        </div>

        {/* Content Section */}
        <div className="col-span-2 flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-center">
            {title}
          </h1>
          <p className="text-sm md:text-base text-center leading-relaxed">
            {description}
          </p>
          {watch&&<Progress value={33} />}
          <div className="flex items-center justify-center gap-6">
            <Button
              onClick={handelClick}
            >
              {watch ? "watch" :buttonText?buttonText:"buy now"}
            </Button>
            {!watch&&<Button>Read More</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
