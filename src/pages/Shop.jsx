import { useEffect, useState } from "react";
import { subscribeToCatalog } from "../lib/dataClient";
import CatalogCard from "../components/CatalogCard";
import AdReel from "../components/AdReel";
import OfflineBanner from "../components/OfflineBanner";

const AD_EVERY = 4;
const ADS = ["/ads/reel-1.mp4", "/ads/reel-2.mp4"];

export default function Shop() {
  const [state, setState] = useState({ items: [], online: true, syncedAt: null, demo: false });

  useEffect(() => subscribeToCatalog(setState), []);

  const hasStickers = state.items.some((item) =>
    String(item.category || "").toLowerCase().includes("sticker")
  );

  const feed = [];
  state.items.forEach((item, i) => {
    feed.push(<CatalogCard key={item.id} item={item} />);
    if ((i + 1) % AD_EVERY === 0) {
      feed.push(
        <AdReel key={`ad-${i}`} src={ADS[(i / AD_EVERY) % ADS.length]} />
      );
    }
  });

  return (
    <>
      <div className="brand">
        <img src="/logo.png" alt="SYBORG Club" />
        <div className="brand-text">
          <span className="brand-title">SYBORG Shop</span>
          <span className="brand-sub">anime merch · every event</span>
        </div>
      </div>
      <OfflineBanner online={state.online} syncedAt={state.syncedAt} demo={state.demo} />
      {hasStickers && (
        <p className="sticker-notice">
          Stickers are sold <strong>per piece</strong>, not per whole set — prices
          below are per sticker.
        </p>
      )}
      <div className="feed">
        {feed.length === 0 && <p className="mono">Loading catalog…</p>}
        {feed}
      </div>
    </>
  );
}
