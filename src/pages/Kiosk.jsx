import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { subscribeToCatalog } from "../lib/dataClient";
import StockPanel from "../components/StockPanel";

const SHOP_URL = window.location.origin + "/";
const ADS = ["/ads/reel-1.mp4", "/ads/reel-2.mp4"];

export default function Kiosk() {
  const [state, setState] = useState({ items: [] });
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => subscribeToCatalog(setState), []);

  return (
    <div>
      <div className="kiosk">
        <video
          src={ADS[adIndex]}
          autoPlay
          loop
          muted
          playsInline
          onEnded={() => setAdIndex((i) => (i + 1) % ADS.length)}
        />
        <div className="kiosk-brand">
          <img src="/logo.png" alt="SYBORG Club" />
          <div className="brand-text">
            <span className="brand-title">SYBORG Shop</span>
            <span className="brand-sub">scan to browse</span>
          </div>
        </div>
        <span className="kiosk-label">SYBORG CLUB</span>
        <div className="kiosk-qr">
          <QRCodeSVG value={SHOP_URL} size={140} fgColor="#0a0d16" />
        </div>
      </div>
      <StockPanel items={state.items} onChanged={() => {}} />
    </div>
  );
}
