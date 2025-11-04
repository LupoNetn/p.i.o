import { useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../lib/axios"; // axios instance

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me"); // e.g. verify route
        console.log(res)
        if (res.data.success) navigate("/booking");
        else navigate("auth/login");
      } catch {
        navigate("auth/login");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <p>Redirecting...</p>
  );
};

export default AuthSuccess;
