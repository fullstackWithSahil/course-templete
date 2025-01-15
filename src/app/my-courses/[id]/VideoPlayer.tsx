"use client"
import Video from '@/components/VideoPlayer'
import { useDisableControls } from './Context'

export default function VideoPlayer() {
    const {data} = useDisableControls();
    return (
        <Video 
            src="https://buisnesstools-course.b-cdn.net/user_2r7lLMtMOfJgVXLJtKHS95nCzlM/sahil2/start/lesson-1.mp4"
            disabled={data}
        />
    )
}
