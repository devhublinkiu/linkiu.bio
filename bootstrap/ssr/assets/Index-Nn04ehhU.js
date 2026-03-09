import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-DqQsy9AV.js";
import { E as EpisodeCard, F as FloatingAudioPlayer } from "./FloatingAudioPlayer-2m5hVaig.js";
import { Headphones } from "lucide-react";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "./ReportBusinessStrip-U20bW72V.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./textarea-BpljFL5D.js";
function PodcastIndex({ tenant, pageTitle, episodeOfTheDay, episodes }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  const [playerIndex, setPlayerIndex] = useState(null);
  const allEpisodes = episodeOfTheDay ? [episodeOfTheDay, ...episodes.data] : episodes.data;
  const openPlayer = useCallback((index) => {
    setPlayerIndex(index);
  }, []);
  return /* @__PURE__ */ jsxs(
    PublicLayout,
    {
      bgColor: bg_color,
      renderFloatingBottom: playerIndex !== null && allEpisodes.length > 0 ? /* @__PURE__ */ jsx(
        FloatingAudioPlayer,
        {
          episodes: allEpisodes,
          currentIndex: playerIndex,
          onClose: () => setPlayerIndex(null),
          onIndexChange: setPlayerIndex
        }
      ) : null,
      children: [
        /* @__PURE__ */ jsx(Head, { title: `${pageTitle} - ${tenant.name}` }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx(
          Header,
          {
            tenantName: tenant.name,
            description: tenant.store_description,
            logoUrl: tenant.logo_url,
            bgColor: bg_color,
            textColor: brandColors.name_color ?? "#ffffff",
            descriptionColor: brandColors.description_color
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-8", children: [
          /* @__PURE__ */ jsxs("section", { "aria-labelledby": "podcast-heading", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { id: "podcast-heading", className: "text-3xl font-black tracking-tight uppercase", children: pageTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: !episodeOfTheDay && episodes.data.length === 0 ? "Mensajes y enseñanzas en audio" : `${(episodeOfTheDay ? 1 : 0) + episodes.total} ${(episodeOfTheDay ? 1 : 0) + episodes.total === 1 ? "episodio" : "episodios"}` })
            ] }) }),
            /* @__PURE__ */ jsxs("section", { className: "mt-8", "aria-labelledby": "del-dia-heading", children: [
              /* @__PURE__ */ jsxs("h2", { id: "del-dia-heading", className: "text-xl font-bold text-slate-900 mb-4", children: [
                pageTitle,
                " del día"
              ] }),
              episodeOfTheDay ? /* @__PURE__ */ jsx(
                EpisodeCard,
                {
                  ep: episodeOfTheDay,
                  logoUrl: tenant.logo_url,
                  bgColor: bg_color,
                  onPlay: () => openPlayer(0)
                }
              ) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 rounded-2xl bg-slate-50 border border-slate-100", children: [
                /* @__PURE__ */ jsx(Headphones, { className: "size-8 text-slate-300 mx-auto mb-2" }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm", children: "No hay episodio del día aún" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "mt-10 pt-8 border-t border-slate-200", "aria-labelledby": "listado-heading", children: [
              /* @__PURE__ */ jsxs("h2", { id: "listado-heading", className: "text-xl font-bold text-slate-900 mb-4", children: [
                "Listado de ",
                pageTitle
              ] }),
              episodes.data.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm", children: "No hay más episodios en el listado." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("ul", { className: "space-y-4 list-none p-0 m-0", children: episodes.data.map((ep, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                  EpisodeCard,
                  {
                    ep,
                    logoUrl: tenant.logo_url,
                    bgColor: bg_color,
                    onPlay: () => openPlayer(episodeOfTheDay ? i + 1 : i)
                  }
                ) }, ep.id)) }),
                episodes.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(SharedPagination, { links: episodes.links }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-center mt-8", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.home", tenant.slug), className: "text-sm text-primary hover:underline", children: "← Volver al inicio" }) })
        ] })
      ]
    }
  );
}
export {
  PodcastIndex as default
};
