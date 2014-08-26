'use strict';

/* Directives */

var directives = angular.module('nasaraCandyBasketApp');

directives.directive("tagcloud", function() {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      cloudData: '=',
      onClick: "&",
      onHover: "&"
    },
    link: function(scope, element, attrs) {

      var cloud_width = d3.select('div.tag-cloud').style('width');
      // Default values
      var margin = 20;
      var width = parseInt(cloud_width) - margin;
      var height = 200;
      var tags = [];

      // Little known fact: D3js requires a string to be returned the 'transform' attribute,
      // but you can't concatenate the string in the selection below; nor can you return a
      // string variable. The only thing that seems to work is a function that returns the
      // concatenated string. Oy Vay.
      var trans_x = Math.round(width/2).toString();
      var trans_y = Math.round(height/2).toString();
      var my_transform = function () { return "translate(" + trans_x + "," + trans_y + ")"; };

      // set up initial svg object
      var cloud = d3.select('svg');

      var defs = cloud.append("defs");

      // create filter with id #drop-shadow
      // height=130% so that the shadow is not clipped
      var filter = defs.append("filter")
	    .attr("id", "drop-shadow")
	    .attr("height", "130%");

      // SourceAlpha refers to opacity of graphic that this filter will be applied to
      // convolve that with a Gaussian with standard deviation 3 and store result
      // in blur
      filter.append("feGaussianBlur")
	.attr("in", "SourceAlpha")
	.attr("stdDeviation", 5)
	.attr("result", "blur");

      // translate output of Gaussian blur to the right and downwards with 2px
      // store result in offsetBlur
      filter.append("feOffset")
	.attr("in", "blur")
	.attr("dx", 5)
	.attr("dy", 5)
	.attr("result", "offsetBlur");

      // overlay original SourceGraphic over translated blurred opacity by using
      // feMerge filter. Order of specifying inputs is important!
      var feMerge = filter.append("feMerge");

      feMerge.append("feMergeNode")
	.attr("in", "offsetBlur")
      feMerge.append("feMergeNode")
	.attr("in", "SourceGraphic");

      scope.$watch('cloudData', function (newCloudData, oldCloudData) {

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
	d3.layout.cloud().size([width, height])
	  .words(tags.map(function(d) {
	    return {text: d.word, size: 6 + d.count * 10};
	  }))
	  .padding(1)
	  .rotate(function() { return 0; })
	  .font("arial")
	  .fontSize(function(d) { return d.size; })
	  .on("end", draw)
	  .start();

	function draw(words) {
	  d3.selectAll('g').remove();
	  cloud = d3.select('svg')
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", my_transform)
	    .selectAll("text")
	    .data(words)
	    .enter().append("text")
	    .style("font-size", function(d) {
	      // Tweak the size down by a bit
	      //return (d.size - (Math.floor(d.size/10))) + "px";
	      // ...or not...
	      return (d.size + "px");
	    })
	    .style("font-family", "'helvetica neue',helvetica,arial,san-serif")
	    .style("fill", function(d, i) {
	      return fill(i);
	    })
	    .style( 'opacity', 0 )
          //												.style("filter", "url(#drop-shadow)")
	    .attr("text-anchor", "middle")
	    .attr("transform", function(d) {
	      return "translate(" + [d.x, d.y] +
		")rotate(" + d.rotate + ")";
	    })
	    .text(function(d) { return d.text; })
	    .on("click",function(d){
              scope.onClick({element: d});
	    })
	    .on("mouseover",function(d){
              scope.onHover({element: d});
	    });

	  d3.selectAll('text').style('opacity', 0).transition().duration(200).style('opacity', 0.8);
	  d3.selectAll('div.tag-cloud').style('opacity', 0).transition().duration(200).style('opacity', 0.7);

	}

      });
    }
  };

});

/**
 * This directive started based on the work of Chris Pittman
 * https://github.com/chrispittman/angular-taglist
 * but is quickly diverging to fit our needs..
 **/
directives.directive('taglist', ['$timeout', function ($timeout) {

  return {
    restrict: 'EA',
    replace: true,
    scope: {
      tagData: '=',
      taglistBlurTimeout: '='
    },
    transclude: true,
    template:
    '<div class="taglist">\
      <span class="tag" data-ng-repeat="tag in tagData" ng-class="{confirm: \'{{tag}}\' === \'confirm\', challenge: \'{{tag}}\' === \'challenge\', surprise: \'{{tag}}\' === \'surprise\'}">\
      <a href data-ng-click="tagData.splice($index, 1)">x</a> <span>{{tag}}</span></span>\
      <div class="tag-input" ng-transclude></div><div class="tags_clear"></div></div>',
    compile: function (tElement, tAttrs, transcludeFn) {

      return function (scope, element, attrs) {

	// element[0] is <div class="taglist">...</div>

	// <input...>...</input> element
        var input = angular.element(element[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0]);

	// transforming template
        element.bind('click', function () {
          element[0].getElementsByTagName('input')[0].focus();
        });


        input.bind('keydown', function (e) {

	  if (e.altKey || e.metaKey ||
	      e.ctrlKey || e.shiftKey) {
            return;
	  }

	  if (e.which == 188 || e.which == 13) {
	    // 188 = comma, 13 = return
            e.preventDefault();
            addTag(this);
	  } else if (e.which == 8 /* 8 = delete */
		     && this.value.trim().length == 0
		     && element[0].getElementsByClassName('tag').length > 0) {
            e.preventDefault();
            scope.$apply(function () {
	      scope.tagData.splice(scope.tagData.length - 1, 1);
            });
	  }
        });

        function addTag(element) {
          if (!scope.tagData) {
            scope.tagData = [];
          }
          var val = element.value.trim();
          if (val.length === 0) {
            return;
          }
          if (scope.tagData.indexOf(val) >= 0) {
            return;
          }
          scope.$apply(function () {
            scope.tagData.push(val);
            element.value = "";
          });
        }
      };

    }
  };

}]);

directives.directive("welcometagcloud", function() {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      cloudData: '=',
      onClick: "&",
      onHover: "&"
    },
    link: function(scope, element, attrs) {

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
      var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

      // Default values
      var width = x;
      var height = y;
      var margin = 0;
      var tags = [];

      // set up initial svg object
      var cloud = d3.select('svg.welcome');

      scope.$watch('cloudData', function (newCloudData, oldCloudData) {

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

	var fill = d3.scale.category20();
	//var fill = d3.scale.log().range([500,1]);
	d3.layout.cloud().size([width, height])
	  .words(tags.map(function(d) {
	    return {text: d.word, size: 6 + d.count * 10};
	  }))
	  .padding(1)
	  .rotate(function() { return 0; })
	  .font("arial")
	  .fontSize(function(d) { return d.size; })
	  .on("end", draw)
	  .start();

	function draw(words) {

	  // Read the style rather than the attribute, because if the 'height' attribute
	  // is not explicitly set, it will be an empty string. The style is always present.
	  var footer_height = d3.select('.modal-footer').style('height');
	  height = height - parseInt(footer_height);

	  // Little known fact: D3js requires a string to be returned the 'transform' attribute,
	  // but you can't concatenate the string in the selection below; nor can you return a
	  // string variable. The only thing that seems to work is a function that returns the
	  // concatenated string. Oy Vay.
	  var trans_x = Math.round(x/2).toString();
	  var trans_y = Math.round(y/2).toString();
	  var my_transform = function () { return "translate(" + trans_x + "," + trans_y + ")"; };

	  d3.selectAll('svg.welcome g').remove();
	  cloud = d3.select('svg.welcome')
	    .attr("width", width)
	    .attr("height", height)
	    .attr("left", 0)
	    .attr("top", 0)
	    .append("g")
	    .attr("transform", my_transform())
	    .selectAll("text")
	    .data(words)
	    .enter().append("text")
	    .style("font-size", function(d) {
	      // Tweak the size down by a bit
	      //return (d.size - (Math.floor(d.size/5))) + "px";
	      // ...or not...
	      return (d.size + "px");
	    })
	    .style("font-family", "'helvetica neue',helvetica,arial,san-serif")
	    .style("fill", function(d, i) {
	      return fill(i);
	    })
	    .style( 'opacity', 0 )
	    .attr("text-anchor", "middle")
	    .attr("transform", function(d) {
	      return "translate(" + [d.x, d.y] +
		")rotate(" + d.rotate + ")";
	    })
	    .text(function(d) { return d.text; })
	    .on("click",function(d){
	      console.debug("CLICK");
              scope.onClick({element: d});
	    })
	    .on("mouseover",function(d){
              scope.onHover({element: d});
	    });
	  d3.selectAll('text').style('opacity', 0).transition().duration(2000).style('opacity', 1);

	  var flicker = function(){
	    console.debug("Flick");
	    d3.selectAll('text').each (function (){
	      var twitch = function (element){
		return function (element) {
		  d3.select(element).attr('opacity', 1).transition().delay(100).duration(500).attr('opacity', 0.5).each('end', function(){
		    d3.select(this).attr('opacity', 0.5).transition().delay(100).duration(500).attr('opacity', 1);
		  });
		};
	      };

	      function sleep(millis, callback) {
		setTimeout(function()
			   { callback(); }
			   , millis);
	      }

	      sleep(500, twitch(this));
	    });
	  };
	}
      });
    }
  };

});
