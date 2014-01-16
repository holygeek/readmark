var lastBottom = window.pageYOffset + window.innerHeight
  , readOverlay
  , animJiffy = 50
  , fadeOutDuration = 700
  , recentScrollAmounts = [0, 0]
  ;

function show(e) {
  e.style.display = 'block';
}

function hide(e) {
  e.style.display = 'none';
}

function timedOpacityReduction(e, decrement, steps) {
  var newOpacity;

  if (steps <= 0) {
    e.style.opacity = 0;
    hide(e);
    return;
  }

  newOpacity= window.getComputedStyle(e).opacity - decrement;
  if (newOpacity < 0) {
    e.style.opacity = 0;
    hide(e);
    return;
  }

  steps = steps - 1;
  e.style.opacity = newOpacity;
  setTimeout(function() {
    timedOpacityReduction(e, decrement, steps);
  },
  animJiffy);
}

function animateDecreasingOpacity(e, start, end, duration) {
  var steps
    , decrement
    ;

  if (duration < animJiffy) {
    e.style.opacity = end;
    hide(e);
    return;
  }
  e.style.opacity = start;
  show(e);
  steps = duration / animJiffy;
  decrement = (start - end) / steps;
  setTimeout(function(){timedOpacityReduction(e, decrement, steps);}, animJiffy)
}

function atBottom() {
  return window.scrollY + window.innerHeight >= document.body.scrollHeight;
}


function lastTwoScrollAmountWasSmallerThan(value) {

  return recentScrollAmounts[0] < value &&
	 recentScrollAmounts[1] < value;
}

function showReadOverlay(e) {
  var newBottom = window.pageYOffset + window.innerHeight
    , scrollAmount = newBottom - lastBottom
    , stillVisible = window.innerHeight - scrollAmount - 10
    ;
  lastBottom = newBottom;
  if (scrollAmount <= 0) // not page down
    return;
  recentScrollAmounts[1] = recentScrollAmounts[0];
  recentScrollAmounts[0] = scrollAmount;
  if (scrollAmount <= .8 * window.innerHeight && !atBottom()) // little scroll
    return;
  if (lastTwoScrollAmountWasSmallerThan(.2 * window.innerHeight))
    return;
  readOverlay.style.height = stillVisible + 'px';
  animateDecreasingOpacity(readOverlay, .5, 0, fadeOutDuration);
}

window.addEventListener('scroll', showReadOverlay);

readOverlay = document.createElement('div');
readOverlay.setAttribute('id', 'readmarkOverlay');
document.body.appendChild(readOverlay);
