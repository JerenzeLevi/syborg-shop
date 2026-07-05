import { useState } from "react";
import ReservationForm from "./ReservationForm";
import StickerConfirmModal from "./StickerConfirmModal";

function isBlank(v) {
  return v === undefined || v === null || v === "" || v === "TBD";
}

export default function CatalogCard({ item }) {
  const [reserving, setReserving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const hasStock = !isBlank(item.stock) && !isNaN(Number(item.stock));
  const soldOut = hasStock && Number(item.stock) <= 0;
  const needsInquiry = soldOut || !hasStock;
  const hasPrice = !isBlank(item.price) && !isNaN(Number(item.price));
  const isSticker = String(item.category || "").toLowerCase().includes("sticker");

  let stockLabel = "Stock TBA";
  let stockClass = "tba";
  if (soldOut) {
    stockLabel = "Sold Out";
    stockClass = "sold-out";
  } else if (hasStock) {
    stockLabel = `${item.stock} left`;
    stockClass = "in-stock";
  }

  return (
    <div className="card">
      {!isBlank(item.imageUrl) ? (
        <img src={item.imageUrl} alt={item.name} loading="lazy" />
      ) : (
        <div className="card-img-placeholder">photo coming soon</div>
      )}
      <div className="card-body">
        <p className="card-title">{item.name}</p>
        <div className="card-meta">
          <span className={hasPrice ? "price" : "price price-tba"}>
            {hasPrice ? `₱${item.price}${isSticker ? " / pc" : ""}` : "Price TBA"}
          </span>
          <span className={`badge ${stockClass}`}>{stockLabel}</span>
        </div>
      </div>
      {needsInquiry && !reserving && (
        <div className="inline-form">
          <button
            className="btn"
            onClick={() => (isSticker ? setConfirming(true) : setReserving(true))}
          >
            {soldOut ? "Reserve" : "Ask / Reserve"}
          </button>
        </div>
      )}
      {needsInquiry && reserving && <ReservationForm item={item} onDone={() => {}} />}
      {confirming && (
        <StickerConfirmModal
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            setReserving(true);
          }}
        />
      )}
    </div>
  );
}
