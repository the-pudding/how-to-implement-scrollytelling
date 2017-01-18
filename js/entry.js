(function() {
	// store some elements for later
	function createGraphic(librarySelector) {
		var container = d3.select(librarySelector)
		var graphicEl = container.select('.graphic')
		var graphicVisEl = graphicEl.select('.graphic__vis')
		var graphicProseEl = graphicEl.select('.graphic__prose')

		var margin = 20
		var size = 400
		var chartSize = size - margin * 2
		var scaleX = null
		var scaleR = null
		var data = [8, 6, 7, 5, 3, 0, 9]
		var extent = d3.extent(data)
		var minR = 8
		var maxR = 16
		
		// actions to take on each step of our scroll-driven story
		var steps = [
			function step0() {
				// circles are centered and small
				var t = d3.transition()
					.duration(800)
					.ease(d3.easeQuadInOut)
				    

				var item = graphicVisEl.selectAll('.item')
				
				item.transition(t)
					.attr('transform', translate(chartSize / 2, chartSize / 2))

				item.select('circle')
					.transition(t)
					.attr('r', minR)

				item.select('text')
					.transition(t)
					.style('opacity', 0)
			},

			function step1() {
				var t = d3.transition()
					.duration(800)
					.ease(d3.easeQuadInOut)
				
				// circles are positioned
				var item = graphicVisEl.selectAll('.item')
				
				item.transition(t)
					.attr('transform', function(d, i) {
						return translate(scaleX(i), chartSize / 2)
					})

				item.select('circle')
					.transition(t)
					.attr('r', minR)

				item.select('text')
					.transition(t)
					.style('opacity', 0)
			},

			function step2() {
				var t = d3.transition()
					.duration(800)
					.ease(d3.easeQuadInOut)

				// circles are sized
				var item = graphicVisEl.selectAll('.item')
				
				item.select('circle')
					.transition(t)
					.delay(function(d, i) { return i * 200 })
					.attr('r', function(d, i) {
						return scaleR(d)
					})

				item.select('text')
					.transition(t)
					.delay(function(d, i) { return i * 200 })
					.style('opacity', 1)
			},
		]

		// update our chart
		function update(step) {
			steps[step].call()
		}
		
		// little helper for string concat if using es5
		function translate(x, y) {
			return 'translate(' + x + ',' + y + ')'
		}

		function setupCharts() {
			var svg = graphicVisEl.append('svg')
				.attr('width', size + 'px')
				.attr('height', size + 'px')
			
			var chart = svg.append('g')
				.classed('chart', true)
				.attr('transform', 'translate(' + margin + ',' + margin + ')')

			scaleR = d3.scaleLinear()
			scaleX = d3.scaleBand()

			var domainX = d3.range(data.length)

			scaleX
				.domain(domainX)
				.range([0, chartSize])
				.padding(1)

			scaleR
				.domain(extent)
				.range([minR, maxR])

			var item = chart.selectAll('.item')
				.data(data)
				.enter().append('g')
					.classed('item', true)
					.attr('transform', translate(chartSize / 2, chartSize / 2))
			
			item.append('circle')
				.attr('cx', 0)
				.attr('cy', 0)

			item.append('text')
				.text(function(d) { return d })
				.attr('y', 1)
				.style('opacity', 0)
		}

		function setupProse() {
			var height = window.innerHeight * 0.5
			graphicProseEl.selectAll('.trigger')
				.style('height', height + 'px')
		}

		function init() {
			console.log('init')
			setupCharts()
			setupProse()
			update(0)
		}
		
		init()
		
		return {
			graphicEl: graphicEl,
			graphicVisEl: graphicVisEl, 
			graphicProseEl: graphicProseEl,
			update: update,
		}
	}

	function init() {
		var libSelector = '.library__waypoints'
		var g1 = createGraphic(libSelector)
		// using vanilla js here in case folks aren't fond of d3...

		// triggers
		var triggerEl = document.querySelectorAll('.library__waypoints .trigger')
		for (var i = 0; i < triggerEl.length; i++) {
			new Waypoint({
				element: triggerEl[i],
				handler: function(direction) {
					// get the step, cast as number
					var step = +this.element.getAttribute('data-step')
					
					// if the direction is down then we use that number,
					// else, we want to trigger the previous one
					// note: (never go lower than 0, since 0 is our first step)
					var nextStep = direction === 'down' ? step : Math.max(0, step - 1)
					
					g1.update(nextStep)
				},
				offset: '50%',
			})
		}

		// enter/exit
		
	}

	init()
})()