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
} else if (/^https?:\/\/[^\.]+\.tumblr\.com/.test(location.href)) {
  var links_offset = 0;
  var posts_offset = 0;
  var max_num_adj = 5;
  var adjust_posts = function () {
    var links = document.getElementsByTagName('a');
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
    var video_shields = document.getElementsByClassName('vjs-big-play-button');
    while (video_shields.length) video_shields[0].remove();
  };
  var run_adj = function () {
    if (max_num_adj-- <= 0)  return;
    adjust_posts();
    setTimeout(run_adj, 1000);
  };
  run_adj();
} else if (/^https?:\/\/www\.pixiv\.net/.test(location.href)) {
  window.onload = function () {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.indexOf('/jump.php') >= 0) {
        links[i].href = links[i].innerText;
      }
    }
  }
}
