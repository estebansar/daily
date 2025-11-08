import { fetchAll, randomItem } from "./data.mjs";
import { getFavorites, addFavorite, removeFavorite,
    getReflections, addReflection } from "./storage.mjs";

document.addEventListener("DOMContentLoaded", function(){
    var page = document.body.getAttribute("data-page"); //home, favorites, and reflections
