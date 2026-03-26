import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';

// User Components
import Login from './components/Login';
import Register from './components/register';
import AfficherUtilisateurs from './components/AfficherUtilisateurs';
import AjouterUtilisateur from './components/AjouterUtilisateur';
import ModifierUtilisateur from './components/modifierUtilisateur';

// Project Components
import Afficher from './componentsProjects/afficher';
import Ajouter from './componentsProjects/ajouter';
import Modifier from './componentsProjects/modifier';
import Details from './componentsProjects/details';

// Pages
import TaskPage from './pages/TaskPage';
import KanbanPage from './pages/KanbanPage';
import ReportsPage from './pages/ReportsPage';

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/afficher" />;
  }

  return children;
}

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        <Route
          path="/AfficherUtilisateurs"
          element={
            <AdminRoute>
              <AfficherUtilisateurs />
            </AdminRoute>
          }
        />
        <Route
          path="/AjouterUtilisateur"
          element={
            <AdminRoute>
              <AjouterUtilisateur />
            </AdminRoute>
          }
        />
        <Route
          path="/modifierUtilisateur/:id"
          element={
            <AdminRoute>
              <ModifierUtilisateur />
            </AdminRoute>
          }
        />

        <Route path="/afficher" element={<Afficher />} />
        <Route path="/ajouter" element={<Ajouter />} />
        <Route path="/modifier/:id" element={<Modifier />} />
        <Route path="/details/:id" element={<Details />} />

        <Route path="/tasks/:id" element={<TaskPage />} />
        <Route path="/kanban/:id" element={<KanbanPage />} />
        <Route path="/reports/:id" element={<ReportsPage />} />
      </Routes>
    </div>
  );
}

export default App;