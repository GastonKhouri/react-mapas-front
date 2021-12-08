import MapaPage from './pages/MapaPage';
import { SocketProvider } from './context/socketContext';

const MapasApp = () => {
    return (
        <SocketProvider>
            <MapaPage />
        </SocketProvider>
    );
};

export default MapasApp;
