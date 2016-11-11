var games = [];
var urls = [];

function parseUrls(html){
	$(html).find('.pagination a').each(function(){
		if($(this).attr('href') != '#'){
			urls.push($(this).attr('href'));
		}
	})

	urls.pop(1);

	return urls;
}

function parseGames(html){
	$(html).find('.fixture').each(function(){
		games.push({
			teamA: 		$(this).find('.team.home').attr('title'),
			teamAGoals: $(this).find('.result .home').val(),
			teamBGoals: $(this).find('.result .away').val(),
			teamB: 		$(this).find('.team.away').attr('title'),
		})
	})
}

$.get(window.location.search, function(data){
	parseUrls(data);
	parseGames(data);
	var total = 1;
	if (urls.length == 0) {
		console.log(JSON.stringify(games));
	}
	for (var i = 0; i < urls.length; i++) {
		$.get(urls[i], function(delta){
			parseGames(delta);
			console.log(i,urls.length)
			if (total == urls.length) {
				console.log(JSON.stringify(games));
			}
			total++;
		})
	}
})