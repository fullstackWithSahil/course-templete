"usec lient"
import supabaseClient  from '@/lib/Supabase';
import { Comment } from './Comment';
import { useSession } from '@clerk/nextjs';
import { useEffect, useState } from 'react';


export default function Oldcomments({video}:{video:number}) {
    const {session} =  useSession();
    const supabase = supabaseClient(session);
    const [data,setData] = useState<any>([]);// eslint-disable-line @typescript-eslint/no-explicit-any

    useEffect(()=>{
      supabase.from("comments").select("*").eq("video",video).then(({data,error})=>{
        if(error){
          console.error("Error fetching comments:",error);
        }else{
          setData(data);
        }
      });
    },[])
    
  return (
    <div>
        {data?.map(comment=><Comment
            key={comment.id}
            comment={comment.comment||""}
            likes={comment.likes||0}
            imageUrl={comment.profile||""}
        />)}
    </div>
  )
}
