const BIBLE_FILE = "./data/kjv-scriptures.json";
const LDS_FILE = "./data/lds-scriptures.json";

async function loadJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch failes: ${url} (${res.status})");
    return res.json();
}

function normRef(ref) {
    return String(ref || "")
        .toLowerCase()
        .replace(/\./g, "")
        .trim();
}

function extractRefAndText(row) {
  const ref  = row.verse_title ?? row.verse_short_title ?? row.reference ?? row.ref ?? "";
  const text = row.scripture_text ?? row.text ?? row.verse ?? row.content ?? "";
  return { ref: String(ref).trim(), text: String(text).trim() };
}

function buildIndex(array) {
  const map = new Map();
  for (const row of array || []) {
    const { ref, text } = extractRefAndText(row);
    if (ref && text) map.set(normRef(ref), text);
  }
  return map;
}

function parseRange(ref) {
  const m = String(ref).match(/^(.+?)\s+(\d+):(\d+)(?:\s*[-–]\s*(\d+))?$/);
  if (!m) return null;
  const [, book, chap, v1, v2] = m;
  return { book: book.trim(), chapter: +chap, start: +v1, end: v2 ? +v2 : +v1 };
}

function pickAllowed({ allow, index, source }) {
  const out = [];
  let id = 1;

  for (const r of allow || []) {
    if (!r) continue;
    const range = parseRange(r);

    if (!range) {
      const t = index.get(normRef(r));
      if (t) out.push({ id: id++, title: r, reference: r, text: t, source });
      continue;
    }

    const verses = [];
    for (let v = range.start; v <= range.end; v++) {
      const piece = `${range.book} ${range.chapter}:${v}`;
      const t = index.get(normRef(piece));
      if (t) verses.push(t);
    }
    if (verses.length) {
      out.push({
        id: id++,
        title: r,
        reference: r,
        text: verses.join(" "),
        source
      });
    }
  }

  return out;
}

export async function fetchAllowedScriptures() {
    const [bibleRaw, ldsRaw] = await Promise.all([
        loadJson(BIBLE_FILE),
        loadJson(LDS_FILE)
    ]);


    //Add Bible verses here//
    const bibleAllow = [
        "Jeremiah 17:7",
        "Psalm 34:4",
        "Romans 15:13",
        "John 14:27"
    ];

    //Add Triple Combination verses here//
    const ldsAllow = [
        "Alma 36:3",
        "Ether 12:4",
        "2 Nephi 31:20",
        "Moroni 7:41"
    ];

    const bibleIndex = buildIndex(bibleRaw);
    const ldsIndex = buildIndex(ldsRaw);

    const bible = pickAllowed({ allow: bibleAllow, index: bibleIndex, source: "bible"});
    const lds = pickAllowed({ allow: ldsAllow, index: ldsIndex, source: "lds"});

    return { bible, lds };
}