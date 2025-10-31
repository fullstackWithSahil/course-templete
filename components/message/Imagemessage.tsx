export default function Imagemessage({content}:{content:string}) {
	return (
		<div className="rounded-xl overflow-hidden relative w-fit">
			<img
				src={content}
				// alt={fileName}
				className="w-3/4 h-auto object-cover transition-all"
			/>
		</div>
	);
}
