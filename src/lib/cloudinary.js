export function buildCloudinaryAttachmentUrl(secureUrl, filename) {
  try {
    const u = new URL(secureUrl);
    const parts = u.pathname.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return secureUrl;
    const nameFrag = filename
      ? `fl_attachment:${encodeURIComponent(filename)}`
      : "fl_attachment";
    parts.splice(uploadIdx + 1, 0, nameFrag);
    u.pathname = parts.join("/");
    return u.toString();
  } catch {
    return secureUrl;
  }
}

export function filenameFromUrl(url, fallback = "image.jpg") {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").pop() || "";
    return decodeURIComponent(last) || fallback;
  } catch {
    return fallback;
  }
}

export async function downloadBlob(url, filename = "download") {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Failed to fetch file");
  const blob = await resp.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}