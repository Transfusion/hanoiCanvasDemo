$(document).ready(function(){
  canvas = document.getElementById('myCanvas');
  stage = new createjs.Stage(canvas);
  widths = [];
  xpos = [];
  diskHeight = 11;
  diskFills = ['#EB0202', '#EBAD02', '#E3EB02', '#31EB02', '#02EBE7'];
  game = [[],[],[]];
  gameIndices = [[],[],[]];
  showGameIndices = [[],[],[]];
  testMoves = [ [ 0, 1 ], [ 0, 2 ], [ 1, 2 ], [ 0, 1 ], [ 2, 0 ], [ 2, 1 ], [ 0, 1 ] ];
  fps = $('#fps').val();
  pps = $('#pps').val();
  var x = 150;
  for (var i = 0; i < 20; i++) {
    widths.unshift(x-=6);
  }

  $('#clearcanvas').click(function(){
    stopGame();
    clearGame();
    console.log(game);
  });
  $('#diskno').change(function() {
    stopGame();
    clearGame();
    $('#moves').empty();
    drawStartStack(parseInt($('#diskno').val()), (parseInt($('#startpeg').val())-1));
  });
  $('#startpeg').change(function() {
    stopGame();
    clearGame();
    $('#moves').empty();
    drawStartStack(parseInt($('#diskno').val()), (parseInt($('#startpeg').val())-1));
    populateDestPeg();
  });

  $('#destpeg').change(function() {
    $('#moves').empty();
  });
  $('#hanoi').click(function(){
    stopGame();
    clearGame();
    drawStartStack(parseInt($('#diskno').val()), (parseInt($('#startpeg').val())-1));
    animatewrapper();
  });

  $('#show').click(function() {
    //clearGame();
    $('#moves').empty();
    showwrapper();
  });
  populateDiskNo();
  populateStartPeg();
  populateDestPeg();
  drawGame();
  //drawStartStack(3, 0);
  //console.log(testMoves[0]);
  //sequentialMove(testMoves);
  //testMove(1, 2);
  //testMove(2, 1);
});

function populateDiskNo() {
    for (var i = 1; i <= 20; i++) {
        $('#diskno').append(
            $('<option></option>').val(i).html(i)
        );
    }
}

function populateStartPeg() {
    for (var i = 1; i <= 3; i++) {
        $('#startpeg').append(
            $('<option></option>').val(i).html(i)
        );
    }
}

function populateDestPeg() {
    var options = [1,2,3];
    options.splice(parseInt($('#startpeg').val())-1, 1);
    $('#destpeg').empty();
    for (var i = 0; i < options.length; i++) {
        $('#destpeg').append(
            $('<option></option>').val(options[i]).html(options[i])
        );
    }
}

function clearGame() {
  for (var i=0; i<game.length; i++) {
    for (var j=0; j<game[i].length; j++) {
        stage.removeChild(game[i][j]);
    }
  }
  stage.update();
  game = [[],[],[]];
  gameIndices = [[],[],[]];
  showGameIndices = [[],[],[]];
}

function stopGame() {
  createjs.Ticker.removeAllEventListeners();
  createjs.Ticker._inited = false;
  createjs.Ticker.init();
}

function drawGame() { 
  //var line = createjs.Shape();
  //line.graphics.beginStroke("rgba(0,0,0,1)").moveTo(30, 300).lineTo(570, 300).endStroke();
  //stage.addChild(line);
  //stage.update();
  var line = new createjs.Shape();
  line.graphics.moveTo(30,300).setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").lineTo(570, 300).endStroke();
  for (var i = 120; i <= 480; i += (360/2)){
    xpos.push(i);
    line.graphics.moveTo(i,300).setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").lineTo(i, 50).endStroke();
  }
  stage.addChild(line); 
  stage.update();
}

function drawStartStack(disks, rod) {
  var baseline = 300;
  for (var i = 0; i < disks; i++) {
    gameIndices[rod].push(i);
    showGameIndices[rod].push(i);
  }
  for (var i = disks; i > 0; i--) {
    baseline -= diskHeight;
    var rect = new createjs.Shape();
    rect.graphics.beginFill(diskFills[(i-1)%5]).drawRect(0, 0, widths[i-1], diskHeight);
    rect.x = xpos[rod]-widths[i-1]/2;
    rect.y = baseline;
    //console.log(rect);
    game[rod].unshift(rect);
    stage.addChild(rect);
  }
  stage.update();
}

function testMove(from, to, callback) {
  var currentAnimationY = createjs.Ticker.on("tick", moveY);
  /*console.log(currentAnimationY);
  console.log(game);
  console.log(gameIndices);
  console.log(createjs.Ticker.hasEventListener());*/
  //createjs.Ticker.init();

  createjs.Ticker.setFPS(fps);
  console.log('moving'+ from.toString() + " " + to.toString());
  function moveY(event) {
    game[from][0].y = game[from][0].y - (event.delta)/1000*pps;
    //console.log(game[0][0].y);
    if (game[from][0].y > 50) {
      //console.log(game[0][0].y);
      stage.update();
    }
    else {
      game[from][0].y = 50;
      stage.update();
      //createjs.Ticker.removeEventListener("tick", currentAnimationY);
      event.remove();
      currentAnimationX = createjs.Ticker.on("tick", moveX);
    }
  }

  function moveX(event) {
    if (to < from) {
      game[from][0].x = game[from][0].x - (event.delta)/1000*pps;
      //var compare = [game[from][0].x, xpos[to]-(widths[to]/2)];
      var compare = [game[from][0].x, xpos[to]-(widths[gameIndices[from][0]]/2)];
      //console.log('current move');
      //console.log(widths[gameIndices[from][0]]);
    }
    else {
      game[from][0].x = game[from][0].x + (event.delta)/1000*pps;
      //var compare = [xpos[to]-(widths[from]/2), game[from][0].x];
      var compare = [xpos[to]-(widths[gameIndices[from][0]]/2), game[from][0].x];
    }
    if (compare[0] > compare[1]) {
      //console.log(game[0][0].x);
      stage.update();
    }
    else {
      game[from][0].x = xpos[to]-(widths[gameIndices[from][0]]/2);
      stage.update();
      //createjs.Ticker.off("tick", currentAnimationX);
      event.remove();
      currentAnimationY2 = createjs.Ticker.on("tick", moveY2);
    }
  }
  
  function moveY2(event) {
    //console.log(game[from][0].y);
    if (game[to].length == 0) {
      var toHeight = 300-diskHeight;
    }
    else {
      var toHeight = game[to][0].y - diskHeight;
    }
    game[from][0].y = game[from][0].y + (event.delta)/1000*pps;
    if (game[from][0].y < toHeight) {
      //console.log(game[from][0].y);
      stage.update();
    }
    else {
      game[from][0].y = toHeight;
      //console.log(game[from][0].y);
      stage.update();
      //createjs.Ticker.off("tick", currentAnimationY2);
      event.remove();
      console.log("move done");
      game[to].unshift(game[from].splice(0, 1)[0]);
      gameIndices[to].unshift(gameIndices[from].splice(0, 1)[0]);
      console.log(gameIndices);
      callback();
    }
  }
}

function sequentialMove(moves) {
  var index = 0;
  function incrementNext() {
    if (index < moves.length-1) {
      console.log('nextmove');
      index++;
      testMove(moves[index][0], moves[index][1], incrementNext);
    }
    else {
      //testMove(moves[index][1], moves[index][0]);
    }
  }
  testMove(moves[index][0], moves[index][1], incrementNext);
  console.log('starting animation');
}

function showMoves(moves) {
  for (i = 0; i < moves.length; i++) {
      showGameIndices[moves[i][1]].unshift(showGameIndices[moves[i][0]].splice(0, 1)[0]);
      /*console.log(moves[i]);
      console.log('showmovegame');
      console.log(game);*/
      strRepresentation = '';
      strRepresentation += "<code>"+(i+1)+": ";
      for (var j=0; j<showGameIndices.length; j++) {
        strRepresentation+="[", strRepresentation+=showGameIndices[j].join(','), strRepresentation+="],";
      }
      strRepresentation = strRepresentation.substring(0, strRepresentation.length-1);
      strRepresentation += "<code>";
      $('#moves').append(
        $('<a id="'+i.toString()+'"'+'class="btn btn-default btn-xs" data-toggle="popover"></a>').attr('data-content',strRepresentation).attr('data-html', "true").html(moves[i][0] + " -> " + moves[i][1])
      );
      strRepresentation = '';
      $('#'+i.toString()).popover({
        trigger: 'click',
        'placement': 'bottom'
      });
    
  }
}

var worker = new Worker('hanoi.js');
worker.addEventListener('message', function(e) {
  // Log the workers message.
    if (e.data[0] == "animate") {
      sequentialMove(e.data.slice(1));
    }
    else {
      showMoves(e.data.slice(1));
    }
}, false);

function animatewrapper() {

// Setup an event listener that will handle messages received from the worker.
  // Log the workers message.
    var from = parseInt($('#startpeg').val())-1;
    var dest = parseInt($('#destpeg').val())-1;
    var spare = 3-from-dest;
    worker.postMessage(["animate",parseInt($('#diskno').val()),from,dest,spare]);
}

function showwrapper() {

// Setup an event listener that will handle messages received from the worker.
  // Log the workers message.
    var from = parseInt($('#startpeg').val())-1;
    var dest = parseInt($('#destpeg').val())-1;
    var spare = 3-from-dest;
    worker.postMessage(["show",parseInt($('#diskno').val()),from,dest,spare]);
}
