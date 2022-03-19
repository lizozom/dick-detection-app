import './App.css';
import CameraPermissions from './components/camera_app';
import Header from './components/header'

function App() {
  return (
    <div className="App">
      <Header></Header>
      <CameraPermissions></CameraPermissions>
    </div>
  );
}

export default App;
