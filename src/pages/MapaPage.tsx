import { useEffect } from 'react';
import useMapbox from '../hooks/useMapbox';

const puntoInicial = {
    lng: -62.803437414651526,
    lat: 8.255782983270365,
    zoom: 13.5
};

const MapaPage = () => {

    const { coords, mapaDiv, nuevoMarcador$, movimientoMarcador$ } = useMapbox( puntoInicial );

    useEffect( () => {

        nuevoMarcador$.subscribe( marcador => {
            console.log( marcador );
        } );

    }, [ nuevoMarcador$ ] );

    useEffect( () => {

        movimientoMarcador$.subscribe( marcador => {
            console.log( marcador );
        } );

    }, [ movimientoMarcador$ ] );

    return (
        <>

            <div className="info">
                Lng: { coords.lng } | Lat: { coords.lat } | Zoom: { coords.zoom }
            </div>

            <div
                ref={ mapaDiv }
                className="mapContainer"
            />

        </>
    );
};

export default MapaPage;
