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
		var minR = 10
		var maxR = 24
		
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
			update: update,
		}
	}

	// using vanilla js here in case folks aren't fond of d3...
	function waypoints() {
		var selector = '.library__waypoints'
		var containerEl = document.querySelector(selector)
		var graphicEl = containerEl.querySelector('.graphic')
		var graphicVisEl = containerEl.querySelector('.graphic__vis')
		var triggerEls = containerEl.querySelectorAll('.trigger')

		// grab the margin so we can offset the vis when it becomes fixed
		var rightOffset = graphicEl.getBoundingClientRect().left + 'px'

		// this handles all our animations and stuff at each trigger
		// this can be whatever you want, but just know it does all the vis
		var graphic = createGraphic(selector)
		
		// setup a waypoint trigger for each trigger element
		for (var i = 0; i < triggerEls.length; i++) {
			new Waypoint({
				element: triggerEls[i], // our trigger element
				handler: function(direction) {
					// get the step, cast as number
					var step = +this.element.getAttribute('data-step')
					
					// if the direction is down then we use that number,
					// else, we want to trigger the previous one
					var nextStep = direction === 'down' ? step : Math.max(0, step - 1)
					
					// tell our graphic to update with a specific step
					graphic.update(nextStep)
				},
				offset: '50%',  // trigger halfway up the viewport
			})
		}

		// small function for handling all the class changes
		 // of entering/exiting
		var toggle = function(fixed, bottom) {
			if (fixed) {
				graphicVisEl.classList.add('is-fixed')
				graphicVisEl.style.right = rightOffset
			} else {
				graphicVisEl.classList.remove('is-fixed')
				graphicVisEl.style.right = 0
			}
			
			if (bottom) graphicVisEl.classList.add('is-bottom')
			else graphicVisEl.classList.remove('is-bottom')
		}

		// enter (top) / exit (bottom) graphic (toggle fixed position)
		var enterWaypoint = new Waypoint({
			element: graphicEl,
			handler: function(direction) {
				var fixed = direction === 'down'
				var bottom = false
				toggle(fixed, bottom)
			},
		})

		var exitWaypoint = new Waypoint({
			element: graphicEl,
			handler: function(direction) {
				var fixed = direction === 'up'
				var bottom = !fixed
				toggle(fixed, bottom)
			},
			offset: 'bottom-in-view', // waypoints convenience instead of a calculation
		})
	}

	function init() {
		waypoints()	
	}

	init()
})()