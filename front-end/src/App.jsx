// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import TaskForm from "./components/TaskForm";
// import TodoList from "./components/TodoList";
// import { TaskProvider } from "./context/TaskProvider";
// import TaskControls from "./components/TaskControls";
// import "./App.css";

// // --- PAGE COMPONENTS (Simple wrappers for Routes) ---
// const Dashboard = () => (
//   <div className="todo-app-wrapper">
//     <TaskControls />
//     <br />
//     <TaskForm />
//     <hr />
//     <TodoList />
//   </div>
// );
// const AboutPage = () => (
//   <div className="todo-app-wrapper">
//     <h1>About the Project</h1>
//     <p>This application demonstrates key professional React concepts:</p>
//     <ul>
//       <li>Global State Management with Context API and Hooks.</li>
//       <li>Component Composition and Reusability.</li>
//       <li>Routing with React Router DOM.</li>
//       <li>Form management with Controlled Components.</li>
//     </ul>
//   </div>
// );
// // --- END PAGE COMPONENTS ---

// function App() {
//   return (
//     <BrowserRouter>
//       {/* The Provider makes state available globally */}
//       <TaskProvider>
//         {/* The Layout provides the consistent structure (Header/Footer/Nav) */}
//         <Layout title="React Task Manager">
//           <Routes>
//             {/* Define routes for the different pages */}
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/about" element={<AboutPage />} />
//             <Route
//               path="*"
//               element={
//                 <div className="todo-app-wrapper">
//                   <h2>404: Page Not Found</h2>
//                 </div>
//               }
//             />
//           </Routes>
//         </Layout>
//       </TaskProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

// src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import TaskForm from "./components/TaskForm";
import TodoList from "./components/TodoList";
import TaskControls from "./components/TaskControls"; // <-- 1. NEW: Import TaskControls
import { TaskProvider } from "./context/TaskProvider";
import "./App.css";
import { Toaster } from "react-hot-toast";

// --- PAGE COMPONENTS (Wrappers for Routes) ---

const Dashboard = () => (
  <div className="todo-app-wrapper">
    {/* 2. PLACEMENT: TaskControls should go here to affect the list */}
    <TaskControls />

    <TaskForm />
    <hr />

    <TodoList />
  </div>
);

const AboutPage = () => (
  <div className="todo-app-wrapper">
    <h2>About the Project</h2>
    <p>This application demonstrates key professional React concepts:</p>
    <ul>
      <li>Global State Management with Context API and Hooks.</li>
      <li>Component Composition and Reusability.</li>
      <li>Routing with React Router DOM.</li>
      <li>Form management with Controlled Components.</li>
    </ul>
  </div>
);

// --- MAIN APP COMPONENT ---

function App() {
  return (
    <BrowserRouter>
      {/* TaskProvider must wrap everything that needs access to the state */}
      <TaskProvider>
        {/* Place the Toaster component here. It listens for all toast calls. */}
        <Toaster position="top-right" reverseOrder={false} />
        {/* Layout provides consistent header/navigation */}
        <Layout title="React Task Manager">
          <Routes>
            {/* The main route displays the Dashboard (Form, Controls, List) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<AboutPage />} />

            {/* 404 Route */}
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
