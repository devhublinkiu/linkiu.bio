import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Headphones, Clock, Share2, ChevronLeft, Play, ChevronRight, VolumeX, Volume2, X } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";
function formatDate(d) {
  return new Date(d).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
}
function formatTimeAgo(createdAt) {
  const now = /* @__PURE__ */ new Date();
  const past = new Date(createdAt);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 6e4);
  const diffHours = Math.floor(diffMs / 36e5);
  const diffDays = Math.floor(diffMs / 864e5);
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
  if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
  if (diffWeeks < 4) return `Hace ${diffWeeks} ${diffWeeks === 1 ? "semana" : "semanas"}`;
  return formatDate(createdAt);
}
function EpisodeCard({ ep, logoUrl, bgColor, onPlay }) {
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${ep.title} - ${ep.formatted_duration}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: ep.title, text, url }).catch(() => navigator.clipboard?.writeText(url));
    } else {
      navigator.clipboard?.writeText(url);
    }
  };
  const isGradient = Boolean(bgColor);
  const textClass = isGradient ? "text-white" : "text-slate-900";
  const metaClass = isGradient ? "text-white/90" : "text-slate-500";
  const dotClass = isGradient ? "text-white/70" : "text-slate-300";
  const shareBtnClass = isGradient ? "text-white hover:bg-white/20 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-primary";
  return /* @__PURE__ */ jsxs(
    "article",
    {
      role: "button",
      tabIndex: 0,
      onClick: onPlay,
      onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && onPlay(),
      className: `rounded-xl border border-slate-200 shadow-sm overflow-hidden flex gap-4 px-2 py-3 cursor-pointer hover:shadow-lg transition-all active:scale-[0.99] ${!bgColor ? "bg-white" : ""}`,
      style: bgColor ? { background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 50%, ${bgColor}99 100%)` } : void 0,
      children: [
        /* @__PURE__ */ jsx("div", { className: "shrink-0 w-12 h-12 rounded-full bg-white/20 overflow-hidden flex items-center justify-center", children: logoUrl ? /* @__PURE__ */ jsx("img", { src: logoUrl, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Headphones, { className: "size-7 text-slate-400" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 flex flex-col items-start justify-center", children: [
          /* @__PURE__ */ jsx("h2", { className: `font-bold text-base line-clamp-2 leading-none ${textClass}`, children: ep.title }),
          /* @__PURE__ */ jsxs("p", { className: `text-xs flex items-center gap-1 flex-wrap ${metaClass}`, children: [
            /* @__PURE__ */ jsx("span", { children: formatTimeAgo(ep.created_at) }),
            /* @__PURE__ */ jsx("span", { className: dotClass, children: "•" }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { className: "size-3.5" }),
              ep.formatted_duration
            ] }),
            /* @__PURE__ */ jsx("span", { className: dotClass, children: "•" }),
            /* @__PURE__ */ jsx("span", { children: formatDate(ep.created_at) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleShare,
            className: `p-2 rounded-lg transition-colors shrink-0 ${shareBtnClass}`,
            "aria-label": "Compartir",
            children: /* @__PURE__ */ jsx(Share2, { className: "size-5" })
          }
        )
      ]
    }
  );
}
function FloatingAudioPlayer({ episodes, currentIndex, onClose, onIndexChange }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const ep = episodes[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < episodes.length - 1;
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
      });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);
  const goPrev = useCallback(() => {
    if (hasPrev) onIndexChange(currentIndex - 1);
    else if (audioRef.current) audioRef.current.currentTime = 0;
  }, [hasPrev, currentIndex, onIndexChange]);
  const goNext = useCallback(() => {
    if (hasNext) onIndexChange(currentIndex + 1);
    else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [hasNext, currentIndex, onIndexChange]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !ep?.audio_url) return;
    audio.src = ep.audio_url;
    setCurrentTime(0);
    setDuration(0);
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [currentIndex, ep?.id, ep?.audio_url]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      if (hasNext) onIndexChange(currentIndex + 1);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [currentIndex, hasNext, onIndexChange]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);
  const handleSeek = (e) => {
    const t = Number(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = t;
      setCurrentTime(t);
    }
  };
  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    setMuted(v === 0);
  };
  const handleClose = useCallback(() => {
    audioRef.current?.pause();
    onClose();
  }, [onClose]);
  if (!ep) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("audio", { ref: audioRef, preload: "metadata" }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-b from-white to-slate-200 border-t border-slate-200 shadow-xl safe-area-pb mx-4 my-6 rounded-xl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto px-4 py-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "range",
          min: 0,
          max: duration || 100,
          value: currentTime,
          onChange: handleSeek,
          className: "w-full h-1.5 accent-primary cursor-pointer"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 items-center mt-1 mb-2 text-xs", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900 truncate min-w-0", title: ep.title, children: ep.title }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 text-right tabular-nums", children: [
          Math.floor(currentTime / 60),
          ":",
          Math.floor(currentTime % 60).toString().padStart(2, "0"),
          " / ",
          ep.formatted_duration
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: goPrev, disabled: !hasPrev && currentTime === 0, className: "p-2 rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none", "aria-label": "Anterior", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-6" }) }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: togglePlay, className: "p-2 rounded-full bg-primary text-white hover:opacity-90 shadow-md flex items-center justify-center min-w-[48px] min-h-[48px]", "aria-label": isPlaying ? "Pausar" : "Reproducir", children: isPlaying ? /* @__PURE__ */ jsxs("span", { className: "flex gap-0.5 items-end", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1 h-4 bg-white rounded-full animate-pulse", style: { animationDelay: "0ms" } }),
          /* @__PURE__ */ jsx("span", { className: "w-1 h-4 bg-white rounded-full animate-pulse", style: { animationDelay: "150ms" } }),
          /* @__PURE__ */ jsx("span", { className: "w-1 h-4 bg-white rounded-full animate-pulse", style: { animationDelay: "300ms" } })
        ] }) : /* @__PURE__ */ jsx(Play, { className: "size-6 ml-0.5" }) }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: goNext, disabled: !hasNext, className: "p-2 rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none", "aria-label": "Siguiente", children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-6" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setMuted((m) => !m), className: "p-2 rounded-full text-slate-600 hover:bg-slate-100", "aria-label": muted ? "Activar sonido" : "Silenciar", children: muted || volume === 0 ? /* @__PURE__ */ jsx(VolumeX, { className: "size-5" }) : /* @__PURE__ */ jsx(Volume2, { className: "size-5" }) }),
          /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: 1, step: 0.05, value: muted ? 0 : volume, onChange: handleVolumeChange, className: "w-16 h-1.5 accent-primary cursor-pointer", "aria-label": "Volumen" })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: handleClose, className: "p-2 rounded-full text-slate-500 hover:bg-slate-100", "aria-label": "Cerrar", children: /* @__PURE__ */ jsx(X, { className: "size-5" }) })
      ] })
    ] }) })
  ] });
}
export {
  EpisodeCard as E,
  FloatingAudioPlayer as F
};
