moves = []
var Hanoi = function (n, from, to , via)
{
  if (n===0) return;

  Hanoi(n-1, from, via , to);

  moves.push([from, to]);
  //movecounter++;
  // callStack.push([from,to]); // save parameters to callStack array
  
  Hanoi(n-1, via, to , from);
};

self.addEventListener('message', function(e) {
  // Send the message back.
  //self.postMessage('You said: ' + e.data);
  //self.postMessage("test "+e.data[0]);
  Hanoi(e.data[1], e.data[2], e.data[3], e.data[4]);
  moves.unshift(e.data[0]);
  //self.postMessage(moves.length);
  //self.postMessage(moves.join(" "));
  self.postMessage(moves);
  moves.length = 0;
}, false);
