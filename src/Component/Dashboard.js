import { Route, Navigate, Routes } from 'react-router-dom';

import StackedBar from './StackedBar';
import NavDrawer from './Drawer';
import CrossFiltering from './Crossfiltering';

function MenuRoute() {
    return (
        <Routes>
            <Route exact path="/" element={<Navigate to="/stackedbar" />} />
            <Route path="/stackedbar" element={<StackedBar />} />
            <Route path="/crossfiltering" element={<CrossFiltering/>} />
        </Routes>
    )
}

export default function Dashboard() {
    return <NavDrawer content={MenuRoute} />
}