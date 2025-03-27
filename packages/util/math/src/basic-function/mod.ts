/** @brief avoid bug from negative value */
export const mod = (x: number, m: number): number => (x % m + m) % m;
