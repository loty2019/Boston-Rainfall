import bostonMap from './Map_Of_Boston.svg';

function App() {
  return (
    <div className=""> 
      <header className="p-6 text-center justify-center items-center">
        <h1 className="text-6xl font-mono font-extrabold">Boston Rain Fall Info Map</h1>
        <img src={bostonMap} alt="Map of Boston" className='mt-5 p-10 max-h-screen justify-center items-center' />
      </header>
    </div>
  );
}

export default App;
