import { MarkerClusterer, Renderer } from '@googlemaps/markerclusterer';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_MAP_OPTIONS } from '../constants/defaultMapOptions';
import { MAP_DATA } from '../constants/mapData';

function MyMapComponent() {
  const ref = useRef(null);
  const [overlayPos, setOverlayPos] = useState({ top: 0, left: 0 });
  const [activePoint, setActivePoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleDrag = (map) => {
    console.log('activePoint', activePoint);
    if (!activePoint) return;

    var latLng = new google.maps.LatLng(activePoint.lat, activePoint.lng);
    var projection = map.getProjection();
    var bounds = map.getBounds();
    if (!projection || !bounds) return;
    var topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    var bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    var scale = Math.pow(2, map.getZoom());
    var worldPoint = projection.fromLatLngToPoint(latLng);
    const res = [
      Math.floor((worldPoint.x - bottomLeft.x) * scale),
      Math.floor((worldPoint.y - topRight.y) * scale),
    ];

    setOverlayPos({
      top: res[0],
      left: res[1],
    });
  };

  useEffect(() => {
    if (!ref.current) return;
    const map = new google.maps.Map(ref.current, DEFAULT_MAP_OPTIONS);

    var bounds = new google.maps.LatLngBounds();

    const markers = MAP_DATA.map((item, i) => {
      const marker = new google.maps.Marker({
        position: { lat: item.latitude, lng: item.longitude },
        icon: {
          url: `/mapMarker.png`,
          scaledSize: new google.maps.Size(37, 44),
        },
      });

      marker.addListener('click', () => {
        map.panTo({ lat: item.latitude, lng: item.longitude });
        setActivePoint({ lat: item.latitude, lng: item.longitude });
      });

      var myLatLng = new google.maps.LatLng(item.latitude, item.longitude);
      bounds.extend(myLatLng);

      return marker;
    });

    map.fitBounds(bounds);

    map.addListener('click', () => {
      console.log('clicked');
    });

    map.addListener('drag', () => {
      handleDrag(map);
    });

    const markerRenderer: Renderer = {
      render: ({ count, position }) =>
        new google.maps.Marker({
          label: { text: String(count), color: '#5D3EBC', fontWeight: 'bold' },
          position,
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          icon: {
            url: `/Ellipse.png`,
            scaledSize: new google.maps.Size(35, 35),
          },
        }),
    };

    new MarkerClusterer({ markers, map, renderer: markerRenderer });
  }, [ref]);

  return (
    <div className='relative w-[600px] overflow-hidden'>
      <div ref={ref} id='map' />
      {activePoint && (
        <div
          className='absolute z-10 bg-white w-[304px]'
          style={{
            top: overlayPos.top,
            left: overlayPos.left,
          }}
        >
          <p className='text-red-500'>asdadadsas</p>
        </div>
      )}
    </div>
  );
}

export default MyMapComponent;
