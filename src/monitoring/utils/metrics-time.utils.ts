export function hrtimeSeconds(start: bigint) {
  return Number(process.hrtime.bigint() - start) / 1_000_000_000;
}
