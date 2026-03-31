"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, Send, Shield, Trash2, Wifi, WifiOff } from "lucide-react";
import styles from "./communitychat.module.css";

const MAX_CHARS = 2000;
const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(date) {
  return new Date(date).toLocaleTimeString("es-MX", { hour:"2-digit", minute:"2-digit" });
}

function formatDateDivider(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString())     return "Hoy";
  if (d.toDateString() === yesterday.toDateString()) return "Ayer";
  return d.toLocaleDateString("es-MX", { day:"numeric", month:"long" });
}

function shouldShowDivider(messages, index) {
  if (index === 0) return true;
  const curr = new Date(messages[index].timestamp);
  const prev = new Date(messages[index - 1].timestamp);
  return curr.toDateString() !== prev.toDateString();
}

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CommunityChat({ communityId, isAdmin = false }) {
  const { user } = useUser();

  const [socket,     setSocket]     = useState(null);
  const [status,     setStatus]     = useState("connecting"); // connecting | connected | disconnected
  const [messages,   setMessages]   = useState([]);
  const [inputText,  setInputText]  = useState("");
  const [moderating, setModerating] = useState(false);
  const [onlineCount,setOnlineCount]= useState(0);

  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const socketRef   = useRef(null);

  // ── Scroll to bottom ──────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages]);

  // ── Socket connection ─────────────────────────────────────────────────────
  useEffect(() => {
    // Importamos socket.io-client dinámicamente para no romper SSR
    let io;
    let socketInstance;

    const connect = async () => {
      try {
        const { io: ioClient } = await import("socket.io-client");
        io = ioClient;

        socketInstance = io(SERVER_URL, {
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
        });

        socketRef.current = socketInstance;

        // ── Eventos ──────────────────────────────────────────────────────
        socketInstance.on("connect", () => {
          setStatus("connected");
          // Unirse a la sala de la comunidad (igual que el HTML de prueba)
          socketInstance.emit("join", { comm_id: communityId });
        });

        socketInstance.on("disconnect", () => setStatus("disconnected"));
        socketInstance.on("connect_error", () => setStatus("disconnected"));

        // Recibir mensaje (estructura del backend: { autor, texto, timestamp?, id? })
        socketInstance.on("receive_msg", (data) => {
          setMessages(prev => [
            ...prev,
            {
              id:        data.id        || Date.now(),
              autor:     data.autor     || "Usuario",
              texto:     data.texto,
              timestamp: data.timestamp || new Date().toISOString(),
              avatar:    data.avatar    || null,
              deleted:   false,
            },
          ]);
        });

        // Conteo de usuarios online (si tu backend lo emite)
        socketInstance.on("online_count", (data) => {
          setOnlineCount(data.count || 0);
        });

        // Mensaje eliminado por moderación
        socketInstance.on("msg_deleted", (data) => {
          setMessages(prev =>
            prev.map(m => m.id === data.id ? { ...m, deleted:true } : m)
          );
        });

        // Error del servidor (ej: mensaje demasiado largo)
        socketInstance.on("error", (data) => {
          setMessages(prev => [
            ...prev,
            {
              id:        Date.now(),
              system:    true,
              texto:     `⚠️ ${data.msg}`,
              timestamp: new Date().toISOString(),
            },
          ]);
        });

        setSocket(socketInstance);

      } catch (err) {
        console.error("Socket.io-client no disponible:", err);
        setStatus("disconnected");

        // Modo demo sin backend
        setMessages([
          { id:1, autor:"SarahCode", texto:"¡Hola a todos! Bienvenidos al chat 👋", timestamp: new Date(Date.now()-300000).toISOString(), avatar:null },
          { id:2, autor:"r0otk1t",   texto:"Todo listo para la sesión de hoy. ¿Alguien probó el script de UFW?", timestamp: new Date(Date.now()-180000).toISOString(), avatar:null },
          { id:3, autor:"sec0ps",    texto:"Sí, funciona de lujo en Ubuntu 24.04. Lo puse en producción sin problemas.", timestamp: new Date(Date.now()-60000).toISOString(), avatar:null },
        ]);
      }
    };

    connect();

    return () => {
      socketInstance?.disconnect();
    };
  }, [communityId]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const texto = inputText.trim();
    if (!texto || !socketRef.current || status !== "connected") return;

    // Emitir al backend (estructura del HTML de prueba)
    socketRef.current.emit("send_msg", {
      comm_id: communityId,
      mensaje:  texto,
    });

    setInputText("");
    inputRef.current?.focus();
  }, [inputText, communityId, status]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Delete message (admin) ─────────────────────────────────────────────────
  const deleteMessage = useCallback((msgId) => {
    if (!socketRef.current) return;
    socketRef.current.emit("delete_msg", { msg_id: msgId, comm_id: communityId });
    // Optimistic update
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, deleted:true } : m));
  }, [communityId]);

  // ── Status badge ──────────────────────────────────────────────────────────
  const statusClass = {
    connected:    styles.statusConnected,
    connecting:   styles.statusConnecting,
    disconnected: styles.statusDisconnected,
  }[status];

  const statusLabel = {
    connected:    "Conectado",
    connecting:   "Conectando...",
    disconnected: "Sin conexión",
  }[status];

  const myName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "Tú";

  return (
    <div className={styles.chatSection}>

      {/* ── Header ── */}
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderLeft}>
          <MessageSquare size={16} color="var(--orange)" />
          <span className={styles.chatTitle}>Chat de la comunidad</span>

          {status === "connected" && onlineCount > 0 && (
            <div className={styles.onlineBadge}>
              <div className={styles.onlineDot} />
              {onlineCount} en línea
            </div>
          )}

          <span className={`${styles.statusBadge} ${statusClass}`}>
            {status === "connected"
              ? <Wifi size={10} style={{ display:"inline", marginRight:4 }} />
              : <WifiOff size={10} style={{ display:"inline", marginRight:4 }} />
            }
            {statusLabel}
          </span>
        </div>

        {/* Admin: toggle moderation mode */}
        {isAdmin && (
          <div className={styles.chatHeaderRight}>
            <button
              onClick={() => setModerating(v => !v)}
              className={`${styles.moderateToggle} ${moderating ? styles.moderateToggleActive : ""}`}
            >
              <Shield size={13} />
              {moderating ? "Moderando" : "Moderar"}
            </button>
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div className={styles.messageList}>
        {messages.length === 0 ? (
          <div className={styles.chatEmpty}>
            <span className={styles.chatEmptyIcon}>💬</span>
            <span className={styles.chatEmptyText}>
              {status === "connecting" ? "Conectando al chat..." : "Sin mensajes aún"}
            </span>
            <span className={styles.chatEmptySubtext}>
              {status === "connected" ? "¡Sé el primero en escribir!" : ""}
            </span>
          </div>
        ) : (
          messages.map((msg, i) => {
            // Mensaje del sistema
            if (msg.system) {
              return (
                <div key={msg.id} className={styles.systemMsg}>{msg.texto}</div>
              );
            }

            const isOwn = msg.autor === myName;

            return (
              <div key={msg.id}>
                {/* Date divider */}
                {shouldShowDivider(messages, i) && (
                  <div className={styles.dateDivider}>
                    <div className={styles.dateDividerLine} />
                    <span className={styles.dateDividerText}>{formatDateDivider(msg.timestamp)}</span>
                    <div className={styles.dateDividerLine} />
                  </div>
                )}

                <div className={`${styles.messageRow} ${isOwn ? styles.messageRowOwn : ""}`}>
                  {/* Avatar */}
                  {!isOwn && (
                    <div className={styles.msgAvatar}>
                      {msg.avatar
                        ? <img src={msg.avatar} alt={msg.autor} />
                        : getInitials(msg.autor)
                      }
                    </div>
                  )}

                  <div className={`${styles.msgBubbleWrap} ${isOwn ? styles.msgBubbleWrapOwn : ""}`}>
                    {!isOwn && <span className={styles.msgAuthor}>{msg.autor}</span>}

                    <div className={`${styles.msgBubble} ${isOwn ? styles.msgBubbleOwn : ""} ${msg.deleted ? styles.msgBubbleDeleted : ""}`}>
                      {msg.deleted ? "Mensaje eliminado por un moderador" : msg.texto}

                      {/* Admin delete button (visible on hover when moderating) */}
                      {isAdmin && moderating && !msg.deleted && (
                        <div className={styles.msgActions}>
                          <button
                            className={styles.msgActionBtn}
                            onClick={() => deleteMessage(msg.id)}
                          >
                            <Trash2 size={11} /> Eliminar
                          </button>
                        </div>
                      )}
                    </div>

                    <span className={`${styles.msgTime} ${isOwn ? styles.msgTimeOwn : ""}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>

                  {/* Own avatar */}
                  {isOwn && (
                    <div className={styles.msgAvatar}>
                      {user?.imageUrl
                        ? <img src={user.imageUrl} alt={myName} />
                        : getInitials(myName)
                      }
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className={styles.chatInputArea}>
        <div className={styles.chatInputRow}>
          <textarea
            ref={inputRef}
            className={`${styles.chatInput} ${status !== "connected" ? styles.chatInputDisabled : ""}`}
            value={inputText}
            onChange={e => setInputText(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder={
              status === "connected"
                ? "Escribe un mensaje... (Enter para enviar)"
                : status === "connecting"
                ? "Conectando..."
                : "Sin conexión al chat"
            }
            disabled={status !== "connected"}
            rows={1}
            style={{ height:"auto" }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
          />
          <span className={`${styles.charCounter} ${inputText.length > MAX_CHARS * 0.9 ? styles.charCounterWarn : ""}`}>
            {inputText.length}/{MAX_CHARS}
          </span>
          <button
            className={styles.sendBtn}
            onClick={sendMessage}
            disabled={!inputText.trim() || status !== "connected"}
          >
            <Send size={15} />
          </button>
        </div>

        {status === "disconnected" && (
          <div className={styles.disconnectedNotice}>
            Sin conexión. Reconectando automáticamente...
          </div>
        )}
      </div>
    </div>
  );
}