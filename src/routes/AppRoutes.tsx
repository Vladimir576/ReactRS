import { Route, Routes } from 'react-router-dom';
import About from '../pages/About';
import Details from '../pages/Details';
import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="details/:detailsId" element={<Details />} />
      </Route>
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
