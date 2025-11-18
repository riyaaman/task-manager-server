import { Link } from "react-router-dom";

function Layout({ children, title }) {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1>{title}</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      <main className="layout-content">{children}</main>

      <footer className="layout-footer">
        <p>Built with React &amp; Context API. &copy; 2025</p>
      </footer>
    </div>
  );
}

export default Layout;
