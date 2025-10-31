"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { File, ImageIcon, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";


const Icons = [
	{ type: "image", icon: ImageIcon },
	{ type: "file", icon: File },
] as const;
export default function FileUploder() {
    const [type, setType] = useState<"image" | "file">("image");
	const [open, setOpen] = useState(false);
	const [uploading, setUploading] = useState(false);
    
    const {user} = useUser();
    const fileRef = useRef<HTMLInputElement>(null);
    const {chat} = useParams();
	const {getToken} = useAuth();

    async function handleUpload(file: File) {
		if (!file || !user?.id) return;

		try {
			setUploading(true);
            const formdata = new FormData();
            formdata.append("file", file); // Add the actual file
			const token = await getToken();
            const {data}=await axios.post("https://chat.fullstackwithsahil.workers.dev/file",formdata,{
				headers: { Authorization: `Bearer ${token}` },
			})
            
            const {data:message} =await axios.post("https://chat.fullstackwithsahil.workers.dev/message",{
                message:data.data,
                type,
                sender:user.id,
                chatId:chat,
                profile:user.imageUrl,
                name:user.firstName
            },{
				headers: { Authorization: `Bearer ${token}` },
			})
            console.log({message});
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
                    <DialogTitle className="text-lg font-semibold capitalize mb-4">
						Upload a {type}
                    </DialogTitle>
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
