/**
 * How much further a flick carries an element, in px, given its velocity in
 * px/s. Uses the same exponential deceleration as scrolling (from Apple's
 * "Designing Fluid Interfaces"), so a fast flick goes far, a slow one barely.
 */
export function projectMomentum(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Resistance past a boundary: the element first follows the pointer at the
 * `constant` rate, then less and less, never moving further than `dimension`.
 */
export function rubberband(
  overshoot: number,
  dimension: number,
  constant = 0.55,
) {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}
