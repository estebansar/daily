import { fetchAll, randomItem } from "./data.mjs";
import { getFavorites, addFavorite, removeFavorite,
    getReflections, addReflection } from "./storage.mjs";

document.addEventListener("DOMContentLoaded", function(){
    var page = document.body.getAttribute("data-page"); //home, favorites, and reflections

    if (page === "home") initHome();
    if (page === "favorites") initFavorites();
    if (page === "reflections") initReflections();

    function initHome(){
        var select = document.getElementById("type-select");
        var btn = document.getElementById("btn-random"); 
        var out = document.getElementById("inspiration");
        var data = { scriptures:[], quotes:[] };

        fetchAll().then(function(all){ data = all; showOne(); });

        function showOne(){
            var type = select.value;
            var list = data[type];
            

