/** Geometry shared by the blueprint drawing and the test rig that animates it. */

/** Pose of the car on the test rig, in drawing units (positive = up). */
export interface RigPose {
  /** How far the ground has pushed the front wheel up. */
  front: number;
  /** How far the ground has pushed the rear wheel up. */
  rear: number;
  /** How far the sprung mass (chassis and everything bolted to it) has risen. */
  heave: number;
  /** Distance rolled. */
  dist: number;
  /** 0 = flat ground and at rest, 1 = terrain at full height. */
  amp: number;
}

export const REAR_AXLE_X = 175;
export const FRONT_AXLE_X = 625;
export const GROUND_Y = 400;

/** Height of the test track at distance `s`: two swells, and a rock once a lap. */
export function terrain(s: number) {
  const lap = ((s % 1100) + 1100) % 1100;
  const rock = 13 * Math.exp(-((lap - 550) ** 2) / (2 * 40 ** 2));
  return 6 * Math.sin(s / 70) + 3.5 * Math.sin(s / 31 + 1.7) + rock;
}
