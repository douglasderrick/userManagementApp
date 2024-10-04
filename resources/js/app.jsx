import "./bootstrap";
import "../css/app.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import ReactDOM from "react-dom/client";
import UserManagement from "./modules/usermanagement/UserManagement.jsx";

ReactDOM.createRoot(document.getElementById("app")).render(<UserManagement />);
