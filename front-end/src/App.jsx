import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import TaskForm from "./components/TaskForm";
import TodoList from "./components/TodoList";
import { TaskProvider } from "./context/TaskProvider";
import "./App.css";

// --- PAGE COMPONENTS (Simple wrappers for Routes) ---
const Dashboard = () => (
  <div className="todo-app-wrapper">
    <TaskForm />
    <hr />
    <TodoList />
  </div>
);
const AboutPage = () => (
  <div className="todo-app-wrapper">
    <h1>About the Project</h1>
    <p>This application demonstrates key professional React concepts:</p>
    <ul>
      <li>Global State Management with Context API and Hooks.</li>
      <li>Component Composition and Reusability.</li>
      <li>Routing with React Router DOM.</li>
      <li>Form management with Controlled Components.</li>
    </ul>
  </div>
);
// --- END PAGE COMPONENTS ---

function App() {
  return (
    <BrowserRouter>
      {/* The Provider makes state available globally */}
      <TaskProvider>
        {/* The Layout provides the consistent structure (Header/Footer/Nav) */}
        <Layout title="Professional React Task Manager">
          <Routes>
            {/* Define routes for the different pages */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="*"
              element={
                <div className="todo-app-wrapper">
                  <h2>404: Page Not Found</h2>
                </div>
              }
            />
          </Routes>
        </Layout>
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;
