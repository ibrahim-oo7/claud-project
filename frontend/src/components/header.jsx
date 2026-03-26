import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const token = localStorage.getItem("token");

  const links = token
    ? [
        ...(role === "admin"
          ? [{ path: "/AfficherUtilisateurs", name: "Users" }]
          : []),
        { path: "/afficher", name: "Projects" },
      ]
    : [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="brand">
        <img src="/logo.png" alt="logo" className="logo" />
        <h2 className="project-name">TaskFlow</h2>
      </div>

      {token && (
        <>
          <nav className="center">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={
                  location.pathname === link.path ? "nav-link active" : "nav-link"
                }
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div>
            <button onClick={handleLogout} className="nav-link">
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
}