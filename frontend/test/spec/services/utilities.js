'use strict';

describe('Service: utilities', function () {

  // load the service's module
  beforeEach(module('nasaraCandyBasketApp'));

  // instantiate service
  var utilities;
  beforeEach(inject(function (_utilities_) {
    utilities = _utilities_;
  }));

  it('should remove trailing empty tags if any', function () {
    var tags1 = ['tag1','tag2',''];
    var tags2 = ['tag1','tag2'];
    expect(utilities.removeTrailingEmpty(tags1)).toEqual(['tag1','tag2']);
    expect(utilities.removeTrailingEmpty(tags2)).toEqual(['tag1','tag2']);
  });

  it('should mashup tags counts', function () {
    var tagsByCandies = {'tagsByCandies': [
      {
        'candy_id': 'bd79168f4137232c9714102a08000591',
        'date': '2013-10-09T11:59:57Z',
        'tag': ['Ghislain', 'Hachey', 'Website', 'challenge']
      },
      {
        'candy_id': 'bd79168f4137232c9714102a0800094d',
        'date': '2013-10-10T11:59:08Z',
        'tag': ['Dan', 'McGarry', 'Website', 'surprise']
      }
    ]};
    var tagsCounts = {
      'tags': [
        'Ghislain',
        'Hachey',
        'Website',
        'challenge',
        'Dan',
        'McGarry',
        'surprise',
      ],
      'tagsCounts': [
        {
          'count': 1,
          'word': 'Ghislain'
        },
        {
          'count': 1,
          'word': 'Hachey'
        },
        {
          'count': 2,
          'word': 'Website'
        },
        {
          'count': 1,
          'word': 'challenge'
        },
        {
          'count': 1,
          'word': 'Dan'
        },
        {
          'count': 1,
          'word': 'McGarry'
        },
        {
          'count': 1,
          'word': 'surprise'
        }
      ]
    };
    expect(utilities.getTagsData(tagsByCandies.tagsByCandies)).toEqual(tagsCounts);
  });

  it('should check if string ends with other string', function () {
    expect(utilities.endsWith('Some string ending with', 'with')).toBe(true);
    expect(utilities.endsWith('Some string ending with', 'with ')).toBe(false);
    expect(utilities.endsWith('Some string ending with', 'h with')).toBe(false);
  });

  it('should check if string contains substring', function () {
    expect(utilities.contains('Some string containing', 'Some')).toBe(true);
    expect(utilities.contains('Some string containing', 'some')).toBe(false);
    expect(utilities.contains('Some string containing', 'oing c')).toBe(false);
    expect(utilities.contains('Some string containing', 'ing c')).toBe(true);
  });     

  it('should compare object date fields returning -1, 0 or 1', function () {
    var obj1 = {'title': 'Some title', 'date': new Date('1995-12-17T03:24:01')};
    var obj2 = {'title': 'Some title', 'date': new Date('1995-12-17T03:24:00')};
    var obj3 = {'title': 'Some title', 'date': new Date('1996-12-17T03:24:00')};
    var obj4 = {'title': 'Some title', 'date': new Date('1997-12-17T03:24:00')};
    var obj5 = {'title': 'Some title', 'date': new Date('1995-12-17T03:23:01')};
    expect(utilities.compareByDates(obj1, obj2)).toBe(1);
    expect(utilities.compareByDates(obj2, obj3)).toBe(-1);
    expect(utilities.compareByDates(obj2, obj2)).toBe(0);
    expect(utilities.compareByDates(obj4, obj5)).toBe(1);
    expect(utilities.compareByDates(obj5, obj4)).toBe(-1);
    expect(utilities.compareByDates(obj2, obj5)).toBe(1);
    expect(utilities.compareByDates(obj5, obj2)).toBe(-1);
  });

  it('should calculate percentage of special tags', function () {
    var tagsCounts = {'tags':['schneier','surveillance','surprise','ict','dan','security','nsa','currency','economics','bitcoin','confirm','privacy','internet','activism','hacktivism','geopolitics','japan','china','senkaku','social media','health','poverty','stross','microsoft word','challenge','software','business','discussion starters','adb','dlink','networks','vanuatu','politics','policy','climate','science','development','foss','stallmann','png','world bank','finance','don polye','media','leaks','whistle blower','lending','facebook','eu','wikileaks','trade','web','society','candy basket'],'tagsCounts':[{'count':2,'word':'schneier'},{'count':15,'word':'surveillance'},{'count':6,'word':'surprise'},{'count':23,'word':'ict'},{'count':30,'word':'dan'},{'count':13,'word':'security'},{'count':2,'word':'nsa'},{'count':1,'word':'currency'},{'count':6,'word':'economics'},{'count':1,'word':'bitcoin'},{'count':19,'word':'confirm'},{'count':1,'word':'privacy'},{'count':6,'word':'internet'},{'count':1,'word':'activism'},{'count':1,'word':'hacktivism'},{'count':1,'word':'geopolitics'},{'count':1,'word':'japan'},{'count':2,'word':'china'},{'count':1,'word':'senkaku'},{'count':3,'word':'social media'},{'count':1,'word':'health'},{'count':1,'word':'poverty'},{'count':1,'word':'stross'},{'count':1,'word':'microsoft word'},{'count':4,'word':'challenge'},{'count':4,'word':'software'},{'count':1,'word':'business'},{'count':1,'word':'discussion starters'},{'count':1,'word':'adb'},{'count':1,'word':'dlink'},{'count':1,'word':'networks'},{'count':1,'word':'vanuatu'},{'count':1,'word':'politics'},{'count':4,'word':'policy'},{'count':1,'word':'climate'},{'count':1,'word':'science'},{'count':1,'word':'development'},{'count':1,'word':'foss'},{'count':1,'word':'stallmann'},{'count':1,'word':'png'},{'count':1,'word':'world bank'},{'count':2,'word':'finance'},{'count':1,'word':'don polye'},{'count':2,'word':'media'},{'count':1,'word':'leaks'},{'count':2,'word':'whistle blower'},{'count':1,'word':'lending'},{'count':1,'word':'facebook'},{'count':1,'word':'eu'},{'count':1,'word':'wikileaks'},{'count':1,'word':'trade'},{'count':1,'word':'web'},{'count':1,'word':'society'},{'count':1,'word':'candy basket'}]};
    var percentages = [{'value':70,'type':'success'},{'value':10,'type':'danger'},{'value':20,'type':'warning'}];
    expect(utilities.updateStatusCount(tagsCounts)).toEqual(percentages);
  });

  it('should process candies into TimelineJS ready object', function() {
    // Keeping the double quotes in string for convenience here
    /* jshint ignore:start */
    var candies = [
      {
        "_id": "03c0b670e5c56bfb461a76dcf700a467",
        "source": "http://thediplomat.com/2013/12/time-for-us-and-china-to-establish-maritime-rules-of-the-road/",
        "title": "Time for US and China to Establish Maritime Rules",
        "description": "<p>So far, there's been no repeat of the 2001 collision. But with tensions rising some understanding is need.</p>",
        "tags": [
          "confirm",
          "china",
          "geopolitics",
          "trevz",
          "usa"
        ],
        "date": "2013-12-04T19:53:45Z",
        "private": false
      },
      {
        "_id": "03c0b670e5c56bfb461a76dcf700af8f",
        "source": "http://thediplomat.com/2013/12/chinas-adiz-and-the-japan-us-response/",
        "title": "China’s ADIZ and the Japan-US response",
        "description": "<p>Japan and the U.S&gt; will need to carefully calibrate their response to China's new Air Defense identification Zone.</p>",
        "tags": [
          "confirm",
          "china",
          "geopolitics",
          "japan",
          "trevz",
          "usa"
        ],
        "date": "2013-12-09T10:42:40Z",
        "private": false
      },
      {
        "_id": "e8e46cd3bd5ce73245ad5829d8000f62",
        "source": "http://www.radioaustralia.net.au/international/radio/program/pacific-beat/the-pacific-feeling-the-effects-of-the-us-government-shutdown/1203382",
        "title": "The Pacific feeling the effects of the US Government shutdown",
        "description": "<p>The Pacific feeling the effects of the US Government shutdown Updated 11 October 2013, 12:03 AEST</p>\n<p>As the government shutdown in the United States enters its 10th day, there's been a strong ripple effect throughout the Pacific.</p>\n\n<p>US territories like the Northern Mariana Islands, American Samoa and Guam have already started feeling the effects, while free associated states like Palau, the Marshall Islands and the Federated States of Micronesia also have cause for concern<br>.</p>",
        "tags": [
          "confirm",
          "american samoa",
          "buzz",
          "cnmi",
          "guam",
          "jen",
          "northern mariana islands",
          "shutdown",
          "us government shutdown",
          "usa"
        ],
        "date": "2013-10-14T11:36:22Z",
        "private": false
      },
      {
        "_id": "ea15c4646792dfd224c8748a881fa645",
        "source": "http://www.thenation.com/blog/176558/china-gains-us-loses-asia-power-play#",
        "title": "China Gains, US Loses in Asia Power Play",
        "description": "<p>The paralysis in Washington, brought to crisis levels by the Tea Party&ndash;led Republican shutdown, is having a crucial impact overseas, underlining the long-term decline of American influence abroad. The beneficiary: China, of course.</p>\n<p>Meanwhile, the US-led &ldquo;Doha Round&rdquo; trade talks and the long-running American effort to create an anti-China trade bloc, the Trans-Pacific Partnership (TPP) are both going nowhere fast. China, taking advantage of its clout in the region and America&rsquo;s decline, is proposing its own counter to the TPP, namely, the Regional Comprehensive Economic Partnership.</p>\n<p>The inevitable decline of American influence and power, of course, is not going to be reversed by US military shows of force, such as the dangerously misguided, counterproductive and reckless interventions in Libya and Somalia this week. That impresses no one, except perhaps gullible viewers of Fox News. In the real world, fewer and fewer people are taking America seriously.</p>\n<p>The most obvious result of the shutdown-cum-default crisis in Washington&mdash;which has drawn&nbsp;<a>alarmed reactions in both Tokyo and Beijing</a>&mdash;is that President Obama canceled his visit to Asia this week, including an important appearance at the Asia-Pacific Economic Cooperation (APEC) meeting in Indonesia, where in Obama&rsquo;s absence China&rsquo;s president, Xi Jinping, took center stage. As&nbsp;<a>the&nbsp;<em>New York Times</em>&nbsp;reported</a>, ruefully, Xi took over as &ldquo;the dominant leader at a gathering devoted to achieving greater economic integration,&rdquo; adding:</p>\n<blockquote>\n<p>Mr. Xi, the keynote speaker, delivered a long, tightly scripted speech that made no reference to Mr. Obama and concentrated on the theme of Chinese economic overhaul at home, and the need for China to have the Asia-Pacific region as a partner abroad.</p>\n</blockquote>\n<p>A&nbsp;<a>panicky-sounding editorial in&nbsp;<em>The New York Times</em></a>, noting that Xi &ldquo;grabbed the spotlight&rdquo; at APEC, added:</p>\n<blockquote>\n<p>The Republican-induced government shutdown and the party&rsquo;s threats to create another crisis next week over the debt ceiling are causing harm internationally as well as at home. They are undermining American leadership in Asia, impeding the functioning of the national security machinery, upsetting global markets and raising questions about the political dysfunction of a country that has long been the world&rsquo;s democratic standard-bearer.</p>\n</blockquote>\n<p>&nbsp;</p>",
        "tags": [
          "confirm",
          "apec",
          "china",
          "economics",
          "linda",
          "politics",
          "usa"
        ],
        "date": "2013-10-10T11:59:08Z",
        "private": false
      },
      {
        "_id": "ffb48ad6fc38984d0ba5d535fc000d4c",
        "source": "http://www.theverge.com/2013/12/8/5190600/wikileaks-releases-new-documents-exposing-secret-trans-pacific",
        "title": "WikiLeaks releases new documents exposing secret Trans-Pacific Partnership talks",
        "description": "<p id=\"paragraph0\" class=\"pgh-paragraph\">By <a class=\"author fn\" rel=\"nofollow\">Russell Brandom</a> on December 8, 2013 10:26 pm</p>\n<p class=\"pgh-paragraph\"> November, WikiLeaks published a rare draft of the secretive Trans-Pacific Partnership treaty — revealing the United States' covert international push for <a rel=\"nofollow\">stronger intellectual property rights</a>. Now, nearly a month after the first documents were published, the group is back on the case, publishing <a rel=\"nofollow\">a new raft of documents</a> from the TPP negotiations currently taking place in Singapore. The revelations are mostly the same, with the United States leading the charge for <a rel=\"nofollow\">SOPA-like penalties on file-sharing</a> and stringent patent reforms, but the new documents suggest that the public outcry against these proposals has had little effect on the negotiations.</p>\n<p id=\"paragraph1\" class=\"pgh-paragraph\">The leaks come at a particularly inconvenient time for negotiators, as they enter into their fourth day of talks in Singapore amid growing criticism. The talks are premised on secrecy, allowing countries to push for particular proposals without having to justify their positions publicly, but the continued pressure from WikiLeaks has brought unintended attention to the proceedings. These latest documents highlight the United States' role in the process, as it attempts to force the smaller nations to adopt more stringent rules. \"The US is exerting great pressure to close as many issues as possible this week,\" says a state-of-play summary included in the leaks. \"This pressure will increase with every passing day.\"</p>",
        "tags": [
          "confirm",
          "linda",
          "singapore",
          "tpp",
          "trans-pacific treaty",
          "usa"
        ],
        "date": "2013-12-12T10:48:22Z",
        "private": false
      },
      {
        "_id": "ffb48ad6fc38984d0ba5d535fc0013c1",
        "source": "http://www.nytimes.com/2013/12/10/world/asia/china-is-tied-to-spying-on-european-diplomats.html?ref=asia&_r=1&",
        "title": "The US and China's Common Interest: Cyber Spying",
        "description": "<p>The US and China's have very similar ideas on cyber space - anything goes.&nbsp;</p>",
        "tags": [
          "confirm",
          "china",
          "cyberspace",
          "internet",
          "trevz",
          "usa"
        ],
        "date": "2013-12-12T15:00:22Z",
        "private": false
      }
    ];

    var expectedTimeline = {
      "timeline": {
        "headline": "6 candies in this basket ",
        "type": "default",
        "text": "<p>Here is a timeline of your results...</p>",
        "date": [
          {
            "_id": "03c0b670e5c56bfb461a76dcf700a467",
            "startDate": "2013-12-04T19:53:45Z",
            "headline": "Time for US and China to Establish Maritime Rules",
            "text": "confirm,china,geopolitics,trevz,usa|ENDTAGS|<p>So far, there's been no repeat of the 2001 collision. But with tensions rising some understanding is need.</p>",
            "tag": "confirm",
            "asset": {
              "media": "http://thediplomat.com/2013/12/time-for-us-and-china-to-establish-maritime-rules-of-the-road/"
            }
          },
          {
            "_id": "03c0b670e5c56bfb461a76dcf700af8f",
            "startDate": "2013-12-09T10:42:40Z",
            "headline": "China’s ADIZ and the Japan-US response",
            "text": "confirm,china,geopolitics,japan,trevz,usa|ENDTAGS|<p>Japan and the U.S&gt; will need to carefully calibrate their response to China's new Air Defense identification Zone.</p>",
            "tag": "confirm",
            "asset": {
              "media": "http://thediplomat.com/2013/12/chinas-adiz-and-the-japan-us-response/"
            }
          },
          {
            "_id": "e8e46cd3bd5ce73245ad5829d8000f62",
            "startDate": "2013-10-14T11:36:22Z",
            "headline": "The Pacific feeling the effects of the US Government shutdown",
            "text": "confirm,american samoa,buzz,cnmi,guam,jen,northern mariana islands,shutdown,us government shutdown,usa|ENDTAGS|<p>The Pacific feeling the effects of the US Government shutdown Updated 11 October 2013, 12:03 AEST</p>\n<p>As the government shutdown in the United States enters its 10th day, there's been a strong ripple effect throughout the Pacific.</p>\n\n<p>US territories like the Northern Mariana Islands, American Samoa and Guam have already started feeling the effects, while free associated states like Palau, the Marshall Islands and the Federated States of Micronesia also have cause for concern<br>.</p>",
            "tag": "confirm",
            "asset": {
              "media": "http://www.radioaustralia.net.au/international/radio/program/pacific-beat/the-pacific-feeling-the-effects-of-the-us-government-shutdown/1203382"
            }
          },
          {
            "_id": "ea15c4646792dfd224c8748a881fa645",
            "startDate": "2013-10-10T11:59:08Z",
            "headline": "China Gains, US Loses in Asia Power Play",
            "text": "confirm,apec,china,economics,linda,politics,usa|ENDTAGS|<p>The paralysis in Washington, brought to crisis levels by the Tea Party&ndash;led Republican shutdown, is having a crucial impact overseas, underlining the long-term decline of American influence abroad. The beneficiary: China, of course.</p>\n<p>Meanwhile, the US-led &ldquo;Doha Round&rdquo; trade talks and the long-running American effort to create an anti-China trade bloc, the Trans-Pacific Partnership (TPP) are both going nowhere fast. China, taking advantage of its clout in the region and America&rsquo;s decline, is proposing its own counter to the TPP, namely, the Regional Comprehensive Economic Partnership.</p>\n<p>The inevitable decline of American influence and power, of course, is not going to be reversed by US military shows of force, such as the dangerously misguided, counterproductive and reckless interventions in Libya and Somalia this week. That impresses no one, except perhaps gullible viewers of Fox News. In the real world, fewer and fewer people are taking America seriously.</p>\n<p>The most obvious result of the shutdown-cum-default crisis in Washington&mdash;which has drawn&nbsp;<a>alarmed reactions in both Tokyo and Beijing</a>&mdash;is that President Obama canceled his visit to Asia this week, including an important appearance at the Asia-Pacific Economic Cooperation (APEC) meeting in Indonesia, where in Obama&rsquo;s absence China&rsquo;s president, Xi Jinping, took center stage. As&nbsp;<a>the&nbsp;<em>New York Times</em>&nbsp;reported</a>, ruefully, Xi took over as &ldquo;the dominant leader at a gathering devoted to achieving greater economic integration,&rdquo; adding:</p>\n<blockquote>\n<p>Mr. Xi, the keynote speaker, delivered a long, tightly scripted speech that made no reference to Mr. Obama and concentrated on the theme of Chinese economic overhaul at home, and the need for China to have the Asia-Pacific region as a partner abroad.</p>\n</blockquote>\n<p>A&nbsp;<a>panicky-sounding editorial in&nbsp;<em>The New York Times</em></a>, noting that Xi &ldquo;grabbed the spotlight&rdquo; at APEC, added:</p>\n<blockquote>\n<p>The Republican-induced government shutdown and the party&rsquo;s threats to create another crisis next week over the debt ceiling are causing harm internationally as well as at home. They are undermining American leadership in Asia, impeding the functioning of the national security machinery, upsetting global markets and raising questions about the political dysfunction of a country that has long been the world&rsquo;s democratic standard-bearer.</p>\n</blockquote>\n<p>&nbsp;</p>",
            "tag": "confirm",
            "asset": {
              "media": "http://www.thenation.com/blog/176558/china-gains-us-loses-asia-power-play#"
            }
          },
          {
            "_id": "ffb48ad6fc38984d0ba5d535fc000d4c",
            "startDate": "2013-12-12T10:48:22Z",
            "headline": "WikiLeaks releases new documents exposing secret Trans-Pacific Partnership talks",
            "text": "confirm,linda,singapore,tpp,trans-pacific treaty,usa|ENDTAGS|<p id=\"paragraph0\" class=\"pgh-paragraph\">By <a class=\"author fn\" rel=\"nofollow\">Russell Brandom</a> on December 8, 2013 10:26 pm</p>\n<p class=\"pgh-paragraph\"> November, WikiLeaks published a rare draft of the secretive Trans-Pacific Partnership treaty — revealing the United States' covert international push for <a rel=\"nofollow\">stronger intellectual property rights</a>. Now, nearly a month after the first documents were published, the group is back on the case, publishing <a rel=\"nofollow\">a new raft of documents</a> from the TPP negotiations currently taking place in Singapore. The revelations are mostly the same, with the United States leading the charge for <a rel=\"nofollow\">SOPA-like penalties on file-sharing</a> and stringent patent reforms, but the new documents suggest that the public outcry against these proposals has had little effect on the negotiations.</p>\n<p id=\"paragraph1\" class=\"pgh-paragraph\">The leaks come at a particularly inconvenient time for negotiators, as they enter into their fourth day of talks in Singapore amid growing criticism. The talks are premised on secrecy, allowing countries to push for particular proposals without having to justify their positions publicly, but the continued pressure from WikiLeaks has brought unintended attention to the proceedings. These latest documents highlight the United States' role in the process, as it attempts to force the smaller nations to adopt more stringent rules. \"The US is exerting great pressure to close as many issues as possible this week,\" says a state-of-play summary included in the leaks. \"This pressure will increase with every passing day.\"</p>",
            "tag": "confirm",
            "asset": {
              "media": "http://www.theverge.com/2013/12/8/5190600/wikileaks-releases-new-documents-exposing-secret-trans-pacific"
            }
          },
          {
            "_id": "ffb48ad6fc38984d0ba5d535fc0013c1",
            "startDate": "2013-12-12T15:00:22Z",
            "headline": "The US and China's Common Interest: Cyber Spying",
            "text": "confirm,china,cyberspace,internet,trevz,usa|ENDTAGS|<p>The US and China's have very similar ideas on cyber space - anything goes.&nbsp;</p>",
            "tag": "confirm",
            "asset": {
              "media": "http://www.nytimes.com/2013/12/10/world/asia/china-is-tied-to-spying-on-european-diplomats.html?ref=asia&_r=1&"
            }
          }
        ],
        "era": [
          {
            "startDate": new Date("2013-10-10T11:59:08.000Z"),
            "endDate": new Date("2013-12-12T15:00:22.000Z"),
            "headline": "Story duration",
            "text": "<p>hmmm</p>"
          }
        ]
      }
    };
    expect(utilities.processTimeline(candies)).toEqual(expectedTimeline);
    /* jshint ignore:end */
  });

  it('should return the correct date range for candies', function() {
    /*jshint ignore:start */
    var candies = [
      {
        "_id": "03c0b670e5c56bfb461a76dcf700a467",
        "source": "http://thediplomat.com/2013/12/time-for-us-and-china-to-establish-maritime-rules-of-the-road/",
        "title": "Time for US and China to Establish Maritime Rules",
        "description": "<p>So far, there's been no repeat of the 2001 collision. But with tensions rising some understanding is need.</p>",
        "tags": [
          "confirm",
          "china",
          "geopolitics",
          "trevz",
          "usa"
        ],
        "date": "2013-12-04T19:53:45Z",
        "private": false
      },
      {
        "_id": "03c0b670e5c56bfb461a76dcf700af8f",
        "source": "http://thediplomat.com/2013/12/chinas-adiz-and-the-japan-us-response/",
        "title": "China’s ADIZ and the Japan-US response",
        "description": "<p>Japan and the U.S&gt; will need to carefully calibrate their response to China's new Air Defense identification Zone.</p>",
        "tags": [
          "confirm",
          "china",
          "geopolitics",
          "japan",
          "trevz",
          "usa"
        ],
        "date": "2013-12-09T10:42:40Z",
        "private": false
      },
      {
        "_id": "e8e46cd3bd5ce73245ad5829d8000f62",
        "source": "http://www.radioaustralia.net.au/international/radio/program/pacific-beat/the-pacific-feeling-the-effects-of-the-us-government-shutdown/1203382",
        "title": "The Pacific feeling the effects of the US Government shutdown",
        "description": "<p>The Pacific feeling the effects of the US Government shutdown Updated 11 October 2013, 12:03 AEST</p>\n<p>As the government shutdown in the United States enters its 10th day, there's been a strong ripple effect throughout the Pacific.</p>\n\n<p>US territories like the Northern Mariana Islands, American Samoa and Guam have already started feeling the effects, while free associated states like Palau, the Marshall Islands and the Federated States of Micronesia also have cause for concern<br>.</p>",
        "tags": [
          "confirm",
          "american samoa",
          "buzz",
          "cnmi",
          "guam",
          "jen",
          "northern mariana islands",
          "shutdown",
          "us government shutdown",
          "usa"
        ],
        "date": "2013-10-14T11:36:22Z",
        "private": false
      },
      {
        "_id": "ea15c4646792dfd224c8748a881fa645",
        "source": "http://www.thenation.com/blog/176558/china-gains-us-loses-asia-power-play#",
        "title": "China Gains, US Loses in Asia Power Play",
        "description": "<p>The paralysis in Washington, brought to crisis levels by the Tea Party&ndash;led Republican shutdown, is having a crucial impact overseas, underlining the long-term decline of American influence abroad. The beneficiary: China, of course.</p>\n<p>Meanwhile, the US-led &ldquo;Doha Round&rdquo; trade talks and the long-running American effort to create an anti-China trade bloc, the Trans-Pacific Partnership (TPP) are both going nowhere fast. China, taking advantage of its clout in the region and America&rsquo;s decline, is proposing its own counter to the TPP, namely, the Regional Comprehensive Economic Partnership.</p>\n<p>The inevitable decline of American influence and power, of course, is not going to be reversed by US military shows of force, such as the dangerously misguided, counterproductive and reckless interventions in Libya and Somalia this week. That impresses no one, except perhaps gullible viewers of Fox News. In the real world, fewer and fewer people are taking America seriously.</p>\n<p>The most obvious result of the shutdown-cum-default crisis in Washington&mdash;which has drawn&nbsp;<a>alarmed reactions in both Tokyo and Beijing</a>&mdash;is that President Obama canceled his visit to Asia this week, including an important appearance at the Asia-Pacific Economic Cooperation (APEC) meeting in Indonesia, where in Obama&rsquo;s absence China&rsquo;s president, Xi Jinping, took center stage. As&nbsp;<a>the&nbsp;<em>New York Times</em>&nbsp;reported</a>, ruefully, Xi took over as &ldquo;the dominant leader at a gathering devoted to achieving greater economic integration,&rdquo; adding:</p>\n<blockquote>\n<p>Mr. Xi, the keynote speaker, delivered a long, tightly scripted speech that made no reference to Mr. Obama and concentrated on the theme of Chinese economic overhaul at home, and the need for China to have the Asia-Pacific region as a partner abroad.</p>\n</blockquote>\n<p>A&nbsp;<a>panicky-sounding editorial in&nbsp;<em>The New York Times</em></a>, noting that Xi &ldquo;grabbed the spotlight&rdquo; at APEC, added:</p>\n<blockquote>\n<p>The Republican-induced government shutdown and the party&rsquo;s threats to create another crisis next week over the debt ceiling are causing harm internationally as well as at home. They are undermining American leadership in Asia, impeding the functioning of the national security machinery, upsetting global markets and raising questions about the political dysfunction of a country that has long been the world&rsquo;s democratic standard-bearer.</p>\n</blockquote>\n<p>&nbsp;</p>",
        "tags": [
          "confirm",
          "apec",
          "china",
          "economics",
          "linda",
          "politics",
          "usa"
        ],
        "date": "2013-10-10T11:59:08Z",
        "private": false
      },
      {
        "_id": "ffb48ad6fc38984d0ba5d535fc000d4c",
        "source": "http://www.theverge.com/2013/12/8/5190600/wikileaks-releases-new-documents-exposing-secret-trans-pacific",
        "title": "WikiLeaks releases new documents exposing secret Trans-Pacific Partnership talks",
        "description": "<p id=\"paragraph0\" class=\"pgh-paragraph\">By <a class=\"author fn\" rel=\"nofollow\">Russell Brandom</a> on December 8, 2013 10:26 pm</p>\n<p class=\"pgh-paragraph\"> November, WikiLeaks published a rare draft of the secretive Trans-Pacific Partnership treaty — revealing the United States' covert international push for <a rel=\"nofollow\">stronger intellectual property rights</a>. Now, nearly a month after the first documents were published, the group is back on the case, publishing <a rel=\"nofollow\">a new raft of documents</a> from the TPP negotiations currently taking place in Singapore. The revelations are mostly the same, with the United States leading the charge for <a rel=\"nofollow\">SOPA-like penalties on file-sharing</a> and stringent patent reforms, but the new documents suggest that the public outcry against these proposals has had little effect on the negotiations.</p>\n<p id=\"paragraph1\" class=\"pgh-paragraph\">The leaks come at a particularly inconvenient time for negotiators, as they enter into their fourth day of talks in Singapore amid growing criticism. The talks are premised on secrecy, allowing countries to push for particular proposals without having to justify their positions publicly, but the continued pressure from WikiLeaks has brought unintended attention to the proceedings. These latest documents highlight the United States' role in the process, as it attempts to force the smaller nations to adopt more stringent rules. \"The US is exerting great pressure to close as many issues as possible this week,\" says a state-of-play summary included in the leaks. \"This pressure will increase with every passing day.\"</p>",
        "tags": [
          "confirm",
          "linda",
          "singapore",
          "tpp",
          "trans-pacific treaty",
          "usa"
        ],
        "date": "2013-12-12T10:48:22Z",
        "private": false
      },
      {
        "_id": "ffb48ad6fc38984d0ba5d535fc0013c1",
        "source": "http://www.nytimes.com/2013/12/10/world/asia/china-is-tied-to-spying-on-european-diplomats.html?ref=asia&_r=1&",
        "title": "The US and China's Common Interest: Cyber Spying",
        "description": "<p>The US and China's have very similar ideas on cyber space - anything goes.&nbsp;</p>",
        "tags": [
          "confirm",
          "china",
          "cyberspace",
          "internet",
          "trevz",
          "usa"
        ],
        "date": "2013-12-12T15:00:22Z",
        "private": false
      }
    ];
    /* jshint ignore:end */
    var expectedRange = [1381406348,1386860422];

    expect(utilities.getDateRange(candies)).toEqual(expectedRange);
  });

  it('should return the correct date range for unsorted candies', function() {
    /*jshint ignore:start */
    var unsortedCandies = [
      {
        "_id": "03c0b670e5c56bfb461a76dcf700af8f",
        "source": "http://thediplomat.com/2013/12/chinas-adiz-and-the-japan-us-response/",
        "title": "China’s ADIZ and the Japan-US response",
        "description": "<p>Japan and the U.S&gt; will need to carefully calibrate their response to China's new Air Defense identification Zone.</p>",
        "tags": [
          "confirm",
          "china",
          "geopolitics",
          "japan",
          "trevz",
          "usa"
        ],
        "date": "2013-12-09T10:42:40Z",
        "private": false
      },
      {
        "_id": "03c0b670e5c56bfb461a76dcf700a467",
        "source": "http://thediplomat.com/2013/12/time-for-us-and-china-to-establish-maritime-rules-of-the-road/",
        "title": "Time for US and China to Establish Maritime Rules",
        "description": "<p>So far, there's been no repeat of the 2001 collision. But with tensions rising some understanding is need.</p>",
        "tags": [
          "confirm",
          "china",
          "geopolitics",
          "trevz",
          "usa"
        ],
        "date": "2013-12-04T19:53:45Z",
        "private": false
      },
      {
        "_id": "e8e46cd3bd5ce73245ad5829d8000f62",
        "source": "http://www.radioaustralia.net.au/international/radio/program/pacific-beat/the-pacific-feeling-the-effects-of-the-us-government-shutdown/1203382",
        "title": "The Pacific feeling the effects of the US Government shutdown",
        "description": "<p>The Pacific feeling the effects of the US Government shutdown Updated 11 October 2013, 12:03 AEST</p>\n<p>As the government shutdown in the United States enters its 10th day, there's been a strong ripple effect throughout the Pacific.</p>\n\n<p>US territories like the Northern Mariana Islands, American Samoa and Guam have already started feeling the effects, while free associated states like Palau, the Marshall Islands and the Federated States of Micronesia also have cause for concern<br>.</p>",
        "tags": [
          "confirm",
          "american samoa",
          "buzz",
          "cnmi",
          "guam",
          "jen",
          "northern mariana islands",
          "shutdown",
          "us government shutdown",
          "usa"
        ],
        "date": "2013-10-14T11:36:22Z",
        "private": false
      },
      {
        "_id": "ffb48ad6fc38984d0ba5d535fc000d4c",
        "source": "http://www.theverge.com/2013/12/8/5190600/wikileaks-releases-new-documents-exposing-secret-trans-pacific",
        "title": "WikiLeaks releases new documents exposing secret Trans-Pacific Partnership talks",
        "description": "<p id=\"paragraph0\" class=\"pgh-paragraph\">By <a class=\"author fn\" rel=\"nofollow\">Russell Brandom</a> on December 8, 2013 10:26 pm</p>\n<p class=\"pgh-paragraph\"> November, WikiLeaks published a rare draft of the secretive Trans-Pacific Partnership treaty — revealing the United States' covert international push for <a rel=\"nofollow\">stronger intellectual property rights</a>. Now, nearly a month after the first documents were published, the group is back on the case, publishing <a rel=\"nofollow\">a new raft of documents</a> from the TPP negotiations currently taking place in Singapore. The revelations are mostly the same, with the United States leading the charge for <a rel=\"nofollow\">SOPA-like penalties on file-sharing</a> and stringent patent reforms, but the new documents suggest that the public outcry against these proposals has had little effect on the negotiations.</p>\n<p id=\"paragraph1\" class=\"pgh-paragraph\">The leaks come at a particularly inconvenient time for negotiators, as they enter into their fourth day of talks in Singapore amid growing criticism. The talks are premised on secrecy, allowing countries to push for particular proposals without having to justify their positions publicly, but the continued pressure from WikiLeaks has brought unintended attention to the proceedings. These latest documents highlight the United States' role in the process, as it attempts to force the smaller nations to adopt more stringent rules. \"The US is exerting great pressure to close as many issues as possible this week,\" says a state-of-play summary included in the leaks. \"This pressure will increase with every passing day.\"</p>",
        "tags": [
          "confirm",
          "linda",
          "singapore",
          "tpp",
          "trans-pacific treaty",
          "usa"
        ],
        "date": "2013-12-12T10:48:22Z",
        "private": false
      },
      {
        "_id": "ea15c4646792dfd224c8748a881fa645",
        "source": "http://www.thenation.com/blog/176558/china-gains-us-loses-asia-power-play#",
        "title": "China Gains, US Loses in Asia Power Play",
        "description": "<p>The paralysis in Washington, brought to crisis levels by the Tea Party&ndash;led Republican shutdown, is having a crucial impact overseas, underlining the long-term decline of American influence abroad. The beneficiary: China, of course.</p>\n<p>Meanwhile, the US-led &ldquo;Doha Round&rdquo; trade talks and the long-running American effort to create an anti-China trade bloc, the Trans-Pacific Partnership (TPP) are both going nowhere fast. China, taking advantage of its clout in the region and America&rsquo;s decline, is proposing its own counter to the TPP, namely, the Regional Comprehensive Economic Partnership.</p>\n<p>The inevitable decline of American influence and power, of course, is not going to be reversed by US military shows of force, such as the dangerously misguided, counterproductive and reckless interventions in Libya and Somalia this week. That impresses no one, except perhaps gullible viewers of Fox News. In the real world, fewer and fewer people are taking America seriously.</p>\n<p>The most obvious result of the shutdown-cum-default crisis in Washington&mdash;which has drawn&nbsp;<a>alarmed reactions in both Tokyo and Beijing</a>&mdash;is that President Obama canceled his visit to Asia this week, including an important appearance at the Asia-Pacific Economic Cooperation (APEC) meeting in Indonesia, where in Obama&rsquo;s absence China&rsquo;s president, Xi Jinping, took center stage. As&nbsp;<a>the&nbsp;<em>New York Times</em>&nbsp;reported</a>, ruefully, Xi took over as &ldquo;the dominant leader at a gathering devoted to achieving greater economic integration,&rdquo; adding:</p>\n<blockquote>\n<p>Mr. Xi, the keynote speaker, delivered a long, tightly scripted speech that made no reference to Mr. Obama and concentrated on the theme of Chinese economic overhaul at home, and the need for China to have the Asia-Pacific region as a partner abroad.</p>\n</blockquote>\n<p>A&nbsp;<a>panicky-sounding editorial in&nbsp;<em>The New York Times</em></a>, noting that Xi &ldquo;grabbed the spotlight&rdquo; at APEC, added:</p>\n<blockquote>\n<p>The Republican-induced government shutdown and the party&rsquo;s threats to create another crisis next week over the debt ceiling are causing harm internationally as well as at home. They are undermining American leadership in Asia, impeding the functioning of the national security machinery, upsetting global markets and raising questions about the political dysfunction of a country that has long been the world&rsquo;s democratic standard-bearer.</p>\n</blockquote>\n<p>&nbsp;</p>",
        "tags": [
          "confirm",
          "apec",
          "china",
          "economics",
          "linda",
          "politics",
          "usa"
        ],
        "date": "2013-10-10T11:59:08Z",
        "private": false
      },
      {
        "_id": "ffb48ad6fc38984d0ba5d535fc0013c1",
        "source": "http://www.nytimes.com/2013/12/10/world/asia/china-is-tied-to-spying-on-european-diplomats.html?ref=asia&_r=1&",
        "title": "The US and China's Common Interest: Cyber Spying",
        "description": "<p>The US and China's have very similar ideas on cyber space - anything goes.&nbsp;</p>",
        "tags": [
          "confirm",
          "china",
          "cyberspace",
          "internet",
          "trevz",
          "usa"
        ],
        "date": "2013-12-12T15:00:22Z",
        "private": false
      }
    ];
    /* jshint ignore:end */
    var expectedRange = [1381406348,1386860422];

    expect(utilities.getDateRange(unsortedCandies)).toEqual(expectedRange);
  });
});
