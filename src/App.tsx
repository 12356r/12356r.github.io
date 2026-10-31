import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

/* 路由级分包：Leaflet、各页面逻辑只在访问时加载；Suspense 边界在 Layout 内 */
const Home = lazy(() => import('./pages/Home'));
const CampusLife = lazy(() => import('./pages/CampusLife'));
const Board = lazy(() => import('./pages/Board'));
const Teachers = lazy(() => import('./pages/Teachers'));
const Education = lazy(() => import('./pages/Education'));
const Scenery = lazy(() => import('./pages/Scenery'));
const PlaceDetail = lazy(() => import('./pages/PlaceDetail'));
const MapPage = lazy(() => import('./pages/MapPage'));
const Dorm = lazy(() => import('./pages/Dorm'));
const Food = lazy(() => import('./pages/Food'));
const CanteenDetail = lazy(() => import('./pages/CanteenDetail'));
const Activities = lazy(() => import('./pages/Activities'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const About = lazy(() => import('./pages/About'));
const Favorites = lazy(() => import('./pages/Favorites'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/life" element={<CampusLife />} />
        <Route path="/board" element={<Board />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/education" element={<Education />} />
        <Route path="/scenery" element={<Scenery />} />
        <Route path="/scenery/:id" element={<PlaceDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dorm" element={<Dorm />} />
        <Route path="/food" element={<Food />} />
        <Route path="/food/:id" element={<CanteenDetail />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
