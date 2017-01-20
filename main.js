function observe_DOM (obj, callback) {
  if (window.MutationObserver) {
    // define a new observer
    var obs = new MutationObserver(function (mutations, observer) {
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
        var id = 'img-link-' + i;
        if (document.getElementById(id)) return true;
        var img_url = decodeURIComponent(this.href.match(/url=[^&]+/)[0].match(/=.+/)[0].substr(1));
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
    var check = function () {
      var videos = document.getElementsByTagName('video');
      var video = videos[0];
      var video_shields = document.getElementsByClassName('vjs-big-play-button');
      if (!video_shields.length) {
        setTimeout(check, 1000);
      } else {
        while (video_shields.length) video_shields[0].remove();
        video.parentNode.onclick = function () {
          if (this.loaded) return;
          var node = this.firstChild.firstChild;
          if (!node) return;
          var src = node.src.replace(/\/\d+$/, '');
          console.log('Found video ' + src + ' at ' + location.href);
          document.body.innerHTML = '<video style="width:100%;height:100%;margin:0px" controls loop src="' + src + '"></video>';
          this.loaded = true;
        }
      }
    };
    check();
  }
} else if (/^https?:\/\/[^\.]+\.tumblr\.com/.test(location.href) || /^https:\/\/www\.patreon\.com/.test(location.href)) {
  var links_offset = 0;
  var posts_offset = 0;
  var max_num_adj = 5;
  var adjust_posts = function () {
    var links = document.getElementsByTagName('a');
    if (!links.length) return;
    for (var i = links_offset; i < links.length; i++) {
      if (links[i].href.indexOf('http://t.umblr.com/redirect') != 0) continue;
      var href = decodeURIComponent(links[i].href.match(/z=[^&]+/)[0].substr(2));
      links[i].target = '_blank';
      links[i].href = href;
    }
    links_offset = i;
    var posts = document.getElementsByClassName('posts');
    for (i = posts_offset; i < posts.length; i++) {
      observe_DOM(posts[i], adjust_posts);
    }
    posts_offset = i;
  };
  var adjust_posts2 = function () {
    var links = document.getElementsByTagName('a');
    if (!links.length) return;
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.indexOf('http://t.umblr.com/redirect') != 0) continue;
      var href = decodeURIComponent(links[i].href.match(/z=[^&]+/)[0].substr(2));
      links[i].target = '_blank';
      links[i].href = href;
    }
  };
  window.onload = function () {
    var posts = document.getElementById('posts');
    if (posts) observe_DOM(posts, adjust_posts2);
    adjust_posts2();
  };
  var run_adj = function () {
    if (max_num_adj-- <= 0)  return;
    adjust_posts();
    //setTimeout(run_adj, 1000);
  };
  run_adj();
} else if (false) {

} else if (/^https?:\/\/www\.pixiv\.net/.test(location.href)) {
  window.onload = function () {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.indexOf('/jump.php') >= 0) {
        links[i].href = links[i].innerText;
      }
    }
  };
} else if (/^https?:\/\/hbo\.hboav\.com\/api/.test(location.href)
  || /^https?:\/\/video\.5278\.cc\//.test(location.href)) {
  var update_title = function () {
    var key = '5278.cc - ' + location.href.match(/id=[^&]+/)[0].substr(3);
    chrome.storage.local.get(key, function (items) {
      var title = items[key];
      if (title) {
        var a = document.getElementById('download-link');
        var ext = a.href.substr(0, a.href.indexOf('?')).match(/\.[^\.]+$/)[0];
        a.innerText = title;
        a.download = title + ext;
        chrome.storage.local.remove(key);
      } else {
        setTimeout(update_title, 1000);
      }
    });
  };
  var check = function () {
    var url, param = document.getElementsByName('flashvars')[0];
    if (param) {
      url = decodeURIComponent(param.value).match(/file=.+/)[0].substr(5);
      if (url) {
        var title = '';
        var end = url.indexOf('image=');
        if (end > 0) { url = url.substr(0, end - 1); }
        if (!/http/.test(url)) { url = 'http://' + location.host + url; }
        document.body.innerHTML = '<video style="width:100%;height:100%;margin:0px" controls loop src="' + url + '"></video>'
          + '<h2 style="position:absolute;top:0px;left:0px;margin:0px;"><a id="download-link" href="' + url
          + '" target="_blank">Waiting for title...</a></h2>';
        setTimeout(update_title, 1000);
      }
    } else {
      setTimeout(check, 1000);
    }
  };
  window.onload = function () {
    check();
  }
} else if (/^http:\/\/www\.5278\.cc\/forum\.php/.test(location.href)) {
  window.onload = function () {
    var header = document.getElementsByClassName('ts')[0];
    var player = document.getElementById('allmyplayer');
    if (header && player) {
      var title = header.innerText.replace(/\s+/g, ' ').trim();
      var key = '5278.cc - ' + player.src.match(/id=[^&]+/)[0].substr(3);
      chrome.storage.local.set({[key]: title});
    }
  };
}
