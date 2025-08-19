export interface GraphicAssetManifest {
  [key: string]: {
    width: number;
    height: number;
    type: string;
    focus?: {
      x?: number | null;
      y?: number | null;
    } | null;
  };
}
