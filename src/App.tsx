import "./App.css";
import Header from "./components/Header/Header";
import Map from "./components/Map/Map";
import Preview from "./components/Preview/Preview";
import Form from "./components/Form/Form";
import { auth, provider } from "./database/firebase";
import { useEffect, useState } from "react";
import { Routes, Route,Navigate, BrowserRouter } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  if (user) {
    console.log(user);
  } else {
    console.log(null);
  }
  useEffect(() => {
    auth.onAuthStateChanged(persona => {
      if (persona) {
        setUser(persona);
      } else {
        setUser(null);
      }
    });
  }, [])

  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(provider)
    }
    catch (error) {
      console.log(error);
    }
  }

  const signOut = async () => {
    auth.signOut();
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              <Header user={user} signIn={signInWithGoogle} signOut={signOut} />
              <main>
                <Map />
                <Preview />
                <Form />
              </main>
            </>
          } />
          <Route path="mapa" element={
            <>
              <Header user={user} signIn={signInWithGoogle} signOut={signOut} />
              <main>
                <Map />
                <Preview />
                <Form />
              </main>
            </>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
