// import { ResourceId, resourceList } from "@/store/store";

// export const isMineType = (str?: string): ResourceId | null =>
//   resourceList.includes(str as ResourceId) ? (str as ResourceId) : null;

const units = ["", "K", "M", "B", "T", "P", "E", "Z", "Y"];

export function abbreviateNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  let unitIndex = 0;

  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex++;
  }

  return Math.floor(num * 10) / 10 + units[unitIndex];
}

const binaryUnits = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
const decimalUnits = ["b", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

export function abbreviateBytes(num: number, isBinary: boolean = true): string {
  const base = isBinary ? 1024 : 1000;
  const units = isBinary ? binaryUnits : decimalUnits;

  if (num < base) {
    return num + " " + units[0];
  }

  let unitIndex = 0;

  while (num >= base && unitIndex < units.length - 1) {
    num /= base;
    unitIndex++;
  }

  return (Math.floor(num * 10) / 10) + " " + units[unitIndex];
}