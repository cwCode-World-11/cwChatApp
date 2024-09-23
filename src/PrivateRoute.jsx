import { useNavigate } from "react-router-dom";
import { useDataContext } from "./Component/Hooks/DataProvider";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useDataContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      alert("No login user");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return children;
};

export default PrivateRoute;
