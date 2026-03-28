// class component - deprecated!
// import styles
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserList from "./components/UserList";
import Counter from "./components/Counter";
import Home from "./components/Home";
import TestRefTypes from "./components/TestRefTypes";
import APIDemo from "./components/APIDemo";
// function component
function App() {
  //state
  //return react element
  return (
    <div className="">
      {/* <Navbar />
      <UserList />
      <Home />
      <Counter />
      <TestRefTypes />
      <Footer /> */}

      <APIDemo />


    </div>
  );
}

export default App;
