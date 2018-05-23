function observe_DOM (obj, callback) {
  if (window.MutationObserver) {
    // define a new observer
    let obs = new MutationObserver(function (mutations, observer) {
      if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
        callback();
      }
    });
    // have the observer observe foo for changes in children
    obs.observe(obj, {childList: true, subtree: true});
  } else {
    obj.addEventListener('DOMNodeInserted', callback, false);
    obj.addEventListener('DOMNodeRemoved', callback, false);
  }
}

if (/^https:\/\/www.google.[^\/]+\/search/.test(location.href)) {
  $.noConflict();
  // turn off SafeSearch
  if (location.search.indexOf('safe=off') < 0) {
    location.replace(location.href + '&safe=off');
  } else {
    // replace the href of thumbnail with a link to the original image
    jQuery(document).ready(function () {
      jQuery('._lyb>a').each(function (i, a) {
        if (!/imgurl=([^\&]+)/.test(a.href)) return;
        a.href = RegExp.$1;
        a.onmousedown = undefined;
        a.target = '_blank';
      });
      jQuery('.rg_l').each(function (i) {
        let id = 'img-link-' + i;
        if (document.getElementById(id)) return true;
        let img_url = decodeURIComponent(this.href.match(/url=[^&]+/)[0].match(/=.+/)[0].substr(1));
        //this.style.position = 'relative';
        jQuery(this.parentNode).append('<div style="background-color:white;position:absolute;top:0px" id="' + id + '" onclick="event.cancelBubble=true"><a href="' + img_url + '" target="_blank">Open image</a></div>')
      });
    });
  }
} else if (/^http:\/\/goods.ruten.com.tw\/item/.test(location.href)) {
  //jQuery(window).load(function () {
  jQuery(document).ready(function () {
    jQuery('img').each(function (i, e) {
      if (!e.src) {
        e.src = e.dataset['src'];
        jQuery(e).css({width: '100%', height: '100%'});
        jQuery(e.parentNode).removeClass('is-pending');
      }
    })
  });
} else if (/^https?:\/\/www\.tumblr\.com\/video/.test(location.href)) {
  window.onload = function () {
    let do_check = function () {
      let videos = document.getElementsByTagName('video');
      let video = videos[0];
      let video_shields = document.getElementsByClassName('vjs-big-play-button');
      if (!video_shields.length) {
        setTimeout(do_check, 1000);
      } else {
        while (video_shields.length) video_shields[0].remove();
        video.parentNode.onclick = function () {
          if (this.loaded) return;
          let node = this.firstChild.firstChild;
          if (!node) return;
          let src = node.src.replace(/\/\d+$/, '');
          console.log('Found video ' + src + ' at ' + location.href);
          document.body.innerHTML = '<video style="width:100%;height:100%;margin:0px" controls loop src="' + src + '"></video>';
          this.loaded = true;
        }
      }
    };
    do_check();
  }
} else if (/^https?:\/\/[^\.]+\.tumblr\.com/.test(location.href)
  || /^https:\/\/www\.patreon\.com/.test(location.href)) {
  let links_offset = 0;
  let posts_offset = 0;
  let get_target = function (url) {
    get_target.regex = get_target.regex || new RegExp('^https?://t\.umblr\.com/redirect');
    if (!get_target.regex.test(url)) return null;
    return decodeURIComponent(url.match(/z=[^&]+/)[0].substr(2));
  };
  let adjust_posts = function () {
    let links = document.getElementsByTagName('a');
    if (!links.length) return;
    for (let i = links_offset; i < links.length; i++) {
      let href = get_target(links[i].href);
      if (!href) continue;
      links[i].target = '_blank';
      links[i].href = href;
    }
    links_offset = links.length;
    let posts = document.getElementsByClassName('posts');
    for (let i = posts_offset; i < posts.length; i++) {
      observe_DOM(posts[i], adjust_posts);
    }
    posts_offset = posts.length;
  };
  let adj = function () {
    adjust_posts();
    adj.timer_id = setTimeout(adj, 1000);
  };
  adj();
  let adjust_posts2 = function () {
    clearTimeout(adj.timer_id);
    let links = document.getElementsByTagName('a');
    if (!links.length) return;
    for (let i = 0; i < links.length; i++) {
      let href = get_target(links[i].href);
      if (!href) continue;
      links[i].target = '_blank';
      links[i].href = href;
    }
  };
  window.onload = function () {
    clearTimeout(adj.timer_id);
    let posts = document.getElementById('posts');
    if (posts) observe_DOM(posts, adjust_posts2);
    adjust_posts2();
  };
} else if (/^https?:\/\/www\.pixiv\.net/.test(location.href)) {
  window.onload = function () {
    let links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
      if (links[i].href.indexOf('/jump.php') >= 0) {
        links[i].href = links[i].innerText;
      }
    }
  };
} else if (/^https?:\/\/video\.5278\.cc\//.test(location.href)) {
  let do_update = function () {
    let key = '5278.cc - ' + location.href.match(/id=[^&]+/)[0].substr(3);
    chrome.storage.local.get(key, function (items) {
      let title = items[key];
      if (title) {
        let a = document.getElementById('download-link');
        let ext = a.href.substr(0, a.href.indexOf('?')).match(/\.[^\.]+$/)[0];
        a.innerText = title;
        a.download = title + ext;
        chrome.storage.local.remove(key);
      } else {
        setTimeout(do_update, 1000);
      }
    });
  };
  let do_check = function () {
    let url, param = document.getElementsByName('flashvars')[0];
    if (param) {
      url = decodeURIComponent(param.value).match(/file=.+/)[0].substr(5);
      if (url) {
        let title = '';
        let end = url.indexOf('image=');
        if (end > 0) { url = url.substr(0, end - 1); }
        if (!/http/.test(url)) { url = 'http://' + location.host + url; }
        document.body.innerHTML = '<video style="width:100%;height:100%;margin:0px" controls loop src="' + url + '"></video>'
          + '<h2 style="position:absolute;top:0px;left:0px;margin:0px;"><a id="download-link" href="' + url
          + '" target="_blank">Waiting for title...</a></h2>';
        setTimeout(do_update, 1000);
      }
    } else {
      setTimeout(do_check, 1000);
    }
  };
  window.onload = function () {
    (function (w) {
      let arr = ['contextmenu', 'click', 'mousedown', 'mouseup'];
      for (let i = 0, x; x = arr[i]; i++) {
        if (w['on' + x]) w['on' + x] = null;
        w.addEventListener(x, function (e) {e.stopPropagation()}, true);
      }
    })(window);
    do_check();
  }
} else if (/^https?:\/\/hbo\.hboav\.com\/player\//.test(location.href)) {
  let updater, do_update = function () {
    let key = '5278.cc - ' + location.href.match(/id=[^&]+/)[0].substr(3);
    chrome.storage.local.get(key, function (items) {
      let title = items[key];
      if (title) {
        let a = document.getElementById('download-link');
        let ext = a.href.match(/\.[^\.]+$/)[0];
        a.innerText = title;
        a.download = title + ext;
        chrome.storage.local.remove(key);
        clearInterval(updater);
      }
    });
  };
  let checker, do_check = function () {
    let url = document.getElementsByClassName('jw-preview');
    if (!url.length) return;
    url = url[0].style['background-image'].match(/\/[^"]+/)[0];
    if (!url) return;
    let ext = url.substr(url.indexOf('/files/') + 7, 3);
    url = url.substr(0, url.lastIndexOf('.') + 1) + ext;
    if (!/\/\//.test(url)) { url = '//' + location.host + url; }
    document.body.innerHTML = '<video style="width:100%;height:100%;margin:0px" controls loop src="' + url + '"></video>'
      + '<h2 style="position:absolute;top:0px;left:0px;margin:0px;"><a id="download-link" href="' + url
      + '" target="_blank">Waiting for title...</a></h2>';
    clearInterval(checker);
    updater = setInterval(do_update, 1000);
  };
  window.onload = function () {
    (function (w) {
      let arr = ['contextmenu', 'click', 'mousedown', 'mouseup'];
      for (let i = 0, x; x = arr[i]; i++) {
        if (w['on' + x]) w['on' + x] = null;
        w.addEventListener(x, function (e) {e.stopPropagation()}, true);
      }
    })(window);
    checker = setInterval(do_check, 1000);
  }
} else if (/^http:\/\/www\.5278\.cc\/forum\.php/.test(location.href)) {
  window.onload = function () {
    let header = document.getElementsByClassName('ts')[0];
    let player = document.getElementById('allmyplayer');
    if (header && player) {
      let title = header.innerText.replace(/\s+/g, ' ').trim();
      let key = '5278.cc - ' + player.src.match(/id=[^&]+/)[0].substr(3);
      chrome.storage.local.set({[key]: title});
    }
  };
  // Cannot put the following code in the content script of the uploader extension
  // because that script is only loaded once per page and won't be loaded
  // when a new page is opened programatically in an iframe of the page
} else if (/^https:\/\/chan\.sankakucomplex\.com\/j?a?\/?post\/show\/\d+/.test(location.href)) {
  if (location.search.match(/download=([^&]+)/)) {
    window.stop();
    let urls_str = RegExp.$1;
    chrome.runtime.sendMessage(
      'boodphggedgghemdpdnepadfkohfadfg',
      {
        download: true,
        wait: 3000,
        urls: decodeURIComponent(urls_str).replace(/amp;/g, '')
      });
  }
}
