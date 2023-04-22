import { BrowserRouter,Navigate as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Map from "../components/Map/Map";

const AuthRouter = () => {
  return (
    <Routes>
      <Route  path="/mapabicidatos" element={<Map />} />
      <Route  path="/auth/login" element={<LoginScreen />} />
      <Route  path="/auth/register" element={<RegisterScreen />} />
      <Navigate to="/auth/login" replace/>
    </Routes>

  );
};

export default AuthRouter;
