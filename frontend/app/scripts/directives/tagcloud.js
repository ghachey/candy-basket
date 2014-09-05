/* global d3 */

'use strict';

/**
 * @ngdoc directive
 * @name nasaraCandyBasketApp.directive:tagcloud
 * @description
 * # tagcloud
 */
angular.module('nasaraCandyBasketApp')
  .directive('tagcloud', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        cloudData: '=',
        onClick: '&',
        onHover: '&'
      },
      link: function(scope, element, attrs) {

        console.debug('Linking on: ', element, attrs);
 
        var cloudWidth = d3.select('div.tag-cloud').style('width');
        // Default values
        var margin = 20;
        var width = parseInt(cloudWidth) - margin;
        var height = 200;
        var tags = [];

        // Little known fact: D3js requires a string to be returned
        // the 'transform' attribute, but you can't concatenate the
        // string in the selection below; nor can you return a string
        // variable. The only thing that seems to work is a function
        // that returns the concatenated string. Oy Vay.
        /* jshint ignore:start */
        var trans_x = Math.round(width/2).toString();
        var trans_y = Math.round(height/2).toString();
        var my_transform = function () { 
          return 'translate(' + trans_x + ',' + trans_y + ')'; 
        };
        /* jshint ignore:end */

        // set up initial svg object
        var cloud = d3.select('svg');

        var defs = cloud.append('defs');

        // create filter with id #drop-shadow
        // height=130% so that the shadow is not clipped
        var filter = defs.append('filter')
	      .attr('id', 'drop-shadow')
	      .attr('height', '130%');

        // SourceAlpha refers to opacity of graphic that this filter
        // will be applied to convolve that with a Gaussian with
        // standard deviation 3 and store result in blur
        filter.append('feGaussianBlur')
	  .attr('in', 'SourceAlpha')
	  .attr('stdDeviation', 5)
	  .attr('result', 'blur');

        // translate output of Gaussian blur to the right and
        // downwards with 2px store result in offsetBlur
        filter.append('feOffset')
	  .attr('in', 'blur')
	  .attr('dx', 5)
	  .attr('dy', 5)
	  .attr('result', 'offsetBlur');

        // overlay original SourceGraphic over translated blurred
        // opacity by using feMerge filter. Order of specifying inputs
        // is important!
        var feMerge = filter.append('feMerge');

        feMerge.append('feMergeNode')
	  .attr('in', 'offsetBlur');
        feMerge.append('feMergeNode')
	  .attr('in', 'SourceGraphic');

        scope.$watch('cloudData', function (newCloudData) {

	  if(angular.isDefined(scope.cloudData)) {
	    tags = scope.cloudData;
	  }

	  // clear the elements inside of the directive
	  cloud.selectAll('*').remove();

	  // if undefined, exit
	  if (!newCloudData) {
	    return;
	  }

	  var fill = d3.scale.category20();
	  //var fill = d3.scale.log().range([500,1]);

	  function draw(words) {
	    d3.selectAll('g').remove();
	    cloud = d3.select('svg')
	      .attr('width', width)
	      .attr('height', height)
	      .append('g')
              /* jshint ignore:start */
	      .attr('transform', my_transform)
              /* jshint ignore:end */
	      .selectAll('text')
	      .data(words)
	      .enter().append('text')
	      .style('font-size', function(d) {
	        // Tweak the size down by a bit
	        //return (d.size - (Math.floor(d.size/10))) + 'px';
	        // ...or not...
	        return (d.size + 'px');
	      })
	      .style('font-family', '\'helvetica neue\',helvetica,arial,san-serif')
	      .style('fill', function(d, i) {
	        return fill(i);
	      })
	      .style( 'opacity', 0 )
            //												.style('filter', 'url(#drop-shadow)')
	      .attr('text-anchor', 'middle')
	      .attr('transform', function(d) {
	        return 'translate(' + [d.x, d.y] +
		  ')rotate(' + d.rotate + ')';
	      })
	      .text(function(d) { return d.text; })
	      .on('click',function(d){
                scope.onClick({element: d});
	      })
	      .on('mouseover',function(d){
                scope.onHover({element: d});
	      });

	    d3.selectAll('text').style('opacity', 0).transition().duration(200).style('opacity', 0.8);
	    d3.selectAll('div.tag-cloud').style('opacity', 0).transition().duration(200).style('opacity', 0.7);

	  }

	  d3.layout.cloud().size([width, height])
	    .words(tags.map(function(d) {
	      return {text: d.word, size: 6 + d.count * 10};
	    }))
	    .padding(1)
	    .rotate(function() { return 0; })
	    .font('arial')
	    .fontSize(function(d) { return d.size; })
	    .on('end', draw)
	    .start();

        });
      }
    };

  });
