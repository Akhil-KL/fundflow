import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import Navbar from './components/Navbar';


const App = () => {
  return (
<div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
  <Navbar />
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/create" element={<CreateCampaign />} />
    <Route path="/campaign/:id" element={<CampaignDetails />} />
  </Routes>
</div>

  );
};

export default App;
