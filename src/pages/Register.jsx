import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "../api/axios";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [pwd, setPwd] = useState("");
  const [rpwd, setRPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!email || !pseudo || !pwd || !rpwd) {
      setErr("Please fill in all fields.");
      return;
    }
    if (pwd !== rpwd) {
      setErr("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/register", {
        email,
        pseudo,
        password: pwd,
      });

      //direct login thanks Lexik
      const { data } = await api.post("/api/login_check", {
        email: email,
        password: pwd,
      });

      const token = data?.token;
      if (!token) throw new Error("Token manquant après l'inscription.");

      login({ token, user: { email, pseudo } });
      navigate("/");
    } catch (e) {
      const apiMsg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Inscription failed.";
      setErr(apiMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="entropy-page">
      <form className="entropy-card" onSubmit={onSubmit} aria-labelledby="regTitle">
        <h1 id="regTitle" className="entropy-title">Welcome on EntropyGuard !</h1>

        <label className="entropy-label" htmlFor="email">Email</label>
        <div className="entropy-input-wrap">
          <input id="email" type="email" className="entropy-input" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>

        <label className="entropy-label" htmlFor="pseudo">Pseudo</label>
        <div className="entropy-input-wrap">
          <input id="pseudo" className="entropy-input" placeholder="pseudo"
            value={pseudo} onChange={(e) => setPseudo(e.target.value)} required autoComplete="nickname" />
        </div>

        <label className="entropy-label" htmlFor="password">Password</label>
        <div className="entropy-input-wrap entropy-input-with-btn">
          <input id="password" type={showPwd ? "text" : "password"} className="entropy-input"
            placeholder="••••••••" value={pwd} onChange={(e) => setPwd(e.target.value)}
            required autoComplete="new-password" />
          <button type="button" className="entropy-btn tiny"
            onClick={() => setShowPwd((v) => !v)} aria-label={showPwd ? "Hide password" : "Show password"}>
            <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
          </button>
        </div>

        <label className="entropy-label" htmlFor="password2">Repeat Password</label>
        <div className="entropy-input-wrap entropy-input-with-btn">
          <input id="password2" type={showPwd ? "text" : "password"} className="entropy-input"
            placeholder="••••••••" value={rpwd} onChange={(e) => setRPwd(e.target.value)}
            required autoComplete="new-password" />
          <button type="button" className="entropy-btn tiny"
            onClick={() => setShowPwd((v) => !v)} aria-label={showPwd ? "Hide password" : "Show password"}>
            <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
          </button>
        </div>

        {err && <p className="entropy-error" role="alert">{err}</p>}

        <button className="entropy-btn primary" type="submit" disabled={loading}>
          {loading ? "Signing up…" : "Sign up"}
        </button>

        <p className="entropy-helper">
          Already have an account ? <Link to="/login" className="entropy-link">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
