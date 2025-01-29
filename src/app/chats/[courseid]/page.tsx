import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ChatProvider from './Chatcontext'
import NewMessages from "@/components/chats/Newmessage";
import Chats from './Chats'

interface PageProps {
    params: Promise<{ courseid: string }>
}
  
export default async function Page({params}:PageProps){
    const param = await params;
    const id = Number(param.courseid);
    return (
        <ChatProvider>
            <Card className="w-[95%] mx-[auto] min-h-[90vh] flex flex-col">
                <CardHeader className="border-b">
                    <CardTitle className="text-xl md:text-2xl">Chat Room</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-0">
                    <Chats courseId={id}/>
                </CardContent>
                <CardFooter className="border-t p-4">
                    <NewMessages group={true} id={id}/>
                </CardFooter>
            </Card>
        </ChatProvider>
    )
}