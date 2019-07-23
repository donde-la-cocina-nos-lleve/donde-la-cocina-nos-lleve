/*!
  * Simple-Jekyll-Search v1.7.2 (https://github.com/christian-fei/Simple-Jekyll-Search)
  * Copyright 2015-2018, Christian Fei
  * Licensed under the MIT License.
  */

(function(){

var _$src_8 = {};
(function (window) {
  'use strict'

  var options = {
    searchInput: null,
    resultsContainer: null,
    json: [],
    searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
    noResultsText: 'No results found',
    limit: 10,
    exclude: []
  }

  window.SimpleJekyllSearch = function (_options) {
    options = merge(options, _options)

    if (isJSON(options.json)) {
      initWithJSON(options.json)
    } else {
      initWithURL(options.json)
    }
    return {
      search: search
    }
  }

  //get JSON via xhr
  function initWithJSON (json) {
    put(json)
    registerInput()
  }

  function initWithURL (url) {
    load(url, function (err, json) {
      if (err) {
        throwError('failed to get JSON (' + url + ')')
      }
      initWithJSON(json)
    })
  }

  function load (location, callback) {
    var xhr = getXHR()
    xhr.open('GET', location, true)
    xhr.onreadystatechange = createStateChangeListener(xhr, callback)
    xhr.send()
  }
  
  function createStateChangeListener (xhr, callback) {
    return function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          callback(null, JSON.parse(xhr.responseText))
        } catch (err) {
          callback(err, null)
        }
      }
    }
  }
  
  function getXHR () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
  }

  //build array of data from JSON
  var data = []
  var opt = {}
  
  opt.limit = 10
  
  function put (data) {
    if (isObject(data)) {
      return addObject(data)
    }
    if (isArray(data)) {
      return addArray(data)
    }
    return undefined
  }
  function clear () {
    data.length = 0
    return data
  }
  
  function isObject (obj) {
    return Boolean(obj) && Object.prototype.toString.call(obj) === '[object Object]'
  }
  
  function isArray (obj) {
    return Boolean(obj) && Object.prototype.toString.call(obj) === '[object Array]'
  }
  
  function addObject (_data) {
    data.push(_data)
    return data
  }
  
  function addArray (_data) {
    var added = []
    clear()
    for (var i = 0, len = _data.length; i < len; i++) {
      if (isObject(_data[i])) {
        added.push(addObject(_data[i]))
      }
    }
    return added
  }
  
  //filter and get matches
  function filterCategory(data, categories){
    var matches = []
    for (var i = 0; i < data.length; i++) {
      var match = findCategoryMatch(data[i], categories);
      if (match){
          matches.push(match);
      }
    }
    return matches;
  }
  function findCategoryMatch(object, categories){
    var arr_categories=categories.substr(0, categories.lastIndexOf(",")).split(",");
    for(var i=0;i<arr_categories.length;i++){
      if(object["category"].indexOf(arr_categories[i])>=0){
        return object;
      }
    }
  }
  function searchRepository (crit, category_filter) {
    if (crit.length==0) {
      if(category_filter.length>0 && category_filter!="all"){
        return filterCategory(data, category_filter);
      }
      else{ 
        return []
      }
    }
    return findMatches(filterCategory(data, category_filter), crit, opt)
  }
  
  
  function findMatches (data, crit, opt) {
    var matches = []
    for (var i = 0; i < data.length && matches.length < opt.limit; i++) {
      var match = findMatchesInObject(data[i], crit)
      if (match) {
        matches.push(match)
      }
    }
    return matches
  }
  
  function findMatchesInObject (obj, crit) {
    if (matches(obj["title"], crit)) {
      return obj
    }
  }

  function matches(str, crit) {
    if (!str) return false

    str = str.trim().toLowerCase()
    crit = crit.trim().toLowerCase()

    return crit.split(' ').filter(function (word) {
      return str.indexOf(word) >= 0
    }).length === crit.split(' ').length
  }
  
  //Show matches
  function search (query, category_filter) {
    emptyResultsContainer()
    render(searchRepository(query, category_filter), query)
  }

  function compile (data) {
    return options.searchResultTemplate.replace(/\{(.*?)\}/g, function (match, prop) {
      return data[prop] || match
    })
  }

  function render (results, query) {
    var len = results.length
    if (len === 0) {
      return appendToResultsContainer(options.noResultsText)
    }
    for (var i = 0; i < len; i++) {
      results[i].query = query
      appendToResultsContainer(compile(results[i]))
    }
  }

  //DOM
  function emptyResultsContainer () {
    options.resultsContainer.innerHTML = ''
  }

  function appendToResultsContainer (text) {
    options.resultsContainer.innerHTML += text
  }

  function registerInput () {
    options.searchInput.addEventListener('keyup', function (e) {
      if (isWhitelistedKey(e.which)) {
        emptyResultsContainer()
        search(e.target.value, filtro)
      }
    })
  }
 
  //utils
  function merge (defaultParams, mergeParams) {
    var mergedOptions = {}
    for (var option in defaultParams) {
      mergedOptions[option] = defaultParams[option]
      if (typeof mergeParams[option] !== 'undefined') {
        mergedOptions[option] = mergeParams[option]
      }
    }
    return mergedOptions
  }
  
  function isJSON (json) {
    try {
      if (json instanceof Object && JSON.parse(JSON.stringify(json))) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  function isWhitelistedKey (key) {
    return [13, 16, 20, 37, 38, 39, 40, 91].indexOf(key) === -1
  }

  function throwError (message) {
    throw new Error('SimpleJekyllSearch --- ' + message)
  }
})(window)

}());
