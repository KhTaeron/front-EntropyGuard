import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
      // 👉 ici tu peux appeler ton API réelle plus tard
      // ex: const { data } = await api.post("/api/login", { email, password: pwd });
      // login({ token: data.token, user: data.user });

      // pour l’instant : login "fake"
      await new Promise((r) => setTimeout(r, 500)); // petite latence
      if (!email || !pwd) throw new Error("Please fill in all fields.");
      login({ token: "fake-token", user: { email } });
      navigate("/");
    } catch (e) {
      setErr(e.message || "Login failed.");
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
