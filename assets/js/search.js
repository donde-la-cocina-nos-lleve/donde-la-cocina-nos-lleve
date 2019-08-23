var div_filtros;
if(window.innerWidth>500){
    div_filtros=document.getElementById("div_filtros");
    SimpleJekyllSearch({
      searchInput: document.getElementById('search-input'),
      resultsContainer: document.getElementById('results-container'),
      filtersContainer: document.getElementById('div_filtros'), 
      json: '/search.json',
      searchResultTemplate: '<li class="objeto_resultado show {category}"><a href="{url}"><img src="{thumbnail}"/><p>{title}</p></a></li>'
    })
}
else{
    div_filtros=document.getElementById("div-filtros-mobile");
    SimpleJekyllSearch({
      searchInput: document.getElementById('search-input-mobile'),
      resultsContainer: document.getElementById('results-container-mobile'),
      filtersContainer: document.getElementById('div-filtros-mobile'), 
      json: '/search.json',
      searchResultTemplate: '<li><a href="{url}"><img src="{thumbnail}"/><p>{title}</p></a></li>'
    })
}
function mostrarFiltros(elem){
  if (elem.className.indexOf("active")>-1) {
    elem.classList.remove("active");
  } else {
    elem.classList.add("active");
  } 
  if (div_filtros.className.indexOf("show")>-1) {
    div_filtros.classList.remove("show");
  } else {
    div_filtros.classList.add("show");
  } 
}
