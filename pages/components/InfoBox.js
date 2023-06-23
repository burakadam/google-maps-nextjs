import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const OverlayView = (props) => {
  const { google } = window;
  const { googleMap, position, children } = props;

  const [latlng, setLatlng] = useState(position);
  const [container, setContainer] = useState(document.createElement('div'));
  const [overlay, setOverlay] = useState(undefined);

  const initOverlay = useCallback(() => {
    const overlayView = new google.maps.OverlayView();
    overlayView.setMap(googleMap);
    overlayView.getDraggable = () => true;
    setOverlay(overlayView);
    setLatlng(position);
    google.maps.OverlayView.preventMapHitsFrom(container);
  }, [googleMap, container]);

  const onAdd = useCallback(() => {
    // only draw marker if it has not been assigned the customMarker class
    if (!container.classList.contains('customMarker')) {
      container.classList.add('customMarker');
      container.style.position = 'absolute';
      const panes = overlay.getPanes();
      panes.overlayImage.appendChild(container);
    }

    overlay.setPosition();
  }, [overlay]);

  const draw = useCallback(() => {
    container.style.position = 'absolute';
    container.draggable = true;

    overlay.getPanes().floatPane.appendChild(container);

    overlay.setPosition();
  }, [overlay, container, latlng]);

  const onRemove = useCallback(() => {
    ReactDOM.unmountComponentAtNode(container);
    setContainer(undefined);
    overlay.setMap(null);
  }, [container, overlay]);

  const setPosition = (pos) => {
    // update global latlng value with current position of marker
    if (pos) setLatlng(pos);

    const projection = overlay.getProjection();
    if (!projection) return;

    // convert latlng value to pixel equivalent
    const point = projection.fromLatLngToDivPixel(latlng);

    // set left and top values from values from point variable to place marker correctly on map
    if (point && point.x && point.y) {
      container.style.left = `${point.x}px`;
      container.style.top = `${point.y}px`;
    }
  };

  const bindFunctions = useCallback(() => {
    overlay.onAdd = onAdd.bind(this);
    overlay.draw = draw.bind(this);
    overlay.onRemove = onRemove.bind(this);
    overlay.setPosition = setPosition.bind(this);
    overlay.getDraggable = () => true;
  }, [overlay]);

  useEffect(() => {
    if (overlay) {
      bindFunctions();
    }
  }, [overlay]);

  useEffect(() => {
    initOverlay();
  }, []);

  return (
    (overlay &&
      children &&
      container &&
      ReactDOM.createPortal(children, container)) ||
    null
  );
};

export default React.memo(OverlayView);
