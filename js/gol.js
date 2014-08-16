var game_of_life = function(){
  
  var _board = [];
  var _container = $('.board');
  var _cycles = 0;
  var _length = 0;
  var _breadth = 0;
  //fresh board
  var _spawn = function(){
    _length = _get_random(10, 30);
    _breadth = _get_random(10, 50);
    var l_counter = 0;
    var b_counter = 0;
    for(;l_counter < _length; l_counter++){
      _board[l_counter] = [];
      for(b_counter = 0;b_counter < _breadth; b_counter++){
        _board[l_counter][b_counter] = _get_random(1, 0);
      }
    }
    _cycles++;
  };
  //paints board
  var _paint = function(){
    var row_content = "";
    _container.empty();
    for(l_counter = 0; l_counter < _length ; l_counter ++){
      row_content = $("<div class='row'></div>");
      for(b_counter = 0; b_counter < _breadth; b_counter ++){
        if(_board[l_counter][b_counter] == 1){
          row_content.append("<div class='live cell'></div>");
        }else{
          row_content.append("<div class='dead cell'></div>");
        }
      }
      _container.append(row_content);
    }
  };

  //proceeds to next cycle
  var _next = function(){
    var temp_board = [];
    var next_state;
    for(l_counter = 0; l_counter < _length ; l_counter ++){
      temp_board[l_counter] = [];
      for(b_counter = 0; b_counter < _breadth; b_counter ++){
        next_state = _get_next_state(l_counter, b_counter);
        temp_board[l_counter][b_counter] = next_state;
      }
    }
    _board = temp_board;
    _cycles++;
  };

  //next state for cell
  var _get_next_state = function(l, b){
    var l_count =  l - 1;
    var b_count = b - 1;
    var neighbor_count = [];
    var next_state = 0;
    neighbor_count['live'] = 0;
    neighbor_count['dead'] = 0;
    for(;l_count <= (l + 1); l_count++){
      if(_board[l_count] != undefined){
        for(b_count = (b - 1); b_count <= (b + 1); b_count++){
          if(_board[l_count][b_count] != undefined && !( l == l_count && b == b_count)){
            if(_board[l_count][b_count] == 1){
              neighbor_count['live']++; 
            }else{
              neighbor_count['dead']++;
            }
          }
        }
      }
    }
    if(_board[l][b] == 1){
      if(neighbor_count['live'] == 2 || neighbor_count['live'] == 3){
        next_state = 1;
      }
    }else{
      if(neighbor_count['live'] == 3){
        next_state = 1;
      }
    }
    return next_state;
  }

  var _get_random = function(max, min){
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  var _get_board_props = function(){
    return {
      cycle : _cycles,
      lenght : _length,
      breadth : _breadth
    }
  }

  return {
    init : function(){
      _spawn();
      _paint();
    },
    next : function(){
      _next();
      _paint();
    }
  }
};

//page behavior
(function(){

  var get_new_board = function(){
    return new game_of_life();
  }

  var resume_play = function(){
    $('.play').hide();
    $('.pause').show();
    si_promise = setInterval(function(){
      gol.next();
    }, 1000);
  }
  //button clicks
  $('.play').click(function(){
    resume_play();
  });

  $('.pause').click(function(){
    clearInterval(si_promise);
    $('.pause').hide();
    $('.play').show();
  });

  $('.respawn').click(function(){
    gol = get_new_board();//old one gc'd
    gol.init();
  });

  var gol = get_new_board();
  var si_promise = null;
  gol.init();
  resume_play();

})();