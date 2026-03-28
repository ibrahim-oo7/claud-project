import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// User Components
import Login from './components/Login';
import Register from './components/register';
import AfficherUtilisateurs from './components/AfficherUtilisateurs';
import AjouterUtilisateur from './components/AjouterUtilisateur';
import ModifierUtilisateur from './components/modifierUtilisateur';
import ProfileEdit from './components/profile';

// Project Components
import Afficher from './componentsProjects/afficher';
import MyProjects from './componentsProjects/Myprojects';
import Ajouter from './componentsProjects/ajouter';
import Modifier from './componentsProjects/modifier';
import Details from './componentsProjects/details';

// Pages
import TaskPage from './pages/TaskPage';
import KanbanPage from './pages/KanbanPage';
import ReportsPage from './pages/ReportsPage';

// chat
import ChatApp from './chat/ChatApp';

//
import Layout from './components/layout';

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
    
      <Routes>

  {/* Pages li fihom Layout (Header) */}
  <Route element={<Layout />}>
    
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
    <Route path="/myprojects" element={<MyProjects />} />
    <Route path="/ajouter" element={<Ajouter />} />
    <Route path="/modifier/:id" element={<Modifier />} />
    <Route path="/profile" element={<ProfileEdit />} />
    

    <Route path="/details/:id" element={<Details />}>
      <Route index element={<Navigate to="tasks" replace />} />
      <Route path="tasks" element={<TaskPage />} />
      <Route path="kanban" element={<KanbanPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="chat" element={<ChatApp />} />
    </Route>

  </Route>

  {/* Pages bla Layout */}
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />

</Routes>
    </div>
  );
}

export default App;