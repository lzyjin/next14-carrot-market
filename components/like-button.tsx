"use client";

import {HandThumbUpIcon} from "@heroicons/react/24/solid";
import {HandThumbUpIcon as OutlineHandThumbUpIcon} from "@heroicons/react/24/outline";
import { useOptimistic } from 'react';
import {dislikePost, likePost} from "@/app/posts/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({isLiked, likeCount, postId}: LikeButtonProps) {
  const [state, updateFn] = useOptimistic({isLiked, likeCount}, (previousState, payload) => {
    return {
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked ? previousState.likeCount - 1 : previousState.likeCount + 1,
    };
  });

  const onClick = async () => {
    // 미리 보여줄 값
    updateFn(undefined);

    // 실제 mutation
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm 
        border border-neutral-400 rounded-full p-2
        ${state.isLiked ? "bg-orange-500 text-white border-orange-500" : "hover:bg-neutral-800"}
    `}>
      {
        state.isLiked ?
        <>
          <HandThumbUpIcon className="size-5"/>
          <span>{state.likeCount}</span>
        </> :
        <>
          <OutlineHandThumbUpIcon className="size-5"/>
          <span>공감하기 ({state.likeCount})</span>
        </>
      }
    </button>
  );
}