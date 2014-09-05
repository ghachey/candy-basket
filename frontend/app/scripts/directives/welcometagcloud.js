/* global d3, $ */
'use strict';

/**
 * @ngdoc directive
 * @name nasaraCandyBasketApp.directive:welcometagcloud
 * @description
 * # welcometagcloud
 */
angular.module('nasaraCandyBasketApp')
  .directive('welcometagcloud', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        cloudData: '=',
        onClick: '&',
        onHover: '&'
      },
      link: function(scope, element, attrs) {

        console.debug('Directive element and attributes: ', scope, element, attrs);

        //Remove the visible dialog elements :-)
        $('.modal-content').css({
	  'background-color': 'transparent',
	  'background-clip': 'padding-box',
	  'border': '0'
        });
        $('.modal-dialog').css({
	  'width': '100%',
	  'margin': '0'
        });

        // Fill the window with a tag cloud
        var w=window, d=document, e=d.documentElement, 
            g=d.getElementsByTagName('body')[0],
            x=w.innerWidth || e.clientWidth || g.clientWidth,
            y=w.innerHeight || e.clientHeight || g.clientHeight;

        // Default values
        var width = x;
        var height = y;
        // var margin = 0; but never used
        var tags = [];

        // set up initial svg object
        var cloud = d3.select('svg.welcome');

        scope.$watch('cloudData', function (newCloudData) {

	  if(angular.isDefined(scope.cloudData)) {
	    tags = scope.cloudData;
	    //console.log(scope);
	  }

	  // clear the elements inside of the directive
	  cloud.selectAll('*').remove();

	  // if undefined, exit
	  if (!newCloudData) {
	    return;
	  }

	  function draw(words) {

	    // Read the style rather than the attribute, because if
	    // the 'height' attribute is not explicitly set, it will
	    // be an empty string. The style is always present.
	    var footerHeight = d3.select('.modal-footer').style('height');
	    height = height - parseInt(footerHeight);

	    // Little known fact: D3js requires a string to be
	    // returned the 'transform' attribute, but you can't
	    // concatenate the string in the selection below; nor can
	    // you return a string variable. The only thing that seems
	    // to work is a function that returns the concatenated
	    // string. Oy Vay.
            /* jshint ignore:start */
	    var trans_x = Math.round(x/2).toString();
	    var trans_y = Math.round(y/2).toString();
	    var my_transform = function () { return 'translate(' + trans_x + ',' + trans_y + ')'; };
            /* jshint ignore:end */

	    d3.selectAll('svg.welcome g').remove();
	    cloud = d3.select('svg.welcome')
	      .attr('width', width)
	      .attr('height', height)
	      .attr('left', 0)
	      .attr('top', 0)
	      .append('g')
              /* jshint ignore:start */
	      .attr('transform', my_transform())
              /* jshint ignore:end */
	      .selectAll('text')
	      .data(words)
	      .enter().append('text')
	      .style('font-size', function(d) {
	        // Tweak the size down by a bit
	        //return (d.size - (Math.floor(d.size/5))) + 'px';
	        // ...or not...
	        return (d.size + 'px');
	      })
	      .style('font-family', '\'helvetica neue\',helvetica,arial,san-serif')
	      .style('fill', function(d, i) {
	        return fill(i);
	      })
	      .style( 'opacity', 0 )
	      .attr('text-anchor', 'middle')
	      .attr('transform', function(d) {
	        return 'translate(' + [d.x, d.y] +
		  ')rotate(' + d.rotate + ')';
	      })
	      .text(function(d) { return d.text; })
	      .on('click',function(d){
	        console.debug('CLICK');
                scope.onClick({element: d});
	      })
	      .on('mouseover',function(d){
                scope.onHover({element: d});
	      });
	    d3.selectAll('text').style('opacity', 0).transition().duration(2000).style('opacity', 1);

            // Defined but never used
	    // var flicker = function(){
	    //   console.debug('Flick');
	    //   d3.selectAll('text').each (function (){
	    //     var twitch = function (element){
	    //       return function (element) {
	    //         d3
            //           .select(element)
            //           .attr('opacity', 1)
            //           .transition()
            //           .delay(100)
            //           .duration(500)
            //           .attr('opacity', 0.5)
            //           .each('end', function(){
	    //             d3
            //               .select(this)
            //               .attr('opacity', 0.5)
            //               .transition()
            //               .delay(100)
            //               .duration(500)
            //               .attr('opacity', 1);
	    //           });
	    //       };
	    //     };

	    //     function sleep(millis, callback) {
	    //       setTimeout(function() { 
            //         callback(); 
            //       }, millis);
	    //     }

	    //     sleep(500, twitch(this));
	    //   });
	    // };

	  }

	  var fill = d3.scale.category20();
	  //var fill = d3.scale.log().range([500,1]);
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
