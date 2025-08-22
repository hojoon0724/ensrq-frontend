import { Image, Button } from "@/components/atoms";
import graphicAssetsManifest from "@/data/graphic-assets-manifest.json";
import { GraphicAssetManifest } from "@/types";

export default function PhotoFocusCheckPage() {
  const graphicAssets = graphicAssetsManifest;
  const photoAssets = Object.fromEntries(
    Object.entries(graphicAssets).filter(([key]) => key.startsWith("/photos/portraits/"))
  ) as GraphicAssetManifest;

  return (
    <div className="top-container flex flex-col items-center justify-center w-full h-full">
      <h3>Focus Check</h3>
      <div className="wide-frame flex flex-wrap">
        {Object.entries(photoAssets).map(([key]) => (
          <div key={key} className="photo-asset flex mr-s mb-s">
            <div className="col-1">
              <div className="photo-asset h-24 w-80 relative">
                <Image src={key} alt={key} objectFit="cover" useFocusPoint={true} />
              </div>
              <div className="info p-s">
                <div className="photo">{key.slice(18)}</div>
                <div className="coordinates">
                  x: {photoAssets[key].focus?.x ? (photoAssets[key].focus?.x * 100).toFixed(2) : 0}
                </div>
                <div className="coordinates">
                  y: {photoAssets[key].focus?.y ? (photoAssets[key].focus?.y * 100).toFixed(2) : 0}
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="photo-asset h-80 w-24 relative">
                <Image src={key} alt={key} objectFit="cover" useFocusPoint={true} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
