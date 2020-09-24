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

export function getEndPosition(targetDiv, itemsWidth, index) {
  const itemsAmount = Math.floor(targetDiv.scrollWidth / itemsWidth);
  const lastItems = Math.ceil((targetDiv.clientWidth / itemsWidth) * 0.4 ) + 1;
  const maxIndex = itemsAmount - lastItems;
  const minIndex = Math.floor((targetDiv.clientWidth / itemsWidth) * 0.6) - 1;
  const maxScrollLength = targetDiv.scrollWidth - targetDiv.clientWidth;
  const scrollAmount = itemsWidth * (index - minIndex);

  let endPosition = index <= minIndex ? 0 : scrollAmount;
  endPosition = index >= maxIndex ? maxScrollLength : endPosition;

  return endPosition;
}