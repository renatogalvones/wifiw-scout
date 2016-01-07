  var temp = seasons['2015/2016'].championships.brasileirao2015;
  seasons = {};

  seasons['2015/2016'] = {
    championships: {
      brasileirao2015: temp
    }
  }

  var WIFIW = (function(seasons){
      var scout = {};

      var preventUndefined = function(obj, ret){
          ret = typeof(ret) === 'undefined' ? {} : ret;
          obj = typeof(obj) === 'undefined' ? ret : obj;
          return obj;
      }

      var parseSeasons = function(){
        for(var season in seasons){
          for(var champ in seasons[season].championships){
            if (typeof(seasons[season].championships[champ].coaches) === 'object'){
              var champs = seasons[season].championships;
              if (champ != 'coaches'){
                for(var game in champs[champ]){
                  if(game != 'coaches'){
                    var game = champs[champ][game];

                    var homeTeam = game.teamA;
                    var homeGoals = game.teamAGoals;
                    var awayTeam = game.teamB;
                    var awayGoals = game.teamBGoals;

                    // TIME DE CASA
                    var coachHome = teamToCoach(seasons[season].championships[champ],homeTeam);

                    registerGame(coachHome, season, champ, homeTeam, homeGoals, awayTeam, awayGoals);

                    // TIME DE FORA
                    var coachAway = teamToCoach(seasons[season].championships[champ],awayTeam);
                    registerGame(coachAway, season, champ, awayTeam, awayGoals, homeTeam, homeGoals);
                  }
                }
              }
            }else{
              console.log('NO COACHES: '+ season + ' ' + champ);
            } // end if there is coaches ?
          }
        }
      }

      var registerGame = function(coach, season, champ, homeTeam, homeGoals, awayTeam, awayGoals){
          scout[coach] = preventUndefined(scout[coach]);
          scout[coach].seasons = preventUndefined(scout[coach].seasons);
          scout[coach].seasons[season] = preventUndefined(scout[coach].seasons[season]);
          scout[coach].seasons[season] = preventUndefined(scout[coach].seasons[season]);
          scout[coach].seasons[season][champ] = preventUndefined(scout[coach].seasons[season][champ]);
          scout[coach].seasons[season][champ].games = preventUndefined(scout[coach].seasons[season][champ].games);
          scout[coach].seasons[season][champ].gamesTotal = preventUndefined(scout[coach].seasons[season][champ].gamesTotal,0);

          scout[coach].seasons[season][champ].games['game'+scout[coach].seasons[season][champ].gamesTotal] = {
              coachTeam: homeTeam,
              coachGoals: homeGoals,
              rivalTeam: awayTeam,
              rivalGoals: awayGoals
          };

          scout[coach].seasons[season][champ].gamesTotal++;
      }

      var teamToCoach = function(champObj, nameCoach){
          // console.log(champObj, nameCoach);
          var coachObj = champObj.coaches;
          var officialName = '';

          for(var nickname in coachObj){
              if (coachObj[nickname] == nameCoach){
                officialName = nickname;
                // console.log('DEU CERTO! ',champObj, nameCoach);
                break;
              };
          }
          if(officialName === ''){
            console.log('DEU BOSTA', champObj, nameCoach);
          };

          return officialName;
      }

      var makeStats = function(){
          for(var coach in scout){
            for(var season in scout[coach].seasons){
              for(var champ in scout[coach].seasons[season]){
                scout[coach].rivals = preventUndefined(scout[coach].rivals);
                scout[coach].resume = preventUndefined(scout[coach].resume);
                scout[coach].resume.games = preventUndefined(scout[coach].resume.games, 0);
                scout[coach].resume.wins = preventUndefined(scout[coach].resume.wins, 0);
                scout[coach].resume.losses = preventUndefined(scout[coach].resume.losses, 0);
                scout[coach].resume.draws = preventUndefined(scout[coach].resume.draws, 0);
                scout[coach].resume.goalsFor = preventUndefined(scout[coach].resume.goalsFor, 0);
                scout[coach].resume.goalsAgainst = preventUndefined(scout[coach].resume.goalsAgainst, 0);

                for(var game in scout[coach].seasons[season][champ].games){
                  scout[coach].resume.goalsFor += parseInt(scout[coach].seasons[season][champ].games[game].coachGoals);
                  scout[coach].resume.goalsAgainst += parseInt(scout[coach].seasons[season][champ].games[game].rivalGoals);

                  var rivalName = teamToCoach(scout[coach].seasons[season][champ],scout[coach].seasons[season][champ].games[game].rivalTeam);
                  if(rivalName == ''){ console.log(scout[coach].seasons[season][champ],scout[coach].seasons[season][champ].games[game].rivalTeam) }
                  // console.log(scout[coach].seasons[season].championships[champ], scout[coach].seasons[season].championships[champ].games[game],scout[coach].seasons[season])
                  var gameResult = defineResult(rivalName, scout[coach].seasons[season][champ].games[game],scout[coach]);

                }
              }
            }
          }
      }

      var defineResult = function(rivalName, game, obj){
        obj.rivals[rivalName] = preventUndefined(obj.rivals[rivalName]);
        obj.rivals[rivalName].games = preventUndefined(obj.rivals[rivalName].games, 0);
        obj.rivals[rivalName].wins = preventUndefined(obj.rivals[rivalName].wins, 0);
        obj.rivals[rivalName].losses = preventUndefined(obj.rivals[rivalName].losses, 0);
        obj.rivals[rivalName].draws = preventUndefined(obj.rivals[rivalName].draws, 0);
        obj.rivals[rivalName].goalsFor = preventUndefined(obj.rivals[rivalName].goalsFor, 0);
        obj.rivals[rivalName].goalsAgainst = preventUndefined(obj.rivals[rivalName].goalsAgainst, 0);

        obj.resume.games++;
        obj.rivals[rivalName].games++;

        obj.rivals[rivalName].goalsFor += parseInt(game.coachGoals);
        obj.rivals[rivalName].goalsAgainst += parseInt(game.rivalGoals);

        if(game.coachGoals > game.rivalGoals){
          ++obj.resume.wins;
          ++obj.rivals[rivalName].wins;
          return 1;
        }else if(game.coachGoals < game.rivalGoals){
          ++obj.resume.losses;
          ++obj.rivals[rivalName].losses;
          return 0;
        }else{
          ++obj.resume.draws;
          ++obj.rivals[rivalName].draws;
          return -1;
        }

      }

      var init = function(){
        parseSeasons();
        makeStats();
        console.log(scout)
      }

      return init();

  })(seasons);
