const SCRIPTURES_JSON = "./data/scriptures.json";
const QUOTES_JSON = "./data/quotes.json";

export async function fetchAll() {   //get all data and return it to app.js
    const s = await fetch(SCRIPTURES);
    const q = await fetch(QUOTES);
    const scriptures = await s.json();
    const quotes = await q.json()
    return { scriptures: scriptures, quotes: quotes };
}

export function randomItem(list) {
    if (!Array.isArray(list) || list.length ===0) return null;
    var i = Math.floor(Math.random() *list.length);
    return list[i];
}