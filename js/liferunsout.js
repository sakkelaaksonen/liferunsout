"use strict";
//Main module
var LifeRunsOut = (function() {

  //generic closured helpers
  function selectInputValue(e) {
    e.target.select();
  }

  function classNameforPlayers(playerCount) {
    return [
      'root',
      ' ',
      'players-',
      playerCount
    ].join('');
  }

  function defaultPlayerName(i) {
    return 'player' + i
  }


  //Player model/view
  var Player = function(name, life, poisons, render) {

    this.name = name || 'player1';
    this.id = this.name.replace(/w/, '_').toLowerCase();
    this.life = parseInt(life, 10) || 20; //TODO eval this properly
    this.poisons = poisons || 0;

    if (render) {
      this.render();
    }
    // _.bindAll(this,'down','up','load','render'.'bind','')
    return this;
  }

  Player.prototype = {
    down: function(amount) {
      amount = parseInt(amount, 10) || 1;
      this.life = (this.life - amount);
      this.render();
      return this.life;
      //or return this?
    },
    up: function(amount) {
      amount = parseInt(amount, 10) || 1;
      this.life = (this.life + amount);
      this.render();
      return this.life;
      //or return this?
    },
    dom: function getPlayerDOMRoot() {
      return document.querySelector('#' + this.id);
    },
    render: function renderPlayerDOM() {

      this.dom().querySelector('#' + this.id + '-life')
        .innerHTML = this.life;

      this.dom().querySelector('#' + this.id + '-name')
        .value = this.name;
    },
    bind: function() {
      var player = this;

      var dom = this.dom();

      dom.querySelector('#' + this.id + '-up')
        .addEventListener('touchend', function(event) {
          player.up();
        }, false);

      dom.querySelector('#' + this.id + '-up-more')
        .addEventListener('touchend', function(event) {
          player.up(5);
        }, false);

      dom.querySelector('#' + this.id + '-down-more')
        .addEventListener('touchend', function(event) {
          player.down(5);
        }, false);

      dom.querySelector('#' + this.id + '-life')
        .addEventListener('touchend', function(event) {
          player.down();
        }, false);

      var namefield = dom.querySelector('#' + this.id + '-name');

      namefield.addEventListener('keyup', function(event) {
        //for once,no need to throttle or wait for anything
        if (player.name !== event.target.value) {
          player.name = event.target.value;
        }
      }, false)

      namefield.addEventListener('focus', selectInputValue, false);

    }
  };

  //return main app module
  return _({
    players: {},
    init: function() {
      window.addEventListener('DOMContentLoaded', this.load, false);
    },
    load: function loadApplication() {

      this.playersDom().innerHTML = '';
      this.players = {};

      var playerCount = parseInt(
        document.querySelector('#numOfPlayers').value,
        10);

      var life = parseInt(document.querySelector('#playerLife').value, 10);
      var list = document.createElement('ul');

      document.querySelector('#app').className = classNameforPlayers(playerCount);

      var range = _.range(1, playerCount + 1)
      _(range).each(function createPlayer(n) {
        var player = new Player(defaultPlayerName(n), life);
        this.players[player.id] = player;
      }, this);

      list.innerHTML =
        ich.players({
          players: _.values(this.players)
        })

      this.playersDom().appendChild(list);
      _.each(this.players, function bindPlayer(player) {
        player.bind();
      });

      document.querySelector('#go')
        .addEventListener('click', this.load, false)

      document.querySelector('#numOfPlayers')
        .addEventListener('focus', selectInputValue, false);

      document.querySelector('#playerLife')
        .addEventListener('focus', selectInputValue, false);

      console.log('done');
    },
    dom: function getDomNodeDorApp() {
      return document.querySelector('#app');
    },
    playersDom: function getDomNodeForPlayers() {
      return document.querySelector('#players');
    },
    destroy: function endOfLife() {}
  }).bindAll('init', 'load');

})();
//Run when loaded
LifeRunsOut.init();