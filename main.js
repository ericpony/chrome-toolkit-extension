if(/^https:\/\/www.google.[^\/]+\/search/.test(location.href)) {
	// turn off SafeSearch 
	if(location.search.indexOf('safe=off')<0) {
		location.replace(location.href + '&safe=off');
	}else {
		// replace the href of thumbnail with a link to the original image
		$(document).ready(function() {
    		console.log( "ready!" );
			$('._lyb>a').each(function(i,a) {
				if(!/imgurl=([^\&]+)/.test(a.href)) return;
				a.href = RegExp.$1;
				console.log(a.href);
				a.onmousedown = undefined;
				a.target = '_blank';
			});
		});
	}
}
