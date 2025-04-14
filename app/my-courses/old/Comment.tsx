// "use client"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ThumbsDown, ThumbsUp } from "lucide-react";
// import { useState } from "react";


// export function Comment({
//     imageUrl,
//     comment,
//     likes,
//   }: {
//     imageUrl?: string;
//     comment: string;
//     likes: number;
//   }) {
//     const [liked, setLiked] = useState(false);
//     const [disLiked, setDisLiked] = useState(false);
//     const [noOfLikes, setNoOfLikes] = useState(likes);
//     function handleLiked() {
//       setLiked(true);
//       setDisLiked(false);
//       setNoOfLikes((prev) => prev + 1);
//     }
//     function handleDisLiked() {
//       setDisLiked(true);
//       setLiked(false);
//       setNoOfLikes((prev) => prev - 1);
//     }
//     return (
//       <div className="flex items-center border-2 m-2 px-2 py-1 rounded-md dark:border-white">
//         <Avatar>
//           <AvatarImage src={imageUrl} />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//         <div>
//           <p>{comment}</p>
//           <div className="flex items-center gap-1">
//             <ThumbsUp
//               fill={liked ? "rgb(96 165 350)" : ""}
//               onClick={handleLiked}
//             />
//             {noOfLikes}
//             <ThumbsDown
//               fill={disLiked ? "rgb(96 165 350)" : ""}
//               onClick={handleDisLiked}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }