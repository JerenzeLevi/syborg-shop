// Hybrid online/offline data layer.
// Tries the live Apps Script backend first for real-time stock; falls back to
// the last cached snapshot when there is no connection, and queues writes
// (reservations / decrements) to replay once back online.

const ENDPOINT = import.meta.env.VITE_APPS_SCRIPT_URL || "";
const CACHE_KEY = "syborg_catalog_cache_v1";
const QUEUE_KEY = "syborg_action_queue_v1";
const POLL_MS = 20000;

// Used only when there is no backend configured and no cached snapshot yet
// (e.g. first run before the Apps Script URL is set up), so the booth demo
// has something to show instead of spinning on "Loading catalog…" forever.
const DEMO_CATALOG = [
  { id: "sticker-cats", name: "Funny Cats Sticker", category: "stickers", price: 15, stock: 38, imageUrl: "", series: "Funny Cats" },
  { id: "sticker-hsr", name: "Honkai: Star Rail Sticker", category: "stickers", price: 15, stock: 25, imageUrl: "", series: "Honkai: Star Rail" },
  { id: "sticker-ds", name: "Demon Slayer Sticker", category: "stickers", price: 15, stock: 20, imageUrl: "", series: "Demon Slayer" },
  { id: "sticker-genshin", name: "Genshin Impact Sticker", category: "stickers", price: 15, stock: 15, imageUrl: "", series: "Genshin Impact" },
  { id: "figure-hsr-1", name: "Star Rail Mini Figure", category: "figurines", price: 250, stock: 5, imageUrl: "", series: "Honkai: Star Rail" },
  { id: "figure-ds-1", name: "Demon Slayer Figure", category: "figurines", price: 350, stock: 3, imageUrl: "", series: "Demon Slayer" },
  { id: "keychain-genshin-1", name: "Genshin Acrylic Keychain", category: "keychains", price: 80, stock: 12, imageUrl: "", series: "Genshin Impact" },
  { id: "keychain-hsr-1", name: "Star Rail Acrylic Keychain", category: "keychains", price: 80, stock: 10, imageUrl: "", series: "Honkai: Star Rail" },
];

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
}

function writeCache(items) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ items, syncedAt: Date.now() }));
}

export function getCachedSnapshot() {
  return readCache();
}

function normalizeItem(raw) {
  return {
    ...raw,
    id: raw.id,
    imageUrl: raw.imageUrl || raw.imageURL || raw.imageurl || "",
  };
}

export async function fetchCatalog() {
  if (!ENDPOINT) throw new Error("no endpoint configured");
  const res = await fetch(`${ENDPOINT}?action=catalog`);
  if (!res.ok) throw new Error("bad response");
  const raw = await res.json();
  const items = raw
    .filter((row) => row.id !== "" && row.id !== null && row.id !== undefined)
    .map(normalizeItem);
  writeCache(items);
  return { items, syncedAt: Date.now(), online: true };
}

export async function loadCatalog() {
  try {
    return await fetchCatalog();
  } catch {
    const cached = readCache();
    if (cached?.items?.length) {
      return { items: cached.items, syncedAt: cached.syncedAt, online: false };
    }
    return { items: DEMO_CATALOG, syncedAt: null, online: false, demo: true };
  }
}

export function subscribeToCatalog(onUpdate) {
  let stopped = false;
  const tick = async () => {
    if (stopped) return;
    onUpdate(await loadCatalog());
  };
  tick();
  const interval = setInterval(tick, POLL_MS);
  window.addEventListener("online", tick);
  return () => {
    stopped = true;
    clearInterval(interval);
    window.removeEventListener("online", tick);
  };
}

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

async function postAction(action) {
  if (!ENDPOINT) throw new Error("no endpoint configured");
  const res = await fetch(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(action),
  });
  if (!res.ok) throw new Error("bad response");
  return res.json();
}

export async function sendAction(action) {
  try {
    return await postAction(action);
  } catch {
    writeQueue([...readQueue(), action]);
    return { queued: true };
  }
}

export async function flushQueue() {
  const queue = readQueue();
  if (!queue.length) return;
  const remaining = [];
  for (const action of queue) {
    try {
      await postAction(action);
    } catch {
      remaining.push(action);
    }
  }
  writeQueue(remaining);
}

window.addEventListener("online", flushQueue);

export function decrementStock(itemId, qty = 1) {
  return sendAction({ action: "decrement", itemId, qty });
}

export function reserveItem({ itemId, name, contact, qty = 1 }) {
  return sendAction({ action: "reserve", itemId, name, contact, qty });
}
