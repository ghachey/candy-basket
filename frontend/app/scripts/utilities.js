'use strict';

/* Utilities */

/* Remove trailing empty tag if present */
var removeTrailingEmpty = function(arr) {
    if (arr.indexOf("") > -1) {
				arr.splice(arr.indexOf(""), 1);
    }
    return arr;
};

var sample_d = [
    {
	"candy_id": "bd79168f4137232c9714102a08000591",
	"tag": ["Ghislain", "Hachey", "Website"]
    },
    {
	"candy_id": "bd79168f4137232c9714102a08000592",
	"tag": ["Sarah", "pipp", "Website"]
    },
    {
	"candy_id": "bd79168f4137232c9714102a0800094d",
	"tag": ["Dan", "McGarry", "Hachey", "pipp", "Website1"]
    }
];

/**
 * This function takes an unreduce-like javascript object of the form below.

 {"tags_by_candies": [
   {
     "candy_id": "bd79168f4137232c9714102a08000591",
     "tag": ["Ghislain", "Hachey", "Website"]
   },
   {
     "candy_id": "bd79168f4137232c9714102a0800094d",
     "tag": ["Dan", "McGarry", "Website"]
   }
 ]}

 and returns a reduced (or aggregated) version as shown below.

 {"tags": [
   "Ghislain",
   "Hachey",
   "Website",
   "Dan",
   "confirm",
   "challenge",
   "surprise",
   ],
   "tags_counts": [
      {
        "count": 1,
        "word": "Ghislain"
      },
      {
        "count": 1,
        "word": "Hachey"
      },
      {
        "count": 2,
        "word": "Website"
      },
      {
        "count": 1,
        "word": "Dan"
      },
      {
        "count": 1,
        "word": "confirm"
      },
      {
        "count": 2,
        "word": "challenge"
      },
      {
        "count": 1,
        "word": "surprise"
      }
    ]
  }

 I am certainly no fan of how I wrote this in a semi-functional semi-imperative
 style but get it to work first right :)

 */
var getTagsData = function(data, cutoff) {

    var tags        = [];
    var tags_counts = [];
    var start       = {"tags": tags, "tags_counts": tags_counts};
		var subset      = [];

		cutoff  = typeof cutoff  !== 'undefined' ? cutoff  : 0;

    var incWordCount = function(tags_counts, tag) {
				tags_counts.forEach(function(elem) {
						if (_.isEqual(elem.word,tag)) {
								elem.count++;
								return;
						}
				});
    };

		data.forEach(function(item){
			var comp_date = new Date(Date.parse(item.date));
			if (comp_date >= cutoff){
					subset.push(item);
			}
		});

		if (subset.length < 1){
//				console.debug ("Nothing here...");
				return start;
		}

    /**
			 Reduce from input data to desired output.
    */
    var result = _.reduce(subset, function(memory,object) {

				var candy_tags = object.tag;
				var processed  = {};

				// Go through array of tags of current object being reduced
				candy_tags.forEach(function(tag) {
						// Add tag if not present
						if (!_.contains(memory.tags, tag)) {
								tags.push(tag);
								tags_counts.push({"count": 1, "word": tag});
								processed = {
										"tags": tags,
										"tags_counts": tags_counts
								};
						} else { // Update its count if present
								incWordCount(tags_counts,tag);
								processed =  {
										"tags": tags,
										"tags_counts": tags_counts
								};
						}
						});
				return processed;
    }, start);

//		console.debug("Results: ", result);
		return result;
};

var getCandyCount = function (candies){

		var count = 0;

		candies.forEach(function(item){
			var comp_date = new Date(Date.parse(item.date));
				if (comp_date >= cutoff){
						count++;
				}
		});

		return count;

}


/**
 * Utility to check whether an object is an array or not
 */
var isArray = function(obj) {
    if( Object.prototype.toString.call( obj ) === '[object Array]' ) {
	return true;
    }
    return false;
}

// Normally shouldn't modify base objects I don't own. But fuck it,
// whoever works on this code base will have to pay attention so I can
// get my convenient and clear methods :)

String.prototype.endsWith = function (s) {
    return this.length >= s.length && this.substr(this.length - s.length) == s;
};

String.prototype.contains = function(s) {
    return this.indexOf(s) != -1;
};

var update_status_count = function(tag_data){

    var ccs_tag_status = [
				{'value':0,'type':'success'},
				{'value':0,'type':'danger'},
				{'value':0,'type':'warning'}
    ];

    var confirm = 0, challenge = 0, surprise = 0;
    var tag_counts = typeof tag_data.tags_counts !== 'undefined' ? tag_data.tags_counts : [];

    $.each(tag_counts, function(index,this_count){
				switch (this_count.word){
				case 'confirm':
						confirm+=this_count.count;
						break;
				case 'challenge':
						challenge+=this_count.count;
						break;
				case 'surprise':
						surprise+=this_count.count;
						break;
				default:
						break;
				}
    });

    var total = confirm + challenge + surprise;
		var precision = 1;
		var aggr = 0;

    if (total){
				$.each(ccs_tag_status, function(index, this_status){
						var num = 0;
						switch (this_status.type){
						case 'success':
								num = confirm/total;
								this_status.value = num.toPrecision(precision) * 100;
								break;
						case 'danger':
								num = challenge/total;
								this_status.value = num.toPrecision(precision) * 100;
								break;
						case 'warning':
								num = surprise/total;
								this_status.value = num.toPrecision(precision) * 100;
								break;
						}

						aggr += num.toPrecision(precision) * 100;

				});

				// I suck at math - fudge it.
				//console.debug("AGGR: " , aggr, ccs_tag_status);
				if (aggr > 100){
						ccs_tag_status[0].value -= (aggr - 100);
				}
				if (aggr < 100){
						ccs_tag_status[0].value += (100 - aggr);
				}

    }

    return ccs_tag_status;

}

var pluralise =  function(s, pl){
    var n= parseFloat(s);
    if(isNaN(n) || Math.abs(n)=== 1) return s;
    if(!pl) return s+'s';
    return s.replace(/\S+(\s*)$/, pl+'$1');
}
