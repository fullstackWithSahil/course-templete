"use client";
import supabaseClient from "@/lib/Supabase";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Card({
  logo,
  id,
  title,
  description,
  watch,
}: {
  logo: any;
  id: number;
  title: string;
  description: string;
  watch: boolean;
}) {
  const router = useRouter();
  const { userId, getToken } = useAuth();
  async function handelClick() {
    if (watch) {
        if (!userId) return;
        const token = getToken();
        const supabase = supabaseClient(token);
        //checking if student exists
        const { data } = await(await supabase)
            .from("Students")
            .select("*")
            .eq("teacher", process.env.NEXT_PUBLIC_TEACHER!)
            .eq("student", userId);
        if (!data) return;
        //creating a student
        await(await supabase).from("Students").insert({
            student: userId,
            teacher: process.env.NEXT_PUBLIC_TEACHER,
            course: id,
        });
        router.push(`/my-courses/${id}`);
        return;
    }
    //handle logic to buy the course
  }
  return (
    <div className="max-w-5xl mx-auto border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg my-3">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Logo Section */}
        <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 p-4">
          <Image src={logo} alt="logo" className="w-full object-contain" />
        </div>

        {/* Content Section */}
        <div className="col-span-2 flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-center">
            {title}
          </h1>
          <p className="text-sm md:text-base text-center leading-relaxed">
            {description}
          </p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg"
            onClick={handelClick}
          >
            {watch ? "watch" : "buy now"}
          </button>
        </div>
      </div>
    </div>
  );
}
