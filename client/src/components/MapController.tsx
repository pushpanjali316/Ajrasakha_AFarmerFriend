import { useMap } from "react-leaflet";
import { useEffect } from "react";
import type { StateInfo } from "../data/indiaStates";

type Props = {
  selectedState: StateInfo | null;
};

export default function MapController({ selectedState }: Props) {
  const map = useMap();

  useEffect(() => {
    if (selectedState) {
      map.flyTo(selectedState.center, selectedState.zoom, {
        duration: 1.2,
      });
    }
  }, [selectedState, map]);

  return null;
}
