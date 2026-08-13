import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { AuthUser } from "../../types/auth";
import { continueAsGuest, login, loginWithApple, loginWithGoogle, register } from "../../services/authService";
import TravelGlobe from "../3d/TravelGlobe";
import "./AuthModal.css";
import boraLogo from "../../assets/bora-embora-logo.png";

type AuthMode = "login" | "register";

interface AuthModalProps {
  onClose: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

export default function AuthModal({ onClose, onAuthenticated }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function changeMode(next: AuthMode) {
    setMode(next);
    setError("");
    setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (mode === "register" && !name.trim()) {
      setError("Digite seu nome para criar sua conta.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Preencha seu e-mail e sua senha.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Digite um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = mode === "login"
        ? await login(email, password)
        : await register(name, email, password);

      onAuthenticated(user);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Não foi possível concluir o acesso.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGuest() {
    onAuthenticated(continueAsGuest());
  }

  async function handleProvider(provider: "google" | "apple") {
    setError("");
    setNotice("");
    const result = provider === "google" ? await loginWithGoogle() : await loginWithApple();
    if (result.configured && result.redirectUrl) {
      window.location.assign(result.redirectUrl);
      return;
    }
    setNotice(result.message || "Esse acesso será conectado ao backend.");
  }

  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`auth-modal auth-modal-${mode}`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="auth-three-scene" aria-hidden="true"><TravelGlobe agent={mode === "login" ? "lu" : "theo"} theme="dark" /></div>
        <div className="auth-universe" aria-hidden="true">
          <span className="auth-star auth-star-one" />
          <span className="auth-star auth-star-two" />
          <span className="auth-star auth-star-three" />
          <div className="auth-planet"><span /></div>
          <div className="auth-route"><i>✦</i><i>✦</i><i>✦</i></div>
        </div>

        <button className="auth-modal-close" type="button" onClick={onClose} aria-label="Fechar">×</button>

        <button className="auth-modal-brand auth-modal-brand-button" type="button" onClick={onClose} aria-label="Fechar e voltar para o Bora Embora"><img className="auth-modal-brand-logo" src={boraLogo} alt="Bora Embora" /></button>

        <div className="auth-modal-heading">
          <span>SEU PASSAPORTE DIGITAL</span>
          <h2 id="auth-title">{mode === "login" ? "Bora continuar." : "Comece sua jornada."}</h2>
          <p>{mode === "login" ? "Entre para conversar com a Lu ou o Theo e manter suas viagens por perto." : "Crie sua conta e deixe o Bora Embora lembrar das suas próximas aventuras."}</p>
        </div>

        <div className="auth-modal-tabs" role="tablist">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")} role="tab" aria-selected={mode === "login"}>Entrar</button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => changeMode("register")} role="tab" aria-selected={mode === "register"}>Criar conta</button>
        </div>

        <form className={`auth-modal-form ${mode === "register" ? "is-register" : ""}`} onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>Nome<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos chamar você?" autoComplete="name" /></label>
          )}
          <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" autoComplete="email" /></label>
          <label>Senha
            <span className="auth-password-field">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? "◉" : "◌"}</button>
            </span>
          </label>
          {mode === "register" && <label>Confirmar senha<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repita sua senha" autoComplete="new-password" /></label>}

          {mode === "login" && <button type="button" className="auth-forgot" onClick={() => setNotice("A recuperação de senha ficará disponível quando o backend estiver conectado.")}>Esqueci minha senha</button>}

          {error && <p className="auth-modal-error" role="alert">{error}</p>}
          {notice && <p className="auth-modal-notice" role="status">{notice}</p>}

          <button className={`auth-modal-submit ${isSubmitting ? "is-loading" : ""}`} type="submit" disabled={isSubmitting}>
            <span className="auth-button-spark spark-one" aria-hidden="true">✦</span>
            <span className="auth-button-spark spark-two" aria-hidden="true">·</span>
            <span className="auth-rocket-wrap" aria-hidden="true">
              <span className="auth-rocket">🚀</span>
              <span className="auth-rocket-flame">✦</span>
            </span>
            <span>{isSubmitting ? "Preparando sua jornada..." : mode === "login" ? "Entrar e continuar" : "Criar minha conta"}</span>
          </button>
        </form>

        <div className="auth-divider"><span>ou continue com</span></div>

        <div className="auth-social-grid">
          <button type="button" onClick={() => handleProvider("google")}><strong>G</strong> Google</button>
          <button type="button" onClick={() => handleProvider("apple")}><strong></strong> Apple</button>
        </div>

        <button type="button" className="auth-guest-button" onClick={handleGuest}>Continuar como convidado <span>→</span></button>

        <p className="auth-switch-copy">
          {mode === "login" ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
          <button type="button" onClick={() => changeMode(mode === "login" ? "register" : "login")}>{mode === "login" ? " Criar conta" : " Entrar"}</button>
        </p>
      </section>
    </div>
  );
}
