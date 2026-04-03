"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

import {
  Home, FolderOpen, MessageSquare, Plus, Bell, Settings,
  Search, Star, ChevronLeft, ChevronRight, Hash, LifeBuoy,
  MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Link2, PenSquare, Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import "./user.css";
import { PostCardSkeleton } from "../../components/SkeletonPost";
import { PostCard } from "../../components/Post";

// ─── Palette ─────────────────────────────────────────────────────────────────


// ─── Sample data ──────────────────────────────────────────────────────────────
// const POSTS = [
//   {
//     id: 1,
//     featured: true,
//     title: "Automated Nginx + UFW Firewall Config [Ubuntu 24.04]",
//     author: "u/SarahCode",
//     community: "d/Linux Scripts",
//     time: "3h ago",
//     tags: ["#linux", "#nginx", "#bash"],
//     rating: 4.9,
//     votes: 248,
//     comments: 34,
//     hasCode: true,
//     codeLines: [
//       { text: "$ bash",                                      color: "#FF6D2D" },
//       { text: "#import /u/bain",                             color: "#FF6D6D" },
//       { text: "automated Nginx + UFW Firewall Config",       color: "#6EE7B7" },
//       { text: "automated Nginx + UFW Firewall",              color: "#6EE7B7" },
//     ],
//     codeLang: "Bash",
//     refs: [
//       { label: "'Basic Nginx Setup'", sub: "(u/DevMike)" },
//       { label: "'UFW Ruleset'",       sub: "(u/SysAdmin01)" },
//     ],
//   },
//   {
//     id: 2,
//     featured: false,
//     title: "Best way to deploy React 19 on Vercel?",
//     author: "u/devjorge",
//     community: "d/React Hub",
//     time: "1h ago",
//     tags: ["#react", "#vercel", "#deploy"],
//     rating: null,
//     votes: 87,
//     comments: 15,
//     hasCode: false,
//     refs: [],
//   },
//   {
//     id: 3,
//     featured: false,
//     title: "¿Cómo optimizar queries lentas en PostgreSQL?",
//     author: "u/dbmaster",
//     community: "d/Databases",
//     time: "5h ago",
//     tags: ["#postgresql", "#sql", "#performance"],
//     rating: null,
//     votes: 132,
//     comments: 22,
//     hasCode: false,
//     refs: [],
//   },
// ];

// const TRENDING = ["#React19", "#PythonAutomation", "#DockerCompose", "#CI_CD", "#NextJS15"];

const RECOMMENDED_COMMUNITIES = [
  { icon: "🐍", name: "d/Python Devs", members: "12.4k" },
  { icon: "🌐", name: "d/WebDesign", members: "8.2k" },
  { icon: "🔐", name: "d/CyberSec", members: "5.1k" },
];

const NAV_ITEMS = [
  { icon: Home, label: "Home", badge: null },
  { icon: FolderOpen, label: "My Projects", badge: null },
  { icon: MessageSquare, label: "Messages", badge: 3 },
];

const COMMUNITIES = [
  { icon: "🐧", label: "d/Linux Scripts" },
  { icon: "⚛️", label: "d/React Hub" },
];


// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [isRightOverlay, setIsRightOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState("For You");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { user } = useUser();
  const [hasMore, SetHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false)
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [loadingUserComunity, setLoadingUserComunity] = useState(false);
  const [trendsData, setTrendsData] = useState([]);
  const [userCommunitys, setUserCommunitys] = useState([]);
  //xD
  //fetch de las comnidades del usuario
  //pendiente de finalizar: loading animations
  async function loaduserdata() {
    try {
      setLoadingTrends(true);
      const trends = await fetch(`/api/community/trending`);
      const trendsData = await trends.json();
      setUserCommunitys(trendsData);
    } catch (e) {
      console.log("errores: ", e);
    } finally {
      setLoadingTrends(false)

    }
    //loading de los datos de 'mis comunidades':D
    try {
    //  setLoadingUserComunity(true);
    //  const userdata = await fetch(`/api/userdata/`);
    //  const userCommunitys = await userdata.json();
    //  setUserCommunitys(userCommunitys);
    } catch (e) {
      console.log("errores:", e);
    } finally {
      setLoadingUserComunity(false);

    }
  }
  async function loadhomepage(page = 1) {
    try {
      setLoading(true)
      const response = await fetch(`/api/resources?page=${page}`);
      const data = await response.json()
    //  console.log(data.items[0])
    //  console.log(data.items[3])
    //  data.items.pop()
    //  Array.slice()

    //  data.items = data.items.slice(1, 6)
    //  data.items.push(data.items[1])

    //  console.log("data:", data);// comentado con gc: V
      setPosts(data.items);
      SetHasMore(data.has_more);
    } catch (error) {
    //    const first = data.items[0]
    //  console.log(data.items[0])
    //  console.log(data.items[3])
    //  console.log(first.link)

      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false)
    }

  }
  useEffect(() => {
    loaduserdata();
    loadhomepage(1);

  }, [])
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

      if (w < 850) {
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

  const tabs = ["For You", "Trending Projects", "Community Feed"];

  // Lógica para unirse a una comunidad (puedes adaptarlo luego a tu base de datos)
  const handleJoinCommunity = (communityName) => {
    console.log(`Unido a ${communityName}`);
    // Aquí podrías agregar un pequeño estado para cambiar "Join" a "Joined" visualmente
  };

  return (

    < div className="layout" >
      {isOverlay && sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )
      }

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : "sidebar--closed"} ${isOverlay ? "sidebar--overlay" : ""}`}>
        <div className="sidebar__inner">
          <div className="sidebar__logo">
            <img src="/assets/icons/logo.png" alt="OpenHands" />
            <span className="sidebar__logo-text">Open Hands</span>
          </div>

          <div className="sidebar__profile">
            <img src={user?.imageUrl} alt="avatar" className="sidebar__avatar" />
            <span className="sidebar__username">
              {user?.firstName} {user?.lastName}
            </span>
          </div>

          <nav className="sidebar__nav">
            {NAV_ITEMS.map(({ icon: Icon, label, badge }) => (
              <button key={label} className={`nav-item ${label === "Home" ? "nav-item--active" : ""}`}>
                <Icon size={18} />
                {label}
                {badge && <span className="nav-item__badge">{badge}</span>}
              </button>
            ))}
            <button className="btn-new-project" onClick={() => router.push("/post/new")}>
              <Plus size={16} /> Nuevo Recurso 
            </button>
          </nav>

            {
                /*
          <div>
            <span className="sidebar__section-label">My Communities</span>
            {userCommunitys.map((c) => (
              <button key={c.label} className="community-item">
                <span className="community-item__icon">{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
                */
            }
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
              <button key={i} className="topbar__icon-btn"><Icon size={16} /></button>
            ))}
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Content */}
        <div className="content">

          {/* ── FEED WRAPPER ── */}
          <div className="feed-wrapper">

            {/* Feed Scroll */}
            <div className="feed-scroll">
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

              <div className="tabs">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn ${activeTab === tab ? "tab-btn--active" : ""}`}>
                    {tab}
                  </button>
                ))}
              </div>

              {loading ? (
                <>
                    {[...Array(5)].map((_, i) => (
                        <PostCardSkeleton key={i} />
                    ))} 
                </>
              ) :
              <>
                 {posts.map((post) => <PostCard key={post.id} post={post} />)}
              </>
            }

            </div>

            {/* FAB */}
            <button
              className="fab-new-post"
              onClick={() => router.push("/post/new")}
              title="Nueva publicación"
            >
              <PenSquare size={24} />
            </button>
          </div>

          {/* Right sidebar toggle */}
          {isRightOverlay && (
            <button
              className={`right-sidebar__toggle ${rightOpen ? "right-sidebar__toggle--open" : ""}`}
              onClick={() => { if (isOverlay && sidebarOpen) setSidebarOpen(false); setRightOpen((v) => !v); }}
            >
              <ChevronRight size={16} />
            </button>
          )}

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
                {trendsData.map((t) => (
                  <button
                    key={t}
                    className="trending-tag"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(t)}`)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Communities (New!) */}
            <div className="widget">
              <div className="widget__header">
                <Users size={16} color="#FF6D2D" />
                <span className="widget__title">Recommended</span>
              </div>
              <div className="recommended-list">
                {RECOMMENDED_COMMUNITIES.map((c, i) => (
                  <div key={i} className="recommended-item">
                    <div className="recommended-item__icon">{c.icon}</div>
                    <div className="recommended-item__info">
                      <div className="recommended-item__name" onClick={() => router.push('/community')}>{c.name}</div>
                      <div className="recommended-item__members">{c.members} members</div>
                    </div>
                    <button
                      className="recommended-item__join"
                      onClick={() => handleJoinCommunity(c.name)}
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
