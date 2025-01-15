"use client"
import Video from '@/components/VideoPlayer'
import { useDisableControls } from './Context'
import { useParams } from 'next/navigation';

export default function page() {
    const params = useParams();
    const {data,setdata} = useDisableControls();
    setdata(prev=>({
        ...prev,
        id: Number(params.id)
    }));
    console.log({params: params.id})
    return (
        <Video 
            src="https://buisnesstools-course.b-cdn.net/user_2r7lLMtMOfJgVXLJtKHS95nCzlM/sahil2/start/lesson-1.mp4"
            disabled={data.disableControls}
        />
    )
}
