"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Home, FolderOpen, MessageSquare, Plus, Bell, Settings,
  Search, Star, ChevronLeft, ChevronRight, Hash, LifeBuoy, MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Link2, Terminal,
  Pointer
} from "lucide-react";
import { useRouter } from "next/navigation";
import "./user.css";

// ─── Sample data ──────────────────────────────────────────────────────────────
const POSTS = [
  {
    id: 1,
    featured: true,
    title: "Automated Nginx + UFW Firewall Config [Ubuntu 24.04]",
    author: "u/SarahCode",
    community: "d/Linux Scripts",
    time: "3h ago",
    tags: ["#linux", "#nginx", "#bash"],
    rating: 4.9,
    votes: 248,
    comments: 34,
    hasCode: true,
    codeLines: [
      { text: "$ bash",                                      color: "#FF6D2D" },
      { text: "#import /u/bain",                             color: "#FF6D6D" },
      { text: "automated Nginx + UFW Firewall Config",       color: "#6EE7B7" },
      { text: "automated Nginx + UFW Firewall",              color: "#6EE7B7" },
    ],
    codeLang: "Bash",
    refs: [
      { label: "'Basic Nginx Setup'", sub: "(u/DevMike)" },
      { label: "'UFW Ruleset'",       sub: "(u/SysAdmin01)" },
    ],
  },
  {
    id: 2,
    featured: false,
    title: "Best way to deploy React 19 on Vercel?",
    author: "u/devjorge",
    community: "d/React Hub",
    time: "1h ago",
    tags: ["#react", "#vercel", "#deploy"],
    rating: null,
    votes: 87,
    comments: 15,
    hasCode: false,
    refs: [],
  },
  {
    id: 3,
    featured: false,
    title: "¿Cómo optimizar queries lentas en PostgreSQL?",
    author: "u/dbmaster",
    community: "d/Databases",
    time: "5h ago",
    tags: ["#postgresql", "#sql", "#performance"],
    rating: null,
    votes: 132,
    comments: 22,
    hasCode: false,
    refs: [],
  },
];

const TRENDING = ["#React19", "#PythonAutomation", "#DockerCompose", "#CI_CD", "#NextJS15"];

const OPEN_REQUESTS = [
  { title: "Script for S3 Backup", community: "d/CloudDev" },
  { title: "Discord Bot",          community: "d/Python" },
  { title: "Script for S3 Backup", community: "d/CloudDev" },
  { title: "Discord Bot",          community: "d/Python" },
];

const NAV_ITEMS = [
  { icon: Home,          label: "Home",        badge: null },
  { icon: FolderOpen,    label: "My Projects", badge: null },
  { icon: MessageSquare, label: "Messages",    badge: 3    },
];

const COMMUNITIES = [
  { icon: "🐧", label: "d/Linux Scripts" },
  { icon: "⚛️", label: "d/React Hub" },
];

// ─── Components ───────────────────────────────────────────────────────────────

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

function Tag({ label }) {
  return <span className="tag">{label}</span>;
}

function PostCard({ post }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  return (
    <div className={`post-card ${post.featured ? "post-card--featured" : ""}`}>
      {/* Featured badge */}
      {post.featured && (
        <div className="post-card__featured-badge">
          <Star size={12} fill="#fff" color="#fff" />
          <span>FEATURED PROJECT</span>
        </div>
      )}

      <div className="post-card__body">
        {/* Vote column */}
        <div className="post-card__votes">
          <LikeButton count={post.votes} />
        </div>

        {/* Content */}
        <div style={{ flex:1, padding:"16px 20px" }}>
          {/* Meta */}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color: C.orange, fontWeight:700, cursor:"pointer" }} onClick={() => router.push(`/community`)}>{post.community}</span>
            <span style={{ color: C.border }}>•</span>
            <span style={{ fontSize:12, color: C.muted }}>Posted by {post.author}</span>
            <span style={{ color: C.border }}>•</span>
            <span style={{ fontSize:12, color: C.muted }}>{post.time}</span>
            <div style={{ marginLeft:"auto" }}>
              <MoreHorizontal size={16} color={C.muted} style={{ cursor:"pointer" }} />
            </div>
          </div>

          {/* Title */}
          <h3 style={{ margin:"0 0 12px", fontSize:16, fontWeight:700, color: C.text, lineHeight:1.4, cursor:"pointer" }}
            onClick={() => router.push(`/post`)}
            onMouseEnter={e => e.target.style.color = C.orange}
            onMouseLeave={e => e.target.style.color = C.text}>
            {post.title}
          </h3>

          {/* Code block */}
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
              {post.codeLines.map((l, i) => (
                <div key={i} className="post-card__code-line" style={{ color: l.color }}>
                  {l.text}
                </div>
              ))}
            </div>
          )}

          {/* References */}
          {post.refs.length > 0 && (
            <div className="post-card__refs">
              <div className="post-card__refs-header">
                <Link2 size={14} color="#FF6D2D" />
                <span className="post-card__refs-title">References</span>
              </div>
              <div className="post-card__refs-list">
                {post.refs.map((r, i) => (
                  <div key={i} className="post-card__ref-item">
                    <Link2 size={13} color="#8B92A9" />
                    <div>
                      <div className="post-card__ref-label">{r.label}</div>
                      <div className="post-card__ref-sub">{r.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags + rating */}
          <div className="post-card__tags">
            {post.tags.map((t) => <Tag key={t} label={t} />)}
            {post.rating && (
              <div className="post-card__rating">
                <Star size={14} fill="#FF6D2D" color="#FF6D2D" />
                <span className="post-card__rating-value">{post.rating}</span>
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="post-card__actions">
            {[
              { icon: MessageCircle, label: `${post.comments} Comments` },
              { icon: Share2,        label: "Share" },
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
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOverlay, setIsOverlay]     = useState(false);
  const [rightOpen, setRightOpen]     = useState(true);
  const [isRightOverlay, setIsRightOverlay] = useState(false);
  const [activeTab, setActiveTab]     = useState("For You");
  const [search, setSearch]           = useState("");
  const router = useRouter();
  const { user } = useUser();

  // Below 1000px: left sidebar goes overlay
  // Below 740px: right sidebar goes overlay too
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;

      if (w < 1000) {
        setSidebarOpen(false);
        setIsOverlay(true);
      } else {
        setIsOverlay(false);
        setSidebarOpen(true);
      }

      if (w < 740) {
        setRightOpen(false);
        setIsRightOverlay(true);
      } else {
        setIsRightOverlay(false);
        setRightOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when any overlay panel is open
  useEffect(() => {
    const anyOverlayOpen = (isOverlay && sidebarOpen) || (isRightOverlay && rightOpen);
    document.body.style.overflow = anyOverlayOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOverlay, sidebarOpen, isRightOverlay, rightOpen]);

  const tabs = ["For You", "Trending Projects", "Community Feed"];

  return (
    <div className="layout">
      {/* Backdrop for overlay mode */}
      {isOverlay && sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : "sidebar--closed"} ${isOverlay ? "sidebar--overlay" : ""}`}>
        <div className="sidebar__inner">
          {/* Logo */}
          <div className="sidebar__logo">
            <img src="/logo.png" alt="OpenHands" />
            <span className="sidebar__logo-text">Open Hands</span>
          </div>

          {/* Profile */}
          <div className="sidebar__profile">
            <img
              src={user?.imageUrl}
              alt="avatar"
              className="sidebar__avatar"
            />
            <span className="sidebar__username">
              {user?.firstName} {user?.lastName}
            </span>
          </div>

          {/* Nav */}
          <nav className="sidebar__nav">
            {NAV_ITEMS.map(({ icon: Icon, label, badge }) => (
              <button
                key={label}
                className={`nav-item ${label === "Home" ? "nav-item--active" : ""}`}
              >
                <Icon size={18} />
                {label}
                {badge && <span className="nav-item__badge">{badge}</span>}
              </button>
            ))}

            <button className="btn-new-project">
              <Plus size={16} />
              New Project
            </button>
          </nav>

          {/* Communities */}
          <div>
            <span className="sidebar__section-label">My Communities</span>
            {COMMUNITIES.map((c) => (
              <button key={c.label} className="community-item">
                <span className="community-item__icon">{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <button className="topbar__toggle" onClick={() => { if (isRightOverlay && rightOpen) setRightOpen(false); setSidebarOpen((v) => !v); }}>
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>

          <h1 className="topbar__title">OpenHands</h1>

          <div className="topbar__actions">
            {[Bell, MessageSquare, Settings].map((Icon, i) => (
              <button key={i} className="topbar__icon-btn">
                <Icon size={16} />
              </button>
            ))}
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Content */}
        <div className="content">
          {/* Feed column */}
          <div className="feed">
            {/* Search */}
            <div className="search-wrapper">
              <Search size={16} color="#8B92A9" className="search-icon" />
              <input
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    router.push(`/search?q=${encodeURIComponent(search.trim())}`);
                  }
                }}
                placeholder="Search scripts, communities, or #tags (#bash, #python)..."
              />
            </div>

            {/* Tabs */}
            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-btn ${activeTab === tab ? "tab-btn--active" : ""}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Posts */}
            {POSTS.map((post) => <PostCard key={post.id} post={post} />)}
          </div>

          {/* Right sidebar toggle — always visible in overlay mode, outside the panel */}
          {isRightOverlay && (
            <button
              className={`right-sidebar__toggle ${rightOpen ? "right-sidebar__toggle--open" : ""}`}
              onClick={() => { if (isOverlay && sidebarOpen) setSidebarOpen(false); setRightOpen((v) => !v); }}
            >
              <ChevronRight size={16} />
            </button>
          )}

          {/* Backdrop */}
          {isRightOverlay && rightOpen && (
            <div className="sidebar-backdrop" onClick={() => setRightOpen(false)} />
          )}

          {/* Right sidebar */}
          <div className={`right-sidebar ${rightOpen ? "right-sidebar--open" : "right-sidebar--closed"} ${isRightOverlay ? "right-sidebar--overlay" : ""}`}>

            {/* Trending */}
            <div className="widget widget--trending">
              <div className="widget__header">
                <TrendingUp size={16} color="#FF6D2D" />
                <span className="widget__title">Trending Topics</span>
              </div>
              <div className="trending-tags">
                {TRENDING.map((t) => (
                  <button key={t} className="trending-tag">{t}</button>
                ))}
              </div>
            </div>

            {/* Open Requests */}
            <div className="widget">
              <div className="widget__header">
                <LifeBuoy size={16} color="#FF6D2D" />
                <span className="widget__title">Open Requests</span>
                <span className="widget__badge">Need Help!</span>
              </div>
              {OPEN_REQUESTS.map((r, i) => (
                <div key={i} className="request-item">
                  <div className="request-item__dot" />
                  <div>
                    <div className="request-item__title">{r.title}</div>
                    <div className="request-item__community">{r.community}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}