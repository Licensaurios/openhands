"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageCircle, Share2, Bookmark, Link2, MoreHorizontal } from "lucide-react";
import "../user/[[...rest]]/user.css";

const C = {
  orange: "#FF6D2D",
  orangeLight: "#FF8F5C",
  orangeDim: "#FFF0E9",
  gray: "#545454",
  white: "#FFFFFF",
  offWhite: "#F7F8FC",
  border: "#E8EBF4",
  muted: "#8B92A9",
  text: "#2D3452",
  code: "#0F1624",
  red: "#FF4D6D",
  redDim: "#FFF0F3",
  green: "#10B981",
};

function Tag({ label }) {
  return <span className="tag">{label}</span>;
}

function LikeButton({ count }) {
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <button
        onClick={() => setLiked((v) => !v)}
        className={`like-btn ${liked ? "like-btn--liked" : "like-btn--unliked"}`}
      >
        {liked ? "❤️" : "🤍"}
      </button>
      <span className={`like-count ${liked ? "like-count--liked" : "like-count--unliked"}`}>
        {count + (liked ? 1 : 0)}
      </span>
    </div>
  );
}


export function PostCard({ post }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  // console.log(post.title, post.codeLines)
  // console.log(post)
  return (
    <div className={`post-card ${post.featured ? "post-card--featured" : ""}`}>
      {post.featured && (
        <div className="post-card__featured-badge">
          <Star size={12} fill="#fff" color="#fff" />
          <span>FEATURED PROJECT</span>
        </div>
      )}

      <div className="post-card__body">
        <div className="post-card__votes">
          <LikeButton count={post.votes} />
        </div>

        <div className="post-card__content">
          <div className="post-card__meta">
            <span className="post-card__community" onClick={() => router.push(`/community`)}>{post.community}</span>
            <span className="post-card__dot">•</span>
            <span className="post-card__author">Posted by {post.author}</span>
            <span className="post-card__dot">•</span>
            <span className="post-card__time">{post.time}</span>
            <div className="post-card__more">
              <MoreHorizontal size={16} color={C.muted} />
            </div>
          </div>

          <h3 className="post-card__title" onClick={() => router.push(`/post/${post.id}`)}>
            {post.title}
          </h3>

          {post.hasCode && (
            <div className="post-card__code">
              <div className="post-card__code-header">
                <div className="post-card__code-dots">
                  {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                    <div key={c} className="post-card__code-dot" style={{ background: c }} />
                  ))}
                </div>
                <span className="post-card__code-lang">{post.codeLang}</span>
              </div>
              <div className="post-card__code-wrapper">
                {post.codeLines.map((line, i) => (
                  <div key={i} className="post-card__code-line" style={{ color: "#ffff" }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.refs?.length > 0 && (
            <div className="post-card__refs">
              <div className="post-card__refs-header">
                <Link2 size={14} color="#FF6D2D" />
                <span className="post-card__refs-title">References</span>
              </div>
              <div className="post-card__refs-list">
                {post.refs.map((ref, i) => (
                  <div key={i} className="post-card__ref-item">
                    <Link2 size={13} color="#8B92A9" />
                    <div>
                      <a
                        className="post-card__ref-label"
                        href={ref.link}
                        target="_blank"
                        rel="noopener noreferrer">
                        {ref.label}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="post-card__tags">
            {post.tags?.map((t) => <Tag key={t} label={t} />)}
            {post.rating && (
              <div className="post-card__rating">
                <Star size={14} fill="#FF6D2D" color="#FF6D2D" />
                <span className="post-card__rating-value">{post.rating}</span>
              </div>
            )}
          </div>

          <div className="post-card__actions">
            {[
              { icon: MessageCircle, label: `${post.comments ?? 0} Comments` },
              { icon: Share2, label: "Share" },
            ].map(({ icon: Icon, label }) => (
              <button key={label} className="action-btn">
                <Icon size={14} />
                {label}
              </button>
            ))}
            <button
              onClick={() => setSaved((v) => !v)}
              className={`action-btn action-btn--save ${saved ? "action-btn--saved" : ""}`}
            >
              <Bookmark size={14} fill={saved ? "#FF6D2D" : "none"} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}