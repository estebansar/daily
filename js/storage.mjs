var FAV_KEY = "sr_favorites"; 
var REF_KEY = "sr_reflections"; 

function load(key) {
    try{
        return JSON.parse(localStorage.getItem(key) || "[]");
    }   catch (e) {
        return [];
    }
}

function save(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
}

//favorites
export function getFavorites() { return load(FAV_KEY); }
export function addFavorite(item) {
    var list = load(FAV_KEY);
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === item.id && list[i].type === item.type) return list;
    }
    list.push(item)
    save(FAV_KEY, list);
    return list;
}

export function removeFavorite(id, type) {
    var list = load(FAV_KEY), keep = [];
    for (var i = 0; i < list.length; i++) {
        if (!(list[i].id === id && list[i].type === type)) keep.push(list[i]);
    }
    save(FAV_KEY, keep);
    return keep;
}

//reflections

export function getReflections() { return load(REF_KEY); }
export function addReflection(r) {
    var list = load(REF_KEY);
    list.push(r);
    save(REF_KEY, list);
    return list;
}