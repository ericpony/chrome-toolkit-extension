if(/^https:\/\/www.google.[^\/]+\/search/.test(location.href)) {
	$.noConflict();
	// turn off SafeSearch
	if(location.search.indexOf('safe=off')<0) {
		location.replace(location.href + '&safe=off');
	}else {
		// replace the href of thumbnail with a link to the original image
		jQuery(document).ready(function() {
			jQuery('._lyb>a').each(function(i,a) {
				if(!/imgurl=([^\&]+)/.test(a.href)) return;
				a.href = RegExp.$1;
				console.log(a.href);
				a.onmousedown = undefined;
				a.target = '_blank';
			});
			jQuery('.rg_l').each(function(i) {
				var id = 'img-link-' + i;
				if(document.getElementById(id)) return true;
				var imgurl = decodeURIComponent(this.href.match(/url=[^&]+/)[0].match(/=.+/)[0].substr(1));
				//this.style.position = 'relative';
				jQuery(this.parentNode).append('<div style="background-color:white;position:absolute;top:0px" id="' + id + '" onclick="event.cancelBubble=true"><a href="' + imgurl + '" target="_blank">Open image</a></div>')
			});
		});
	}
}
