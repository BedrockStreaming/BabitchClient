/* global Fixtures */
/* jshint camelcase: false */
'use strict';

describe('Service: babitchStats', function() {

    // load the service's module
    beforeEach(module('babitchFrontendApp'));

    // instantiate service
    var babitchStatsService,
        stats,
        httpMock,
        config;

    beforeEach(inject(function(babitchStats, $httpBackend, CONFIG) {
        babitchStatsService = babitchStats;
        httpMock = $httpBackend;
        config = CONFIG;

        httpMock.whenGET(config.BABITCH_WS_URL + '/players').respond(Fixtures.players);
        httpMock.whenGET(config.BABITCH_WS_URL + '/games?page=1&per_page=100').respond(Fixtures.games);

        //Compute stats
        babitchStats.computeStats()
            .then(function() {
                stats = babitchStats.getStats();
            });

        //Flush the .query
        httpMock.flush();
    }));

    //make sure no expectations were missed in your tests.
    //(e.g. expectGET or expectPOST)
    afterEach(function() {
        httpMock.verifyNoOutstandingExpectation();
        httpMock.verifyNoOutstandingRequest();
    });

    it('should load all players', function() {
        expect(stats.playersList.length).toBe(22); //because index starting at 1
    });

    it('should load all games', function() {
        expect(stats.gamesList.length).toBe(3);
    });

    it('should generate stats for all players', function() {
        expect(stats.statsPlayers.length).toBe(22); //because index starting at 1
    });

    it('should generate matrix nodes for all players', function() {
        expect(stats.matrix.nodes.length).toBe(21); //because index starting at 0
    });

    it('should generate stats for all teams', function() {
        expect(stats.statsTeams.length).toBe(5); //5 different teams
    });

    it('should list correct match', function() {
        expect(stats.gamesList[0].blue_score).toBe(10);
        expect(stats.gamesList[0].red_score).toBe(9);

        expect(stats.gamesList[1].blue_score).toBe(10);
        expect(stats.gamesList[1].red_score).toBe(3);

        expect(stats.gamesList[2].blue_score).toBe(10);
        expect(stats.gamesList[2].red_score).toBe(6);
        //48 goals
    });

    it('should list calculate all game duration', function() {
        expect(stats.gamesList[0].duration).toBe(212);
        expect(stats.gamesList[1].duration).toBe(155);
        expect(stats.gamesList[2].duration).toBe(185);
    });

    it('should calculate team victory correctly', function() {
        expect(stats.statsTeams.length).toBe(5); //5 different teams
        expect(stats.statsTeams[0].victory).toBe(0);
        expect(stats.statsTeams[1].victory).toBe(2);
        expect(stats.statsTeams[2].victory).toBe(0);
        expect(stats.statsTeams[3].victory).toBe(0);
        expect(stats.statsTeams[4].victory).toBe(1);
    });

    it('should calculate team loose correctly', function() {
        expect(stats.statsTeams[0].loose).toBe(1);
        expect(stats.statsTeams[1].loose).toBe(0);
        expect(stats.statsTeams[2].loose).toBe(1);
        expect(stats.statsTeams[3].loose).toBe(1);
        expect(stats.statsTeams[4].loose).toBe(0);
    });

    it('should calculate team percentVictory correctly', function() {
        expect(stats.statsTeams[0].percentVictory).toBe(0);
        expect(stats.statsTeams[1].percentVictory).toBe(100);
        expect(stats.statsTeams[2].percentVictory).toBe(0);
        expect(stats.statsTeams[3].percentVictory).toBe(0);
        expect(stats.statsTeams[4].percentVictory).toBe(100);
    });

    it('should calculate team percentLoose correctly', function() {
        expect(stats.statsTeams[0].percentLoose).toBe(100);
        expect(stats.statsTeams[1].percentLoose).toBe(0);
        expect(stats.statsTeams[2].percentLoose).toBe(100);
        expect(stats.statsTeams[3].percentLoose).toBe(100);
        expect(stats.statsTeams[4].percentLoose).toBe(0);
    });

    it('should calculate team teamGoalaverage correctly', function() {
        expect(stats.statsTeams[0].teamGoalaverage).toBe(-4);
        expect(stats.statsTeams[1].teamGoalaverage).toBe(5.5);
        expect(stats.statsTeams[2].teamGoalaverage).toBe(-7);
        expect(stats.statsTeams[3].teamGoalaverage).toBe(-1);
        expect(stats.statsTeams[4].teamGoalaverage).toBe(1);
    });

    it('should calculate team goal correctly', function() {
        expect(stats.statsTeams[0].goal).toBe(4);
        expect(stats.statsTeams[1].goal).toBe(20);
        expect(stats.statsTeams[2].goal).toBe(3);
        expect(stats.statsTeams[3].goal).toBe(8);
        expect(stats.statsTeams[4].goal).toBe(9);
    });

    it('should calculate team owngoal correctly', function() {
        expect(stats.statsTeams[0].owngoal).toBe(0);
        expect(stats.statsTeams[1].owngoal).toBe(2);
        expect(stats.statsTeams[2].owngoal).toBe(0);
        expect(stats.statsTeams[3].owngoal).toBe(1);
        expect(stats.statsTeams[4].owngoal).toBe(1);
    });

    it('should calculate team average goal per game correctly', function() {
        expect(stats.statsTeams[0].avgGoalPerGame).toBe(4);
        expect(stats.statsTeams[1].avgGoalPerGame).toBe(10);
        expect(stats.statsTeams[2].avgGoalPerGame).toBe(3);
        expect(stats.statsTeams[3].avgGoalPerGame).toBe(8);
        expect(stats.statsTeams[4].avgGoalPerGame).toBe(9);
    });

    it('should calculate team game played', function() {
        expect(stats.statsTeams[0].gamePlayed).toBe(1);
        expect(stats.statsTeams[1].gamePlayed).toBe(2);
        expect(stats.statsTeams[2].gamePlayed).toBe(1);
        expect(stats.statsTeams[3].gamePlayed).toBe(1);
        expect(stats.statsTeams[4].gamePlayed).toBe(1);
    });

    it('should calculate team balls played', function() {
        expect(stats.statsTeams[0].ballsPlayed).toBe(16);
        expect(stats.statsTeams[1].ballsPlayed).toBe(29);
        expect(stats.statsTeams[2].ballsPlayed).toBe(13);
        expect(stats.statsTeams[3].ballsPlayed).toBe(19);
        expect(stats.statsTeams[4].ballsPlayed).toBe(19);
    });

    it('should calculate team percent goal per ball correctly', function() {
        expect(stats.statsTeams[0].percentGoalPerBall).toBe(25);
        expect(stats.statsTeams[1].percentGoalPerBall).toBe(69);
        expect(stats.statsTeams[2].percentGoalPerBall).toBe(23.1);
        expect(stats.statsTeams[3].percentGoalPerBall).toBe(42.1);
        expect(stats.statsTeams[4].percentGoalPerBall).toBe(47.4);
    });

    it('should calculate elo ranking for team correctly', function() {
        expect(stats.statsTeams[0].eloRanking).toBe(1475);
        expect(stats.statsTeams[1].eloRanking).toBe(1549);
        expect(stats.statsTeams[2].eloRanking).toBe(1464);
        expect(stats.statsTeams[3].eloRanking).toBe(1487);
        expect(stats.statsTeams[4].eloRanking).toBe(1538);
    });

    it('should do not forget one goal', function() {
        var nbGoal = stats.statsTeams[0].goal +
            stats.statsTeams[1].goal +
            stats.statsTeams[2].goal +
            stats.statsTeams[3].goal +
            stats.statsTeams[4].goal +
            stats.statsTeams[0].owngoal +
            stats.statsTeams[1].owngoal +
            stats.statsTeams[2].owngoal +
            stats.statsTeams[3].owngoal +
            stats.statsTeams[4].owngoal;
        expect(nbGoal).toBe(48);
    });


    it('should calculate player victory correctly', function() {
        expect(stats.statsPlayers[7].victory).toBe(0);
        expect(stats.statsPlayers[8].victory).toBe(3);
        expect(stats.statsPlayers[9].victory).toBe(2);
        expect(stats.statsPlayers[12].victory).toBe(1);
        expect(stats.statsPlayers[16].victory).toBe(0);
    });

    it('should calculate player loose correctly', function() {
        expect(stats.statsPlayers[7].loose).toBe(2);
        expect(stats.statsPlayers[8].loose).toBe(0);
        expect(stats.statsPlayers[9].loose).toBe(1);
        expect(stats.statsPlayers[12].loose).toBe(1);
        expect(stats.statsPlayers[16].loose).toBe(2);
    });

    it('should calculate player percentVictory correctly', function() {
        expect(stats.statsPlayers[7].percentVictory).toBe(0);
        expect(stats.statsPlayers[8].percentVictory).toBe(100);
        expect(stats.statsPlayers[9].percentVictory).toBe(66.7);
        expect(stats.statsPlayers[12].percentVictory).toBe(50);
        expect(stats.statsPlayers[16].percentVictory).toBe(0);
    });

    it('should calculate player percentLoose correctly', function() {
        expect(stats.statsPlayers[7].percentLoose).toBe(100);
        expect(stats.statsPlayers[8].percentLoose).toBe(0);
        expect(stats.statsPlayers[9].percentLoose).toBe(33.3);
        expect(stats.statsPlayers[12].percentLoose).toBe(50);
        expect(stats.statsPlayers[16].percentLoose).toBe(100);
    });

    it('should calculate player teamGoalaverage correctly', function() {
        expect(stats.statsPlayers[7].teamGoalaverage).toBe(-5.5);
        expect(stats.statsPlayers[8].teamGoalaverage).toBe(4);
        expect(stats.statsPlayers[9].teamGoalaverage).toBe(3.3);
        expect(stats.statsPlayers[12].teamGoalaverage).toBe(-3);
        expect(stats.statsPlayers[16].teamGoalaverage).toBe(-2.5);
    });


    it('should calculate player goal correctly', function() {
        expect(stats.statsPlayers[7].goal).toBe(1);
        expect(stats.statsPlayers[8].goal).toBe(17);
        expect(stats.statsPlayers[9].goal).toBe(16);
        expect(stats.statsPlayers[12].goal).toBe(6);
        expect(stats.statsPlayers[16].goal).toBe(4);
    });

    it('should calculate player owngoal correctly', function() {
        expect(stats.statsPlayers[7].owngoal).toBe(0);
        expect(stats.statsPlayers[8].owngoal).toBe(2);
        expect(stats.statsPlayers[9].owngoal).toBe(0);
        expect(stats.statsPlayers[12].owngoal).toBe(1);
        expect(stats.statsPlayers[16].owngoal).toBe(1);
    });

    it('should calculate player average goal per game correctly', function() {
        expect(stats.statsPlayers[7].avgGoalPerGame).toBe(0.5);
        expect(stats.statsPlayers[8].avgGoalPerGame).toBe(5.7);
        expect(stats.statsPlayers[9].avgGoalPerGame).toBe(5.3);
        expect(stats.statsPlayers[12].avgGoalPerGame).toBe(3);
        expect(stats.statsPlayers[16].avgGoalPerGame).toBe(2);
    });

    it('should calculate player game played', function() {
        expect(stats.statsPlayers[7].gamePlayed).toBe(2);
        expect(stats.statsPlayers[8].gamePlayed).toBe(3);
        expect(stats.statsPlayers[9].gamePlayed).toBe(3);
        expect(stats.statsPlayers[12].gamePlayed).toBe(2);
        expect(stats.statsPlayers[16].gamePlayed).toBe(2);
    });

    it('should calculate player balls played', function() {
        expect(stats.statsPlayers[7].ballsPlayed).toBe(29);
        expect(stats.statsPlayers[8].ballsPlayed).toBe(48);
        expect(stats.statsPlayers[9].ballsPlayed).toBe(48);
        expect(stats.statsPlayers[12].ballsPlayed).toBe(32);
        expect(stats.statsPlayers[16].ballsPlayed).toBe(35);
    });

    it('should calculate player percent goal per ball correctly', function() {
        expect(stats.statsPlayers[7].percentGoalPerBall).toBe(3.4);
        expect(stats.statsPlayers[8].percentGoalPerBall).toBe(35.4);
        expect(stats.statsPlayers[9].percentGoalPerBall).toBe(33.3);
        expect(stats.statsPlayers[12].percentGoalPerBall).toBe(18.8);
        expect(stats.statsPlayers[16].percentGoalPerBall).toBe(11.4);
    });

    it('should calculate elo ranking for players correctly', function() {
        expect(stats.statsPlayers[7].eloRanking).toBe(1451);
        expect(stats.statsPlayers[8].eloRanking).toBe(1574);
        expect(stats.statsPlayers[9].eloRanking).toBe(1524);
        expect(stats.statsPlayers[12].eloRanking).toBe(1501);
        expect(stats.statsPlayers[16].eloRanking).toBe(1450);
    });

    it('should calculate gameSeries for players correctly', function() {
        expect(stats.statsPlayers[7].gameSeries).toEqual(['L','L']);
        expect(stats.statsPlayers[8].gameSeries).toEqual(['W','W','W']);
        expect(stats.statsPlayers[9].gameSeries).toEqual(['W','W','L']);
        expect(stats.statsPlayers[12].gameSeries).toEqual(['L','W']);
        expect(stats.statsPlayers[16].gameSeries).toEqual(['L','L']);
    });

    it('should generate fakeId for each player', function() {
        expect(stats.statsPlayers[7].fakeId).toBe(6);
        expect(stats.statsPlayers[8].fakeId).toBe(7);
        expect(stats.statsPlayers[9].fakeId).toBe(8);
        expect(stats.statsPlayers[12].fakeId).toBe(11);
        expect(stats.statsPlayers[16].fakeId).toBe(15);
    });

    it('should calculate matrix for who played with who correctly', function() {
        expect(stats.matrix.whoPlayedWithWho).toEqual([
            { source : 15, target : 6, value : 1 },
            { source : 8, target : 7, value : 1 },
            { source : 6, target : 11, value : 1 },
            { source : 7, target : 8, value : 1 },
            { source : 8, target : 15, value : 1 },
            { source : 7, target : 11, value : 1 }
        ]);
    });

    it('should calculate matrix for who played against who correctly', function() {
        expect(stats.matrix.whoPlayedAgainstWho).toEqual([
            { source : 15, target : 8, value : 1 },
            { source : 15, target : 7, value : 1 },
            { source : 6, target : 8, value : 1 },
            { source : 6, target : 7, value : 1 },
            { source : 6, target : 7, value : 1 },
            { source : 6, target : 8, value : 1 },
            { source : 11, target : 7, value : 1 },
            { source : 11, target : 8, value : 1 },
            { source : 8, target : 7, value : 1 },
            { source : 8, target : 11, value : 1 },
            { source : 15, target : 7, value : 1 },
            { source : 15, target : 11, value : 1 }
        ]);
    });

    it('should calculate matrix for who beat who correctly', function() {
        expect(stats.matrix.whoBeatWho).toEqual([
            { source : 8, target : 6, value : 1 },
            { source : 8, target : 15, value : 1 },
            { source : 7, target : 6, value : 1 },
            { source : 7, target : 15, value : 1 },
            { source : 7, target : 11, value : 1 },
            { source : 7, target : 6, value : 1 },
            { source : 8, target : 11, value : 1 },
            { source : 8, target : 6, value : 1 },
            { source : 7, target : 15, value : 1 },
            { source : 7, target : 8, value : 1 },
            { source : 11, target : 15, value : 1 },
            { source : 11, target : 8, value : 1 } 
        ]);
    });

    it('should do not forget one goal', function() {
        var nbGoal = stats.statsPlayers[7].goal +
            stats.statsPlayers[8].goal +
            stats.statsPlayers[9].goal +
            stats.statsPlayers[12].goal +
            stats.statsPlayers[16].goal +
            stats.statsPlayers[7].owngoal +
            stats.statsPlayers[8].owngoal +
            stats.statsPlayers[9].owngoal +
            stats.statsPlayers[12].owngoal +
            stats.statsPlayers[16].owngoal;
        expect(nbGoal).toBe(48);
    });

    it('should calculate minGamePlayed correctly', function() {
        expect(stats.minGamePlayedPlayers).toBe(1);
        expect(stats.minGamePlayedTeams).toBe(1);
    });

});
