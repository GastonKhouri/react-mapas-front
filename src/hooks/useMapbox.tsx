import { useRef, useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN as string;

interface PuntoInicial {
    lng: number,
    lat: number,
    zoom: number;
}

interface ObjetoDinamico {
    [ key: string ]: mapboxgl.Marker;
}

const useMapbox = ( puntoInicial: PuntoInicial ) => {

    // Referencia al DIV del mapa
    const mapaDiv = useRef<HTMLDivElement>( null );

    // Referencia a los marcadores
    const marcadores = useRef<ObjetoDinamico>( {} );

    // Observables de Rxjs
    const movimientoMarcador = useRef( new Subject() );
    const nuevoMarcador = useRef( new Subject() );

    // Mapa y coordenadas
    const mapa = useRef<mapboxgl.Map>();
    const [ coords, setCoords ] = useState( puntoInicial );

    // Funcion para agregar marcadores
    const agregarMarcador = useCallback(
        ( ev ) => {

            const { lng, lat } = ev.lngLat;

            const marker = new mapboxgl.Marker();

            marker
                .setLngLat( [ lng, lat ] )
                .addTo( mapa.current! )
                .setDraggable( true );

            const id = v4();

            // Asignamos id a marcador
            ( marker as any ).id = id;

            // Asignamos al objeto de marcadores
            marcadores.current[ id ] = marker;

            nuevoMarcador.current.next( { id, lng, lat } );

            // Escuchar movimientos del marcador
            marker.on( 'drag', ( { target }: any ) => {

                const { id } = target;
                const { lng, lat } = target.getLngLat();

                movimientoMarcador.current.next( { id, lng, lat } );

            } );

        },
        [],
    );

    useEffect( () => {

        const map = new mapboxgl.Map( {
            container: mapaDiv.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ puntoInicial.lng, puntoInicial.lat ],
            zoom: puntoInicial.zoom
        } );

        mapa.current = map;

    }, [ puntoInicial ] );

    // Cuando se mueve el mapa
    useEffect( () => {

        mapa.current?.on( 'move', () => {

            const { lat, lng } = mapa.current!.getCenter();
            const zoom = mapa.current!.getZoom();

            setCoords( {
                lat: Number( lat.toFixed( 4 ) ),
                lng: Number( lng.toFixed( 4 ) ),
                zoom: Number( zoom.toFixed( 4 ) )
            } );

        } );

    }, [] );

    // Agregar marcador cuando hago click
    useEffect( () => {

        mapa.current?.on( 'click', agregarMarcador );

    }, [ agregarMarcador ] );

    return {
        coords,
        mapaDiv,
        marcadores,
        agregarMarcador,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current
    };

};

export default useMapbox;
