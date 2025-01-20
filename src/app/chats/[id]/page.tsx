import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ChatProvider from './Chatcontext'
import NewMessages from './NewMessage'
import Chats from './Chats'

export default function ChatInterface() {
    return (
        <ChatProvider>
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle>Chat Room</CardTitle>
                </CardHeader>
                <CardContent>
                    <Chats/>
                </CardContent>
                <CardFooter>
                    <NewMessages/>
                </CardFooter>
            </Card>
        </ChatProvider>
    )
}