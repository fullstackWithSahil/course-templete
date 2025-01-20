"use client"
import Video from '@/components/VideoPlayer'
import { useDisableControls } from './Context'
import { useEffect } from 'react';
import { useUser,useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { syncUpUser } from '@/actions/syncuser';

export default function VideoPlayer() {
    const {data} = useDisableControls();
    const user = useUser();
    const {userId} = useAuth();
    const courseId = useParams();
    useEffect(() => {
        const syncUser = async () => {
            try {
                console.log("Synced up user:", user.user?.publicMetadata.isSyncedUp);
    
                if (user.user?.publicMetadata.isSyncedUp){
                    return
                };
    
                const course = Number(courseId.id);
                const email = user.user?.emailAddresses?.[0]?.emailAddress;
    
                if (!userId || !course || !email) {
                    console.warn("Missing required data for syncing user:", { userId, course, email });
                    return;
                }
                console.log({userId, course, email});
                const data = await syncUpUser(userId, course, email);
                console.log("User synced up:", data);
            } catch (error) {
                console.error("Error syncing user:", error);
            }
        };
    
        syncUser();
    }, [user, userId, courseId]);

    return (
        <Video 
            src="https://buisnesstools-course.b-cdn.net/user_2r7lLMtMOfJgVXLJtKHS95nCzlM/sahil2/start/lesson-1.mp4"
            disabled={data}
        />
    )
}
