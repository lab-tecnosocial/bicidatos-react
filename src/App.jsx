import "./App.css";
import Header from "./components/Header/Header";
import Map from "./components/Map/Map";
import Preview from "./components/Preview/Preview";
import Form from "./components/Form/Form";
import { auth, provider } from "./database/firebase";
import { useEffect, useState } from "react";
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
      <Header user={user} signIn={signInWithGoogle} signOut={signOut} />
      <main>
        <Map />
        <Preview />
        <Form />
      </main>
    </>
  );
}

export default App;
