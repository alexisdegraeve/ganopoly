type Orientation = 'horizontal' | 'vertical';

export interface Cell {
  name: string;
  price: number;
  orientation: Orientation;
  isCorner: boolean;
}
