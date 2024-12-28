import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MenuManager from './pages/MenuManager';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/view-menus" element={<MenuManager />} />
            </Routes>
        </Router>
    );
}

export default App;
