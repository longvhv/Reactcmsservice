/**
 * Class Name Utility
 * Merge and conditionally apply classNames
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ')
    .trim();
}
