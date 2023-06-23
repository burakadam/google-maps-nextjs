import { MarkerClusterer, Renderer } from '@googlemaps/markerclusterer';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_MAP_OPTIONS } from '../constants/defaultMapOptions';
import { MAP_DATA } from '../constants/mapData';

interface IOverlayProps {
  title: string;
  latitude: number;
  longitude: number;
}

function MyMapComponent() {
  const ref = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
  const [activeMarker, setActiveMarker] = useState<IOverlayProps | null>(null);

  const hideInfo = () => {
    setShowInfo(false);
    setActiveMarker(null);
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
        setShowInfo(true);
        setActiveMarker(item);
      });

      var myLatLng = new google.maps.LatLng(item.latitude, item.longitude);
      bounds.extend(myLatLng);

      return marker;
    });

    map.fitBounds(bounds);

    map.addListener('click', () => hideInfo());

    map.addListener('drag', () => hideInfo());

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
    <div className='relative w-[600px] overflow-hidden '>
      <div ref={ref} id='map' />
      {showInfo && activeMarker && (
        <div className='absolute z-10 bg-white w-[304px] top-1/2 left-0 right-0 m-auto translate-y-2'>
          <div className='infoBox text-black p-0'>
            <div>
              <div className='rounded-xl bg-secondary-white font-semibold z-50 transition-[opacity] overflow-hidden opacity-100 pointer-events-auto] h-auto'>
                <div className='border-b border-supporting-pale-purple p-4 max-sm:p-3'>
                  <p className='pr-2.5 text-b1 text-primary-primary max-xsm:text-b2'>
                    {activeMarker.title}
                  </p>
                </div>
                <button
                  type='button'
                  className='absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-white hover:bg-supporting-pale-purple'
                  onClick={hideInfo}
                >
                  <svg
                    viewBox='0 0 14 14'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-2.5'
                  >
                    <path
                      d='M1 13 13 1M1 1l12 12'
                      stroke='#000'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyMapComponent;
