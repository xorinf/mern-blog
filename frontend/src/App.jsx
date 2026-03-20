// class component - deprecated!
// import styles
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserList from "./components/UserList";
import Counter from "./components/Counter";
import Home from "./components/Home";
// function component
function App() {
  //state
  //return react element
  return (
    <div className="">
      <Navbar />
      <UserList />
      <Home />
      <Counter />
      <Footer />

    </div>
  );
}

export default App;
