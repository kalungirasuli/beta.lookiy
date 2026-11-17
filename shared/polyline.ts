/** Decode the road geometry returned by Google Routes into geographic coordinates. */
export function decodeRoute(encoded: string) {
  let index = 0, lat = 0, lng = 0;
  const coordinates: { latitude: number; longitude: number }[] = [];
  function component() {
    let result = 0, shift = 0, byte: number;
    do {
      if (index >= encoded.length || shift > 30) throw new Error('Invalid route polyline');
      byte = encoded.charCodeAt(index++) - 63;
      if (byte < 0 || byte > 63) throw new Error('Invalid route polyline');
      result |= (byte & 31) << shift; shift += 5;
    } while (byte >= 32);
    return result & 1 ? ~(result >> 1) : result >> 1;
  }
  try { while (index < encoded.length) { lat += component(); lng += component(); coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 }); } }
  catch { return []; }
  return coordinates;
}
