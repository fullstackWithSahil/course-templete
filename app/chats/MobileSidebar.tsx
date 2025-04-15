import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import React from "react";

type courseType =
	| {
			created_at: string;
			description: string | null;
			id: number;
			name: string | null;
			price: number | null;
			teacher: string | null;
			thumbnail: string | null;
	  }[]
	| null;

export default function MobileSidebar({ courses }: { courses: courseType }) {
	return (
		<Sheet>
			<SheetTrigger>
				<h1 className="sm:hidden mt-4 text-lg font-medium">Chats</h1>
			</SheetTrigger>
			<SheetContent>
				{courses?.map((course) => (
					<Link
						href={`/chats/${course.id}`}
						key={course.id}
						className={buttonVariants() + " w-3/4"}
					>
						{course.name}
					</Link>
				))}
				<Link
					href={"/chats/teacher"}
					className={buttonVariants() + " w-3/4"}
				>
					Teacher
				</Link>
			</SheetContent>
		</Sheet>
	);
}
