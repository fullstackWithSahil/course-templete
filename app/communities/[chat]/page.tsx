import SendMessage from "./SendMessage";
import Box from "./Box";

export default async function Page() {
	return (
		<section className="col-span-1 md:col-span-1 h-screen grid grid-rows-10 gap-0.5">
			<Box />
			<SendMessage />
		</section>
	);
}
