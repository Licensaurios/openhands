"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  Home, FolderOpen, MessageSquare, Plus, Bell, Settings,
  Search, Star, ChevronLeft, ChevronRight, Hash, LifeBuoy,
  ArrowUp, ArrowDown, MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Link2, Terminal
} from "lucide-react";

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  orange:     "#FF6D2D",
  orangeLight:"#FF8F5C",
  orangeDim:  "#FFF0E9",
  dark:       "#545454",
  darkCard:   "#222840",
  navy:       "#1E2540",
  white:      "#FFFFFF",
  offWhite:   "#F7F8FC",
  border:     "#E8EBF4",
  muted:      "#8B92A9",
  text:       "#2D3452",
  code:       "#0F1624",
};

// ─── Sample data ─────────────────────────────────────────────────────────────
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
      { text: "$ bash",           color: C.orange },
      { text: "#import /u/bain",  color: "#FF6D6D" },
      { text: "automated Nginx + UFW Firewall Config", color: "#6EE7B7" },
      { text: "automated Nginx + UFW Firewall",        color: "#6EE7B7" },
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
  { icon: Home,         label: "Home",        badge: null },
  { icon: FolderOpen,   label: "My Projects", badge: null },
  { icon: MessageSquare,label: "Messages",    badge: 3    },
];

const COMMUNITIES = [
  { icon: "🐧", label: "d/Linux Scripts" },
  { icon: "⚛️", label: "d/React Hub" },
];

// ─── Components ──────────────────────────────────────────────────────────────

function VoteButton({ count }) {
  const [vote, setVote] = useState(0);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
      <button onClick={() => setVote(v => v === 1 ? 0 : 1)}
        style={{ background:"none", border:"none", cursor:"pointer", padding:3,
          color: vote === 1 ? C.orange : C.muted,
          transition:"color .15s, transform .15s",
          transform: vote === 1 ? "scale(1.2)" : "scale(1)" }}>
        <ArrowUp size={15} strokeWidth={2.5} />
      </button>
      <span style={{ fontSize:12, fontWeight:700, color: vote !== 0 ? C.orange : C.text }}>
        {count + vote}
      </span>
      <button onClick={() => setVote(v => v === -1 ? 0 : -1)}
        style={{ background:"none", border:"none", cursor:"pointer", padding:3,
          color: vote === -1 ? "#FF6D6D" : C.muted,
          transition:"color .15s, transform .15s",
          transform: vote === -1 ? "scale(1.2)" : "scale(1)" }}>
        <ArrowDown size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function Tag({ label }) {
  return (
    <span style={{
      padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600,
      background: C.orangeDim, color: C.orange, letterSpacing:.3,
    }}>{label}</span>
  );
}

function PostCard({ post }) {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{
      background: C.white,
      borderRadius: 16,
      border: `1.5px solid ${post.featured ? C.orange : C.border}`,
      overflow: "hidden",
      boxShadow: post.featured
        ? `0 4px 24px rgba(255,109,45,.12)`
        : `0 1px 6px rgba(0,0,0,.05)`,
      marginBottom: 16,
      transition: "box-shadow .2s, transform .2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,109,45,.15)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = post.featured ? "0 4px 24px rgba(255,109,45,.12)" : "0 1px 6px rgba(0,0,0,.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Featured badge */}
      {post.featured && (
        <div style={{
          background: `linear-gradient(90deg, ${C.orange}, ${C.orangeLight})`,
          padding:"6px 18px", display:"flex", alignItems:"center", gap:6,
        }}>
          <Star size={12} fill="#fff" color="#fff" />
          <span style={{ color:"#fff", fontSize:11, fontWeight:700, letterSpacing:.8 }}>
            FEATURED PROJECT
          </span>
        </div>
      )}

      <div style={{ display:"flex", gap:0 }}>
        {/* Vote column */}
        <div style={{
          padding:"16px 12px", display:"flex", flexDirection:"column",
          alignItems:"center", background: C.offWhite,
          borderRight:`1px solid ${C.border}`, minWidth:52,
        }}>
          <VoteButton count={post.votes} />
        </div>

        {/* Content */}
        <div style={{ flex:1, padding:"16px 20px" }}>
          {/* Meta */}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color: C.orange, fontWeight:700 }}>{post.community}</span>
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
            onMouseEnter={e => e.target.style.color = C.orange}
            onMouseLeave={e => e.target.style.color = C.text}>
            {post.title}
          </h3>

          {/* Code block */}
          {post.hasCode && (
            <div style={{
              background: C.code, borderRadius:10, padding:"14px 16px",
              marginBottom:14, border:`1px solid rgba(255,109,45,.2)`,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ display:"flex", gap:6 }}>
                  {["#FF5F57","#FFBD2E","#28C840"].map(c => (
                    <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }} />
                  ))}
                </div>
                <span style={{
                  background: C.orange, color:"#fff", fontSize:10, fontWeight:700,
                  padding:"2px 10px", borderRadius:99, letterSpacing:.5,
                }}>
                  {post.codeLang}
                </span>
              </div>
              {post.codeLines.map((l, i) => (
                <div key={i} style={{ fontFamily:"'JetBrains Mono', 'Fira Code', monospace", fontSize:12, color:l.color, lineHeight:1.8 }}>
                  {l.text}
                </div>
              ))}
            </div>
          )}

          {/* Refs */}
          {post.refs.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                <Link2 size={14} color={C.orange} />
                <span style={{ fontSize:13, fontWeight:700, color: C.text }}>References</span>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {post.refs.map((r, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:8,
                    background: C.offWhite, border:`1px solid ${C.border}`,
                    borderRadius:10, padding:"8px 14px", cursor:"pointer", flex:1, minWidth:160,
                  }}>
                    <Link2 size={13} color={C.muted} />
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color: C.text }}>{r.label}</div>
                      <div style={{ fontSize:11, color: C.muted }}>{r.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags + rating */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:12 }}>
            {post.tags.map(t => <Tag key={t} label={t} />)}
            {post.rating && (
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4 }}>
                <Star size={14} fill={C.orange} color={C.orange} />
                <span style={{ fontSize:13, fontWeight:700, color: C.text }}>{post.rating}</span>
              </div>
            )}
          </div>

          {/* Action bar */}
          <div style={{ display:"flex", alignItems:"center", gap:4, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
            {[
              { icon: MessageCircle, label:`${post.comments} Comments` },
              { icon: Share2,        label:"Share" },
            ].map(({ icon: Icon, label }) => (
              <button key={label} style={{
                display:"flex", alignItems:"center", gap:6,
                background:"none", border:"none", cursor:"pointer",
                padding:"6px 10px", borderRadius:8,
                fontSize:12, fontWeight:600, color: C.muted,
                transition:"background .15s, color .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.orangeDim; e.currentTarget.style.color = C.orange; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.muted; }}>
                <Icon size={14} />
                {label}
              </button>
            ))}
            <button onClick={() => setSaved(v => !v)} style={{
              marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
              background:"none", border:"none", cursor:"pointer",
              padding:"6px 10px", borderRadius:8,
              fontSize:12, fontWeight:600, color: saved ? C.orange : C.muted,
              transition:"background .15s, color .15s",
            }}>
              <Bookmark size={14} fill={saved ? C.orange : "none"} />
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
  const [activeTab, setActiveTab] = useState("For You");
  const [search, setSearch] = useState("");

  const tabs = ["For You", "Trending Projects", "Community Feed"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; background: ${C.offWhite}; }
        button { font-family: 'Sora', sans-serif; }
        input  { font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        input:focus { outline: none; }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background: C.offWhite }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: sidebarOpen ? 280 : 0,
          minWidth: sidebarOpen ? 280 : 0,
          overflow: "hidden",
          background: C.dark,
          display:"flex", flexDirection:"column",
          transition:"width .25s ease, min-width .25s ease",
          position:"relative",
        }}>
          <div style={{ padding:"24px 20px 16px", minWidth:280 }}>
            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
              <img src="/logo.png" alt="OpenHands" style={{ width:64, height:64 }} />
              <span style={{ fontWeight:800, fontSize:18, color: C.orange, letterSpacing:-.3 }}>
                Open Hands
              </span>
            </div>

            {/* Profile */}
            <div style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              padding:"20px 0 24px",
              borderBottom:`1px solid rgba(255,255,255,.08)`,
              marginBottom:20,
            }}>
              <div style={{
                width:72, height:72, borderRadius:"50%",
                background:`linear-gradient(135deg, ${C.orange}, ${C.orangeLight})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28, marginBottom:10,
                boxShadow:`0 0 0 3px ${C.dark}, 0 0 0 5px ${C.orange}`,
              }}>👤</div>
              <span style={{ fontWeight:700, fontSize:15, color: C.white }}>Alex R.</span>
              <span style={{ fontSize:12, color: C.muted, marginTop:2 }}>
                Contribution Score: <span style={{ color: C.orange, fontWeight:600 }}>1,250 XP</span>
              </span>
            </div>

            {/* Nav */}
            <nav style={{ marginBottom:24 }}>
              {NAV_ITEMS.map(({ icon: Icon, label, badge }) => (
                <button key={label} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:12,
                  padding:"11px 14px", borderRadius:10, border:"none",
                  background: label === "Home" ? `rgba(255,109,45,.15)` : "none",
                  color: label === "Home" ? C.orange : "rgba(255,255,255,.7)",
                  cursor:"pointer", fontSize:14, fontWeight:600,
                  marginBottom:2, transition:"background .15s, color .15s",
                  position:"relative",
                }}
                onMouseEnter={e => { if (label !== "Home") { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.color = C.white; }}}
                onMouseLeave={e => { if (label !== "Home") { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,.7)"; }}}>
                  <Icon size={18} />
                  {label}
                  {badge && (
                    <span style={{
                      marginLeft:"auto", background: C.orange, color:"#fff",
                      fontSize:10, fontWeight:800, width:18, height:18,
                      borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                    }}>{badge}</span>
                  )}
                </button>
              ))}

              {/* New Project */}
              <button style={{
                width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                padding:"11px 14px", borderRadius:10, marginTop:8,
                border:`1.5px solid rgba(255,109,45,.4)`,
                background:"none", color: C.orange,
                cursor:"pointer", fontSize:14, fontWeight:700,
                transition:"background .15s, border-color .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `rgba(255,109,45,.1)`; e.currentTarget.style.borderColor = C.orange; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = `rgba(255,109,45,.4)`; }}>
                <Plus size={16} />
                New Project
              </button>
            </nav>

            {/* Communities */}
            <div>
              <span style={{ fontSize:11, fontWeight:700, color: C.muted, letterSpacing:1, textTransform:"uppercase", padding:"0 14px", display:"block", marginBottom:10 }}>
                My Communities
              </span>
              {COMMUNITIES.map(c => (
                <button key={c.label} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:10,
                  padding:"10px 14px", borderRadius:10, border:"none",
                  background:"none", color:"rgba(255,255,255,.7)",
                  cursor:"pointer", fontSize:13, fontWeight:500,
                  transition:"background .15s, color .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.color = C.white; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,.7)"; }}>
                  <span style={{ fontSize:20 }}>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

          {/* Topbar */}
          <header style={{
            background: C.white,
            borderBottom:`1px solid ${C.border}`,
            padding:"0 28px",
            height:60,
            display:"flex", alignItems:"center", gap:16,
            position:"sticky", top:0, zIndex:50,
          }}>
            {/* Toggle sidebar */}
            <button onClick={() => setSidebarOpen(v => !v)} style={{
              background:`rgba(255,109,45,.08)`, border:"none", cursor:"pointer",
              width:34, height:34, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
              color: C.orange, flexShrink:0, transition:"background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.orangeDim}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,109,45,.08)"}>
              {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>

            <h1 style={{ fontSize:18, fontWeight:800, color: C.text, letterSpacing:-.3 }}>OpenHands</h1>

            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
              {[Bell, MessageSquare, Settings].map((Icon, i) => (
                <button key={i} style={{
                  width:36, height:36, borderRadius:9, border:`1px solid ${C.border}`,
                  background: C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                  color: C.muted, transition:"border-color .15s, color .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                  <Icon size={16} />
                </button>
              ))}
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {/* Content */}
          <div style={{ flex:1, display:"flex", gap:0, padding:"28px 28px 28px", maxWidth:1200, margin:"0 auto", width:"100%" }}>

            {/* Feed column */}
            <div style={{ flex:1, minWidth:0, marginRight:24 }}>

              {/* Search */}
              <div style={{
                position:"relative", marginBottom:20,
                boxShadow:`0 2px 12px rgba(0,0,0,.06)`,
                borderRadius:14,
              }}>
                <Search size={16} color={C.muted} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search scripts, communities, or #tags (#bash, #python)..."
                  style={{
                    width:"100%", padding:"13px 16px 13px 44px",
                    borderRadius:14, border:`1.5px solid ${C.border}`,
                    fontSize:14, color: C.text, background: C.white,
                    transition:"border-color .2s",
                  }}
                  onFocus={e => e.target.style.borderColor = C.orange}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Tabs */}
              <div style={{
                display:"flex", gap:0,
                borderBottom:`2px solid ${C.border}`,
                marginBottom:20,
              }}>
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding:"10px 20px", border:"none", background:"none",
                    cursor:"pointer", fontSize:14, fontWeight:600,
                    color: activeTab === tab ? C.orange : C.muted,
                    borderBottom: activeTab === tab ? `2px solid ${C.orange}` : "2px solid transparent",
                    marginBottom:"-2px",
                    transition:"color .15s",
                  }}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Posts */}
              {POSTS.map(post => <PostCard key={post.id} post={post} />)}
            </div>

            {/* Right sidebar */}
            <div style={{ width:260, flexShrink:0 }}>

              {/* Trending */}
              <div style={{
                background: C.white, borderRadius:16,
                border:`1px solid ${C.border}`,
                padding:"18px 18px", marginBottom:16,
                boxShadow:`0 1px 6px rgba(0,0,0,.04)`,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <TrendingUp size={16} color={C.orange} />
                  <span style={{ fontWeight:700, fontSize:14, color: C.text }}>Trending Topics</span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {TRENDING.map(t => (
                    <button key={t} style={{
                      padding:"5px 12px", borderRadius:99,
                      background: C.offWhite, border:`1px solid ${C.border}`,
                      fontSize:12, fontWeight:600, color: C.text,
                      cursor:"pointer", transition:"background .15s, color .15s, border-color .15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.orangeDim; e.currentTarget.style.color = C.orange; e.currentTarget.style.borderColor = C.orange; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.offWhite; e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.border; }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Open Requests */}
              <div style={{
                background: C.white, borderRadius:16,
                border:`1px solid ${C.border}`,
                padding:"18px 18px",
                boxShadow:`0 1px 6px rgba(0,0,0,.04)`,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <LifeBuoy size={16} color={C.orange} />
                  <span style={{ fontWeight:700, fontSize:14, color: C.text }}>Open Requests</span>
                  <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color: C.muted, background: C.offWhite, padding:"2px 8px", borderRadius:99 }}>Need Help!</span>
                </div>
                {OPEN_REQUESTS.map((r, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"flex-start", gap:8,
                    padding:"8px 0",
                    borderBottom: i < OPEN_REQUESTS.length - 1 ? `1px solid ${C.border}` : "none",
                    cursor:"pointer",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background: C.orange, marginTop:5, flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color: C.text }}>{r.title}</div>
                      <div style={{ fontSize:11, color: C.muted }}>{r.community}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}