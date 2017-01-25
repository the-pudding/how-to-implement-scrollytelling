
	// helper function so we can map over dom selection
	function selectionToArray(selection) {
		var len = selection.length
		var result = []
		for (var i = 0; i < len; i++) {
			result.push(selection[i])
		}
		return result
	}

	// throttle function
	// https://remysharp.com/2010/07/21/throttling-function-calls
	function throttle(fn, threshhold, scope) {
		threshhold || (threshhold = 250);
		var last,
		deferTimer;
		return function () {
			var context = scope || this;

			var now = +new Date,
			args = arguments;
			if (last && now < last + threshhold) {
				// hold on to it
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {
				last = now;
				fn.apply(context, args);
				}, threshhold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		};
	}

	// #2 ScrollMagic

	// #3 graph-scroll.js
	// depends on d3
	

	// #4 in-view.js


	// #5 ScrollStory
	

	// #6 - Custom
	

	function init() {
		waypoints()
		scrollmagic()
		graphscroll()
		inview()
		scrollstory()
		rollyourown()

		// hack to tell brower to resize since prism takes a second
		// to affect style/height
		setTimeout(function() {
			window.dispatchEvent(new Event('resize'))	
		}, 100)
	}

	init()
})()