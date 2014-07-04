var drsounds = (function (exports) {
	var settings = {
		'artist': 'drsounds'
	};
	var API_URL = 'http://localhost:2828/api/v1';
	var Router = Backbone.Router.extend({
		'initialize': function () {
		},
		'routes': {
			'home': function () {
				
			},
			'page/:id': function (id) {
				$('section').hide();
				$('section#page').show();
				$.getJSON(API_URL + '/page/' + id + '/?format=json', function (object) {
					var divBiography = $('#page');
					renderSection(divBiography, object);
				});
			},
			'biography': function () {
				$('section').hide();
				$('section#biography').show();
				$.getJSON(API_URL + '/artist/' + settings.artist + '/?format=json', function (object) {
					var divBiography = $('#biography');
					renderSection(divBiography, object);
				});
				menuselect('biography');
			},
			'blog': function () {
		
				$('section').hide();
				$('section#blog').hide();
				menuselect('blog');
		
				$('#throbber').hide();
			},
			'music': function () {
		
				$('section').hide();
				$('section#music').hide();
				menuselect('music');
		
				$('#throbber').hide();
			},
			'': function () {
				$('section').hide();
				$('section').hide();
				$('#home').show();
				$.getJSON(API_URL + '/artist/' + settings.artist + '/?format=json', function (object) {
					var divBiography = $('#home');
					renderSection(divBiography, object);
				});
				menuselect('home');
				console.log("A");
				$('#throbber').hide();
			},
			'gigs': function () {
				menuselect('gigs');
			},
			'music/release/:id': function (id) {
				$('section').hide();
				menuselect('music');
				$('section#release').show();
				$.getJSON(API_URL + '/release/' + id + "/?format=json", function (object) {
					var release = $('#release');
					$('#throbber').hide();
					renderSection(release, object);
				});
			},
			
			'*notFound': function () {
				$('section').hide();
				$('#notfound').show();
				$('#throbber').fadeOut();
				menuselect(arguments[0].split('/')[0]);
			},
		}
	});
	
	function renderSection(section, data) {
		$.each(data, function (key, value) {
			console.log(key, value);
			$('[data-binding-html="' + key + '"]', section).html(value);
			$('[data-binding-src="' + key + '"]', section).attr('src', value);
			$('[data-binding-href="' + key + '"]', section).attr('href',value);
		});
	}
	
	function Entry(object, category, type) {
	  this.node = document.createElement('div');
	  $(this.node).addClass('col-md-6');
	  $(this.node).html('<div style="min-height:150px" class="entry"><div class="entry-content"><img width="94px" src="' + object.image + '" /><p><a href="/' + category + '/' + type + '/' + object.upc + '">' + object.name + '</p><span class="glyphicon glyphicon-play rf-power"></span><p class="rf-latest"></p></div></div></div>');
	  if (type == 'channel' && mashcast.channel != null && mashcast.channel.id == object.id) {
	    $('.rf-power', this.node).show();
	
	  } else {
	    $('.rf-power', this.node).hide();
	  }
	  var self = this;
	  // If type is a podcat, get the latest episode
	  if (type == 'podcast') {
	    $.ajax({
	      'method': 'GET',
	      'url': 'rss.php?url=' + encodeURI(object.url)
	    }).done(function (xmlDoc) {
	      try{
	        var item = xmlDoc.getElementsByTagName('item')[0];
	        var pubDate = item.getElementsByTagName('pubDate')[0].textContent;
	        console.log(pubDate);
	        $('.rf-latest', self.node).html('Latest episode: ' + pubDate);
	      } catch (e) {
	        $('.rf-latest', self.node).html("Error getting latest episode");
	      }
	    });
	  }
	};
	exports.Entry = Entry;
	
	
	
	
	function menuselect(id) {
		$('.navbar-nav li').each(function (i) {
			console.log(this);
			if ($(this).attr('data-section') == id) {
				$(this).addClass('active');
			} else {
				$(this).removeClass('active');
			}
		});
	}
	exports.menuselect = menuselect;
	
	var router = new Router();
	router.on('get', function () {
		alert(arguments);
		 menuselect(parts[1]);
	});
	Backbone.history.start({pushState: true});
	
	
	$(document).on("click", "a:not([data-bypass])", function(evt) {
	    // Get the anchor href and protcol
	    var href = $(this).attr("href");
	    var protocol = this.protocol + "//";
	
	    // Ensure the protocol is not part of URL, meaning its relative.
	    if (href && href.slice(0, protocol.length) !== protocol &&
	        href.indexOf("javascript:") !== 0) {
	      // Stop the default event to ensure the link will not cause a page
	      // refresh.
	      evt.preventDefault();
	
	      // `Backbone.history.navigate` is sufficient for all Routers and will
	      // trigger the correct events.  The Router's internal `navigate` method
	      // calls this anyways.
	      Backbone.history.navigate(href, true);
	    	
	    }
	});
	$(window).load(function () {
		$.getJSON(API_URL + '/release/?format=json', function (data) {
			// Get releases
			console.log(data);
			$('#release_feed').html("");
			$.each(data.objects, function (i, object) {
				var entry = new Entry(object, 'music', 'release');
				$('#release_feed').append(entry.node);
				if (i >= 6) {
					return false;
				}
			});
		});
	});
});
drsounds(window);
