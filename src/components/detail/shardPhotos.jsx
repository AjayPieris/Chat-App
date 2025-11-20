import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  buildCloudinaryAttachmentUrl,
  filenameFromUrl,
  downloadBlob,
} from "../../lib/cloudinary";

function normalizeMessageImage(msg) {
  if (!msg?.img) return null;
  if (typeof msg.img === "string") {
    const url = msg.img;
    const name = filenameFromUrl(url, "image.jpg");
    return {
      url,
      name,
      createdAt: msg.createdAt,
      downloadUrl: buildCloudinaryAttachmentUrl(url, name),
    };
  }
  const { url, originalFilename, format } = msg.img;
  const name =
    (originalFilename && format && `${originalFilename}.${format}`) ||
    originalFilename ||
    filenameFromUrl(url, "image.jpg");
  return {
    url,
    name,
    createdAt: msg.createdAt,
    downloadUrl: buildCloudinaryAttachmentUrl(url, name),
  };
}

export default function SharedPhotos({ chatId, batchSize = 30 }) {
  const [all, setAll] = useState([]);
  const [count, setCount] = useState(batchSize);
  const [preview, setPreview] = useState(null); // {url,name}
  const gridRef = useRef(null);
  const loadingRef = useRef(false);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    setCount(batchSize);
  }, [chatId, batchSize]);

  useEffect(() => {
    if (!chatId) {
      setAll([]);
      return;
    }
    const unsub = onSnapshot(doc(db, "chats", chatId), (snap) => {
      const data = snap.data();
      const msgs = data?.messages || [];
      const imgs = [];
      for (const m of msgs) {
        const norm = normalizeMessageImage(m);
        if (norm) imgs.push(norm);
      }
      imgs.sort((a, b) => {
        const ta =
          a.createdAt?.toMillis?.() ??
          (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const tb =
          b.createdAt?.toMillis?.() ??
          (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return tb - ta;
      });
      setAll(imgs);
    });
    return () => unsub();
  }, [chatId]);

  const visible = useMemo(() => all.slice(0, count), [all, count]);

  const loadMore = useCallback(() => {
    if (loadingRef.current) return;
    if (count >= all.length) return;
    loadingRef.current = true;
    setTimeout(() => {
      setCount((c) => Math.min(c + batchSize, all.length));
      loadingRef.current = false;
    }, 80);
  }, [count, all.length, batchSize]);

  const handleScroll = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    el.classList.add("scrolling");
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      el.classList.remove("scrolling");
    }, 900);

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12) {
      loadMore();
    }
  }, [loadMore]);

  const handleDownload = useCallback(async (img) => {
    try {
      const url = img.downloadUrl || buildCloudinaryAttachmentUrl(img.url, img.name);
      await downloadBlob(url, img.name || "image.jpg");
    } catch (e) {
      console.error("Download failed:", e);
      window.open(img.url, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <div
      className="photosGrid"
      ref={gridRef}
      onScroll={handleScroll}
      onMouseEnter={() => gridRef.current?.classList.add("hover")}
      onMouseLeave={() => gridRef.current?.classList.remove("hover")}
    >
      {visible.length === 0 ? (
        <p className="photosEmpty">No shared photos yet.</p>
      ) : (
        <div className="grid">
          {visible.map((img, i) => (
            <div className="photoCell" key={img.url + i}>
              <figure
                className="thumb"
                title={img.name}
                onClick={() => setPreview(img)}
              >
                <img src={img.url} alt={img.name} loading="lazy" />
                <figcaption>
                  <span>{img.name}</span>
                </figcaption>
              </figure>
              <div className="cellActions">
                <button
                  className="dlBtn"
                  onClick={() => handleDownload(img)}
                  title="Download"
                >
                  ⬇
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {count < all.length && (
        <div className="photosLoader">Loading more…</div>
      )}

      {preview && (
        <div
          className="photoModal"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modalInner"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={preview.url} alt={preview.name} />
            <div className="modalMeta">
              <span>{preview.name}</span>
              <button
                onClick={() => handleDownload(preview)}
                className="modalDownload"
              >
                Download
              </button>
              <button
                className="modalClose"
                onClick={() => setPreview(null)}
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}