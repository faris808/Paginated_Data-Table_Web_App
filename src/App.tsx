import "./App.css";
import Body from "./components/Body";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; 
import 'primeicons/primeicons.css';

const App : React.FC = () => {
  return (
    <div>
      <h1 className="text-center font-myfont2 text-red-800 font-bold text-2xl mt-5">Welcome to Paginated Data Table Web App</h1>
      <Body />
    </div>
  );
}

export default App;
