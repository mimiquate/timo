export function smoothScrollLeft(target, startPosition, distance, duration, previousAnimationId) {
  if (previousAnimationId) cancelAnimationFrame(previousAnimationId);
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;

    let timeElapsed = currentTime - startTime;
    let run = easeOutQuadratic(timeElapsed, startPosition, distance, duration);

    target.scrollLeft = run;

    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

function easeOutQuadratic (time, startValue, changeValue, duration) {
	time /= duration;
	return -changeValue * time*(time-2) + startValue;
}