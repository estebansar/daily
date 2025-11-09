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
                       
  function initFavorites(){
  function draw() {
    var favs = JSON.parse(localStorage.getItem('sr_favorites') || '[]'); // read directly
    var html = '';

    if (!favs || favs.length === 0) {
      box.innerHTML = "<p>Nothing saved yet.</p>";
      return;
    }

    for (var i = 0; i < favs.length; i++) {
      var it = favs[i];
      html += ''
        + '<article class="card fade-in">'
        +   '<h3>' + (it.title || "Inspiration") + '</h3>'
        +   '<p>' + (it.text || "") + '</p>'
        +   (it.reference ? '<p><strong>' + it.reference + '</strong></p>' : '')
        +   '<button class="btn btn-remove" data-id="' + (it.id || i) + '" data-type="' + (it.type || "") + '">Remove</button>'
        + '</article>';
    }

    box.innerHTML = html;
  }
  
    document.addEventListener("click", function(e){
      var b = e.target;
      if (!b.classList || !b.classList.contains("btn-remove")) return;
      removeFavorite(Number(b.getAttribute("data-id")), b.getAttribute("data-type"));
      draw();
    });
    draw();
  }

  function initReflections(){
    var form = document.getElementById("reflection-form"); 
    var title = document.getElementById("ref-title");
    var text = document.getElementById("ref-text");
    var list = document.getElementById("reflections-list");

  function draw() {
    var rs = JSON.parse(localStorage.getItem('sr_reflections') || '[]'); // read directly       
     var html = "";

    if (!rs || rs.length === 0) {
      list.innerHTML = "<p>Nothing saved yet.</p>";
      return;
    }

    for (var i = 0; i < rs.length; i++) {
      var it = rs[i];
      html += ''
        + '<article class="card fade-in">'
        +   '<h3>' + (it.title || "Reflection") + '</h3>'
        +   '<p>' + (it.text || "") + '</p>'
         + '</article>';
    }

  list.innerHTML = html;
}

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var t = title.value.trim(), x = text.value.trim();
      if (t.length<3 || x.length<5){ alert("Please write a clear title and message."); return; }
      addReflection({ title:t, text:x, date:new Date().toISOString() });
      form.reset(); draw();
    });

    draw();
  }

  function renderItem(container, item){
    if (!item){ container.innerHTML = "<p>No item found.</p>"; return; }
    var html = ''
      + '<article class="card fade-in">'
      +   '<h3>' + item.title + '</h3>'
      +   '<p>' + item.text + '</p>'
      +   (item.author ? '<p><em>' + item.author + '</em></p>' : '')
      //+   (item.reference ? '<p><strong>' + item.reference + '</strong></p>' : '')
      +   '<button class="btn btn-fav" data-id="' + item.id + '" data-type="' + item.type + '">Save to Favorites</button>'
      + '</article>';
    container.innerHTML = html;
  }

  function renderList(items, showRemove){
    if (!items || items.length===0) return "<p>Nothing saved yet.</p>";
    var html = "";
    for (var i=0;i<items.length;i++){
      var it = items[i];
      html += ''
        + '<article class="card fade-in">'
        +   '<h3>' + (it.title || "Inspiration") + '</h3>'
        +   (it.text ? '<p>' + it.text + '</p>' : '')
        +   (showRemove ? '<button class="btn btn-remove" data-id="' + (it.id||i) + '" data-type="' + (it.type||"") + '">Remove</button>' : '')
        + '</article>';
    }
    return html;
  }
});