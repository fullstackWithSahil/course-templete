import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ChatProvider from './Chatcontext'
import NewMessages from './NewMessage'
import Chats from './Chats'

export default function ChatInterface() {;
    return (
        <ChatProvider>
            <Card className="w-[95%] mx-[auto] min-h-[90vh] flex flex-col">
                <CardHeader className="border-b">
                    <CardTitle className="text-xl md:text-2xl">Chat Room</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-0">
                    <Chats/>
                </CardContent>
                <CardFooter className="border-t p-4">
                    <NewMessages/>
                </CardFooter>
            </Card>
        </ChatProvider>
    )
}