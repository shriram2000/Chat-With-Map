import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: "Geolocation is not supported by your browser.",
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "An unknown error occurred.";
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out.";
          break;
      }
      setState({
        location: null,
        loading: false,
        error: errorMessage,
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};
