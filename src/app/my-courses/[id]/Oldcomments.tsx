import { createClient } from '@/lib/server/Supabase'
import { Comment } from './Comment';

export default async function Oldcomments({video}:{video:number}) {
    const supabase = await createClient();
    const {data} = await supabase.from("comments").select("*").eq("video",video);
    
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
