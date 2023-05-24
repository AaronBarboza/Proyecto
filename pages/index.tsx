import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import BuyTicket from '../components/BuyTicket';
import { useState } from 'react';
//import { getRepositories } from './api/api';
//import RepositoryCarousel from '../components/RepositoryCarousel';
import Footer from '../components/Footer';

const IndexPage = () => {
  const [username, setUsername] = useState('AaronBarboza');
  const [repositories, setRepositories] = useState([]);
  const [showPersonal, setShowPersonal] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleShowPersonal = () => {
    setShowPersonal(true);
  };

  const handleClosePersonal = () => {
    setShowPersonal(false);
  };

  const handleSearch = async () => {
   // const data = await getRepositories(username);
    //setRepositories(data);
  };

  return (
    <div style={{ marginTop: '50px' }} className="container">
      <Navbar handleSearch={handleSearch} handlePersonal={handleShowPersonal} activeTab={''}/>

      <h1 style={{ backgroundColor: '#3C6E71', color: 'White', padding: '10px', borderRadius: '5px' }}>Tickets</h1>

      

      <div style={{ marginTop: '50px' }}>
        <BuyTicket></BuyTicket>
      </div>
      
      
      
      
      <ul>
        {repositories.map((repository: any) => (
          <li key={repository.id}>{repository.name}</li>
        ))}
      </ul>
      
      <Footer></Footer>
    </div>
  );
};

export default IndexPage;