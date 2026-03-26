import { Link, useLocation } from "react-router-dom";
import "./header.css";

export default function Header() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const links = [
    ...(role === "admin"
      ? [{ path: "/AfficherUtilisateurs", name: "Users" }]
      : []),
    { path: "/afficher", name: "Projects" },
  ];

  return (
    <header className="header">
      <div className="brand">
        <img src="/logo.png" alt="logo" className="logo" />
        <h2 className="project-name">TaskFlow</h2>
      </div>

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
    </header>
  );
}