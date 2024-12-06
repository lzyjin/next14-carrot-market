import {notFound} from "next/navigation";
import db from "@/lib/db";
import Image from "next/image";
import {formatToTimeAgo} from "@/lib/utils";
import {EyeIcon} from "@heroicons/react/16/solid";
import getSession from "@/lib/session";
import {unstable_cache as nextCache} from "next/cache";
import LikeButton from "@/components/like-button";

async function getPost(id: number) {
  // update함수는 수정하고 나서, 수정된 데이터를 반환함
  // 업데이트할 post를 찾지 못하면 에러를 발생시킴
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;

  } catch (e) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      }
    }
  });

  const likeCount = await db.like.count({
    where: {
      postId,
    }
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

function getCachedLikeStatus(postId: number, numberId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["post-like-status"], {
    tags: [`like-status-${postId}`],
  });

  return cachedOperation(postId, numberId);
}

export default async function PostDetail({params}: {params: {id: string}}) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);

  if (!post) {
    return notFound();
  }

  const session = await getSession();
  const userId = session.id!;

  const {likeCount, isLiked} = await getCachedLikeStatus(id, userId);

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          src={post.user.avatar!}
          alt={post.user.username}
          width={28}
          height={28}
          className="size-7 rounded-full" />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton  isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
    </div>
  );
}
