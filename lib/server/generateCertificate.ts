import { uploadToR2 } from "./uploadToR2";

export async function generateCertificate({
	name,
	teacher,
	courseId,
	userId,
}: {
	name: string;
	teacher: string;
	courseId: string;
	userId: string;
}): Promise<string> {
	const ACCOUNT_ID = "30fefad58c864d1183376382f4a57de2";
	const API_TOKEN = "BVYI-4Jk980nyK6JkuM34s0PN1z5OoGU7awp82JO";

	if (!ACCOUNT_ID || !API_TOKEN) {
		throw new Error("Cloudflare credentials missing");
	}

	const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
@page { size: A4 landscape; margin: 0; }
body {
  width: 297mm;
  height: 210mm;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Georgia, serif;
  background: linear-gradient(135deg, #667eea, #764ba2);
}
.certificate {
  background: white;
  width: 90%;
  height: 85%;
  padding: 40px;
  text-align: center;
}
h1 { color: #667eea; font-size: 48px; }
.name { font-size: 36px; font-weight: bold; margin: 30px 0; }
</style>
</head>
<body>
  <div class="certificate">
    <h1>CERTIFICATE OF COMPLETION</h1>
    <p>This certifies that</p>
    <div class="name">${name}</div>
    <p>has successfully completed the course</p>
    <p style="margin-top:40px">${teacher}</p>
    <p>${new Date().toDateString()}</p>
  </div>
</body>
</html>
`;

	const response = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/browser-rendering/pdf`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer BVYI-4Jk980nyK6JkuM34s0PN1z5OoGU7awp82JO`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				html,
			}),
		}
	);
	console.log({ response });

	if (!response.ok) {
		const text = await response.text();
		console.error("Cloudflare PDF error:", response.status, text);
		throw new Error(`Cloudflare PDF failed: ${response.status}`);
	}

	const pdfBuffer = await response.arrayBuffer();

	const filename = `${process.env.NEXT_PUBLUC_TEACHER}/certificates/${courseId}/${userId}.pdf`;
	return uploadToR2(pdfBuffer, filename);
}
