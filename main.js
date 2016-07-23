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
        console.log(a.href);
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
} else if (/^https:\/\/www\.tumblr\.com\/video/.test(location.href)) {
  window.onload = function () {
    var videos = document.getElementsByTagName('video');
    if (videos.length == 1) {
      var video = videos[0];
      video.parentNode.onclick = function () {
        if (this.loaded) return;
        this.loaded = true;
        var src = video.firstElementChild.src;
        src = src.replace(/\/\d+$/, '');
        console.log('Found video ' + src + ' at ' + location.href);
        document.body.innerHTML = '<video style="width:100%;height:100%;margin:0px" controls loop src="' + src + '"></video>';
      }
    }
  };
} else if (/^https?:\/\/[^\.]+\.tumblr\.com/.test(location.href)) {
  window.onload = function () {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.indexOf('http://t.umblr.com/redirect') != 0) continue;
      var href = decodeURIComponent(links[i].href.match(/z=[^&]+/)[0].substr(2));
      links[i].target = '_blank';
      links[i].href = href;
    }
  }
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
