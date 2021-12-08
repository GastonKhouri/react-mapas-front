import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/socketContext';
import useMapbox from '../hooks/useMapbox';

const puntoInicial = {
    lng: -62.803437414651526,
    lat: 8.255782983270365,
    zoom: 13.5
};

const MapaPage = () => {

    const { coords, mapaDiv, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapbox( puntoInicial );
    const { socket } = useContext( SocketContext );

    // Escuchar marcadores existentes
    useEffect( () => {

        socket.on( 'active-markers', ( markers ) => {

            for ( const key of Object.keys( markers ) ) {

                agregarMarcador( markers[ key ], key );

            };

        } );

    }, [ socket, agregarMarcador ] );

    // Nuevo Marcador
    useEffect( () => {

        nuevoMarcador$.subscribe( marcador => {

            socket.emit( 'new-marker', marcador );

        } );

    }, [ nuevoMarcador$, socket ] );

    // Actualizar marcador
    useEffect( () => {

        movimientoMarcador$.subscribe( marcador => {

            socket.emit( 'update-marker', marcador );

        } );

    }, [ movimientoMarcador$, socket ] );

    // Mover marcador mediante sockets
    useEffect( () => {

        socket.on( 'update-marker', ( marker ) => {

            actualizarPosicion( marker );

        } );

    }, [ socket, actualizarPosicion ] );

    // Escuchar nuevos marcadores
    useEffect( () => {

        socket.on( 'new-marker', ( marker ) => {

            agregarMarcador( marker, marker.id );

        } );

    }, [ socket, agregarMarcador ] );

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
