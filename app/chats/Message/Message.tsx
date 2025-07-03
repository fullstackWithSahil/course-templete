import React from "react";
import { MessageType } from "../[id]/Messageprovider";
import TextMessage from "./TextMessage";
import ImageMessage from "./ImageMessage";
import VideoMessage from "./VideoMessage";
import FileMessage from "./FIleMessage";

export default function Message(props: MessageType) {
	switch (props.type) {
		case "image":
			return <ImageMessage {...props} />;
		case "video":
			return <VideoMessage {...props} />;
		case "file":
			return <FileMessage {...props} />;
		default:
			return <TextMessage {...props} />;
	}
}

export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

export function calculateDate(updatedAt: string, createdAt: string) {
	let date = "";
	if (updatedAt == createdAt) {
		date = new Date(createdAt || updatedAt).toLocaleString();
	} else {
		date = new Date(updatedAt || createdAt).toLocaleString();
	}
	const today = date.split(",")[0];
	const now = new Date(Date.now());
	const formated = `${now.getMonth() + 1}/${
		now.getDay() - 1
	}/${now.getFullYear()}`;
	if (today == formated) {
		return date.split(",")[1];
	} else {
		return date.split(",")[0];
	}
}

export async function handleDownload(content:string){
	try {
		const res = await fetch(content);
		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = content.split("/").pop()?.split("?")[0] || "image.jpg";
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.log(error);
	}
};
