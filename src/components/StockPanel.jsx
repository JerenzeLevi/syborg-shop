import { decrementStock } from "../lib/dataClient";

export default function StockPanel({ items, onChanged }) {
  return (
    <div className="card" style={{ maxWidth: 480, margin: "1rem auto" }}>
      <div className="card-body">
        <p className="card-title mono">STAFF · MARK SOLD</p>
        {items.map((item) => (
          <div key={item.id} className="card-meta" style={{ padding: "0.4rem 0" }}>
            <span>{item.name} ({item.stock})</span>
            <button
              className="btn"
              disabled={Number(item.stock) <= 0}
              onClick={async () => {
                await decrementStock(item.id, 1);
                onChanged?.();
              }}
            >
              −1
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
