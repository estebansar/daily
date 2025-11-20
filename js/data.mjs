//const SCRIPTURES = "./data/scriptures.json";
//const QUOTES = "./data/quotes.json";
import { fetchAllowedScriptures } from "./allowlist.mjs";

//TODO: Add try/catch to fetchAll to prevent errors//
export async function fetchAll() {   //get all data and return it to app.js
    //const s = await fetch(SCRIPTURES);
    //const q = await fetch(QUOTES);
    //const scriptures = await s.json();
    //const quotes = await q.json()
    //return { scriptures: scriptures, quotes: quotes };
    try {    
        return await fetchAllowedScriptures();
    } catch (e) {
        console.error("[fetchAll] error:", e);
        return { bible: [], lds: []};
    }
}


//TODO: Prevent repeat scriptures from list//
//export function randomItem(list) {
    //if (!Array.isArray(list) || list.length ===0) return null;
    //var i = Math.floor(Math.random() *list.length);
    //return list[i];
//}

export function randomItem(list, key) {
    if (!Array.isArray(list) || list.length === 0) return null;

    const seenKey = `seen:${key}`;
    let seen = [];
    try {
        seen = JSON.parse(localStorage.getItem(seenKey)) || [];
    } catch {}

    const unseen = list.filter(item => !seen.includes(item.id));

    if (unseen.length === 0) {
        localStorage.removeItem(seenKey);
        return randomItem(list, key);
    }

    const randomIndex = Math.floor(Math.random() * unseen.length);
    const choice = unseen[randomIndex];

    seen.push(choice.id);
    localStorage.setItem(seenKey, JSON.stringify(seen));

    return choice;
}