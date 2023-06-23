import { MarkerClusterer, Renderer } from '@googlemaps/markerclusterer';
import { useEffect, useRef } from 'react';
import { DEFAULT_MAP_OPTIONS } from '../constants/defaultMapOptions';
import { MAP_DATA } from '../constants/mapData';

const html =
  '<div class="infoBox text-red-500 p-0" style="transform: translateZ(0px); visibility: visible; overflow: auto; width: 100%; left: -106.393px; top: 48.7845px;"><div><div class="rounded-xl bg-secondary-white font-semibold z-50 transition-[opacity] overflow-hidden opacity-100 pointer-events-auto] h-auto"><div class="border-b border-supporting-pale-purple p-4 max-sm:p-3"><p class="pr-2.5 text-b1 text-primary-primary max-xsm:text-b2">Bıgadıc Subesı E-Gıse 2</p></div><div class="flex border-b border-supporting-pale-purple p-4 text-b2 max-sm:p-3 max-xsm:text-c"><span class="mr-4 block text-supporting-border-gray">Banka</span><span>Akbank</span></div><div class="flex p-4 text-b2 max-sm:p-3 max-xsm:text-c"><span class="mr-4 block text-supporting-border-gray">Adres</span><span>Bahcelıevler Mahallesı Rauf Denktas Bulvarı Orjan 1 Sıtesı Akcay Sahıl Yolu</span></div><button type="button" class="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-white hover:bg-supporting-pale-purple"><svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-2.5"><path d="M1 13 13 1M1 1l12 12" stroke="#5D3EBC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></div></div>';

function MyMapComponent() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const map = new google.maps.Map(ref.current, DEFAULT_MAP_OPTIONS);

    const infoWindow = new google.maps.InfoWindow({
      maxWidth: 304,
    });

    var bounds = new google.maps.LatLngBounds();
    // Add some markers to the map.
    const markers = MAP_DATA.map((item, i) => {
      const marker = new google.maps.Marker({
        position: { lat: item.latitude, lng: item.longitude },
        icon: {
          url: `/mapMarker.png`,
          scaledSize: new google.maps.Size(37, 44),
        },
      });

      marker.addListener('click', () => {
        // console.log(item.title);
        map.panTo({ lat: item.latitude, lng: item.longitude });
        infoWindow.setContent(html);
        infoWindow.open({
          anchor: marker,
          map,
        });
      });

      var myLatLng = new google.maps.LatLng(item.latitude, item.longitude);
      bounds.extend(myLatLng);

      return marker;
    });

    map.fitBounds(bounds);

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

  return <div ref={ref} id='map' />;
}

export default MyMapComponent;
