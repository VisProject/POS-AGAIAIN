import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes and clsx conditionals safely.
 * Since we strictly use vanilla CSS/Modules per project requirements, 
 * this mainly serves to conveniently join string class arrays and object conditions.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
