// App.js
import './App.css';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        {/* User Management */}
        <Route path="/AfficherUtilisateurs" element={<AfficherUtilisateurs />} />
        <Route path="/AjouterUtilisateur" element={<AjouterUtilisateur />} />
        <Route path="/modifierUtilisateur/:id" element={<ModifierUtilisateur />} />

        {/* Project Management */}
        <Route path="/afficher" element={<Afficher />} />
        <Route path="/ajouter" element={<Ajouter />} />
        <Route path="/modifier/:id" element={<Modifier />} />
        <Route path="/details/:id" element={<Details />} />

        {/* Pages */}
        <Route path="/tasks/:id" element={<TaskPage />} />
        <Route path="/kanban/:id" element={<KanbanPage />} />
        <Route path="/reports/:id" element={<ReportsPage />} />
      </Routes>
    </div>
  );
}

export default App;