import SendMessage from "./SendMessage";
import Box from "./Box";

export default async function Page() {
	return (
		<section className="col-span-1 md:col-span-1 h-[90vh] grid grid-rows-12 md:grid-rows-10 gap-0.5">
			<Box/>
			<SendMessage />
		</section>
	);
}