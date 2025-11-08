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
            var type = select.value;    // scripure or quote
            var list = data[type];
            var items = [];             //simple ids
            for (var i=0;i<list.length;i++){
                var it = list[i];
                items.push({
                    id: (typeof it.id==="number"? it.id : i),
                    type: type,
                    title: it.title || it.reference || "Inspiration",
                    text: it.text || it.quote || "",
                    author: it.author || "",
                    reference: it.reference || ""
                });
            }
            renderItem(out, randomItem(items));
        }
    btn.addEventListener("click", showOne);
    select.addEventListener("change", showOne);  
    
    document.addEventListener("click", function(e){
      var b = e.target;
      if (!b.classList || !b.classList.contains("btn-fav")) return;
      var id = Number(b.getAttribute("data-id"));
      var type = b.getAttribute("data-type");
      // find again to save the full item
      var list = data[type];
      for (var i=0;i<list.length;i++){
        var it = list[i];
        var itId = (typeof it.id==="number"? it.id : i);
        if (itId === id){
          addFavorite({
            id: itId, type:type,
            title: it.title || it.reference || "Inspiration",
            text: it.text || it.quote || "",
            author: it.author || "",
            reference: it.reference || ""
          });
          b.textContent = "Saved"; b.disabled = true;
          break;
        }
      }
    });
  }
                                       

