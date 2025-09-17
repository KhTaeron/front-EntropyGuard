import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "../api/axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/login_check", {
        email: email,
        password: pwd,
      });

      const token = data.token;
      if (!token) throw new Error("Token manquant dans la réponse.");

      login({ token, user: { email } });
      navigate("/");
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Échec de la connexion.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="entropy-page">
      <form
        className="entropy-card"
        onSubmit={onSubmit}
        aria-labelledby="loginTitle"
      >
        <h1 id="loginTitle" className="entropy-title">
          Welcome back
        </h1>

        <label className="entropy-label" htmlFor="email">
          Email
        </label>
        <div className="entropy-input-wrap">
          <input
            id="email"
            type="email"
            className="entropy-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <label className="entropy-label" htmlFor="password">
          Password
        </label>
        <div className="entropy-input-wrap entropy-input-with-btn">
          <input
            id="password"
            type={showPwd ? "text" : "password"}
            className="entropy-input"
            placeholder="••••••••"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="entropy-btn tiny"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? "Hide password" : "Show password"}
          >
            <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
          </button>
        </div>

        {err && (
          <p className="entropy-error" role="alert">
            {err}
          </p>
        )}

        <button
          className="entropy-btn primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="entropy-helper">
          New here?{" "}
          <Link to="/signup" className="entropy-link">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
