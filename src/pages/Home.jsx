import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="entropy-page">
      <div className="entropy-card" style={{ textAlign: "center" }}>
        <h1>Bonjour, {user?.pseudo || user?.email || "utilisateur"} 👋</h1>
        <p>Bienvenue sur ta page d’accueil protégée.</p>
        <button className="entropy-btn primary" onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
