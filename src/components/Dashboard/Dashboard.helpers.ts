
export function updateAnimationProgress(animation: Animation, relativeValue: number) {
  const animationTiming = animation.effect?.getComputedTiming();
  if (animationTiming) {
    const animationProgress = animationTiming?.progress || 0;

    if (relativeValue < animationProgress - 0.01) {
      animation.playbackRate = -1;
    } else if (relativeValue > animationProgress + 0.01) {
      animation.playbackRate = 1;
    } else {
      animation.playbackRate = 0;
      animation.currentTime = (parseInt(`${animationTiming?.duration}`) || 1000) * relativeValue;
    }
  }
}
