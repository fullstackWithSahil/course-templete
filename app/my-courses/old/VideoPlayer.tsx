// "use client"
// import Video from '@/components/VideoPlayer'
// import { useDisableControls } from './Context'

// export default function VideoPlayer() {
//     const {data} = useDisableControls();
//     return (
//         <>
//         <Video 
//             src={data.currentVideo.url}
//             disabled={data.disabled}
//         />
//         <div className="flex items-center justify-between my-2">
//             <h1 className="text-xl mx-2">{data.currentVideo.title}</h1>
//             <h1 className="text-xl mx-2">{data.currentVideo.createdAt}</h1>
//         </div>
//         </>
//     )
// }