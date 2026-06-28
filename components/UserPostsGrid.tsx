'use client';

import Image from 'next/image';
import { Eye } from 'lucide-react';
import WntedLogo from '@/components/WntedLogo';
import type { UserPost } from '@/lib/userPosts';

type UserPostsGridProps = {
  posts: UserPost[];
  className?: string;
};

export default function UserPostsGrid({ posts, className = '' }: UserPostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className={`flex flex-col items-center py-12 ${className}`}>
        <div
          className="mb-3 h-px w-full"
          style={{ background: 'rgba(250,247,239,0.1)' }}
          aria-hidden="true"
        />
        <p className="text-center text-[13px] font-medium text-white">
          No posts yet!
        </p>
        <div className="mt-4 opacity-40">
          <WntedLogo size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className="mb-3 h-px w-full"
        style={{ background: 'rgba(250,247,239,0.1)' }}
        aria-hidden="true"
      />
      <div className="grid grid-cols-3 gap-0.5">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative aspect-[3/4] overflow-hidden"
            style={{ background: 'rgba(250,247,239,0.06)' }}
          >
            <Image
              src={post.image}
              alt={post.alt}
              fill
              className="object-cover"
              sizes="130px"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1 px-1.5 py-1.5"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.65) 100%)',
              }}
            >
              <Eye size={11} className="shrink-0 text-white" strokeWidth={2.25} />
              <span className="text-[10px] font-semibold text-white">{post.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
