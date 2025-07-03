"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import API from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { File, ImageIcon, Plus, VideoIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

const Icons = [
	{ type: "image", icon: ImageIcon },
	{ type: "video", icon: VideoIcon },
	{ type: "file", icon: File },
] as const;

export default function FileUploader() {
	const [type, setType] = useState<"image" | "file" | "video">("image");
	const [open, setOpen] = useState(false);
	const [uploading, setUploading] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const { id } = useParams();
	const { user } = useUser();

	async function handleUpload(file: File) {
		if (!file || !user?.id) return;

		try {
			setUploading(true);
			console.log({
				fileName: file.name,
				fileType: file.type,
			});
			// Step 1: Get presigned URL from your backend
			const {data} = await axios.post("/api/uplode", {
				fileName: file.name,
				fileType: file.type,
			});

			const { uploadUrl, fileUrl } = data;

			// Step 2: Upload the file to S3
			const response =await fetch(uploadUrl, {
				method: "PUT",
				headers: {
					"Content-Type": file.type,
				},
				body: file,
			});
			console.log({response})

			// Step 3: Notify backend that upload completed
			const res = await API.post("/messages/upload/file", {
				chat: id,
				sender: user.id,
				content: fileUrl,
				profile:user.imageUrl,
				type,
			});
			console.log(res);

			toast.success("File uploaded!");
			setOpen(false);
		} catch (err) {
			console.error(err);
			toast.error("Upload failed");
		} finally {
			setUploading(false);
		}
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="col-span-1">
						<Plus />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="p-4 rounded-xl shadow-lg flex flex-col gap-4"
					side="top"
					align="start"
				>
					{Icons.map((icon) => (
						<button
							key={icon.type}
							className="p-2 flex items-center gap-2 rounded-lg capitalize text-lg font-medium hover:bg-muted"
							onClick={() => {
								setType(icon.type);
								setOpen(true);
							}}
						>
							<icon.icon className="w-5 h-5" />
							{icon.type}
						</button>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-center">
					<h2 className="text-lg font-semibold capitalize mb-4">
						Upload a {type}
					</h2>

					<div
						className="border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-muted transition"
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							e.preventDefault();
							const file = e.dataTransfer.files[0];
							if (file) handleUpload(file);
						}}
						onClick={() => fileRef.current?.click()}
					>
						<p className="text-muted-foreground">
							Drag and drop or click to select
						</p>
						<input
							type="file"
							ref={fileRef}
							className="hidden"
							accept={
								type === "image"
									? "image/*"
									: type === "video"
									? "video/*"
									: "*"
							}
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) handleUpload(file);
							}}
						/>
					</div>

					{uploading && <p className="text-sm mt-4">Uploading...</p>}
				</DialogContent>
			</Dialog>
		</>
	);
}
