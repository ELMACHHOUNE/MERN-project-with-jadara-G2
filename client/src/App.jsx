import { useEffect, useState } from "react";
import { getCurrentUser, logout, signin, signup } from "./api/auth";

const TOKEN_KEY = "auth_token";

export default function App() {
  const [mode, setMode] = useState("signin");
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadCurrentUser = async () => {
      try {
        const data = await getCurrentUser(token);
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setError(err.message || "Session expired");
      }
    };

    loadCurrentUser();
  }, [token]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("Processing...");

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const data =
        mode === "signup"
          ? await signup({ ...payload, name: formData.name })
          : await signin(payload);

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      setStatus(data.message);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message || "Authentication failed");
      setStatus("Ready");
    }
  };

  const onLogout = async () => {
    setError("");

    try {
      const data = await logout();
      setStatus(data.message || "Logged out");
    } catch {
      setStatus("Logged out");
    }

    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <section className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">MERN Auth</h1>
        <p className="mt-2 text-sm text-gray-600">{status}</p>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {user ? (
          <div className="mt-6 space-y-3">
            <p className="text-gray-800">
              Signed in as <strong>{user.name}</strong>
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded bg-black px-4 py-2 text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 rounded px-4 py-2 ${
                  mode === "signin" ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded px-4 py-2 ${
                  mode === "signup" ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              {mode === "signup" && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={onInputChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={onInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={onInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
                minLength={6}
              />

              <button
                type="submit"
                className="w-full rounded bg-black px-4 py-2 text-white"
              >
                {mode === "signup" ? "Create Account" : "Sign In"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
