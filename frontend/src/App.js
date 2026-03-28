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

// chat
import ChatApp from './chat/ChatApp';

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

        <Route path="/details/:id" element={<Details />}>
          <Route index element={<Navigate to="tasks" replace />} />
          <Route path="tasks" element={<TaskPage />} />
          <Route path="kanban" element={<KanbanPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="chat" element={<ChatApp />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;