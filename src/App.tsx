import { BrowserRouter } from "react-router-dom";
import Form from "./components/Form";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Form />
      </div>
    </BrowserRouter>
  );
}

export default App;
