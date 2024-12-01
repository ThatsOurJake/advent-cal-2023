import type { assets, GameCell } from "@/app/components/games/match-pairs";

export const generateMatchCells = (width: number, height: number, assets: assets[]): GameCell[] => {
  const assetCount = width * height / 2;

  if (assets.length != assetCount) {
    throw new Error('Not enough assets provided');
  }

  const assetSet = new Set(assets);
  if (assetSet.size !== assets.length) {
    throw new Error('Duplicate assets provided');
  }

  const cells: GameCell[] = [];

  for (let i = 0; i < assetCount; i++) {
    const asset = assets[i];
    cells.push({ id: `${i}-0`, asset, isFlipped: false });
    cells.push({ id: `${i}-1`, asset, isFlipped: false });
  }

  return cells;
};

export default generateMatchCells;
