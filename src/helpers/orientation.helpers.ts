type Quaternion = [number, number, number, number];

export function quaternionToEulerAngles(quaternion: Quaternion) {
  // https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Source_code_2
  const [x, y, z, w] = quaternion;

  // roll (x-axis rotation)
  const sinr_cosp = 2 * (w * x + y * z);
  const cosr_cosp = 1 - 2 * (x * x + y * y);
  const roll = Math.atan2(sinr_cosp, cosr_cosp);

  // pitch (y-axis rotation)
  const sinp = Math.sqrt(1 + 2 * (w * y - x * z));
  const cosp = Math.sqrt(1 - 2 * (w * y - x * z));
  const pitch = 2 * Math.atan2(sinp, cosp) - Math.PI / 2;

  // yaw (z-axis rotation)
  const siny_cosp = 2 * (w * z + x * y);
  const cosy_cosp = 1 - 2 * (y * y + z * z);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return [roll, pitch, yaw] as const;
}

export const toDegrees = (radians: number) => (radians * 180) / Math.PI;
