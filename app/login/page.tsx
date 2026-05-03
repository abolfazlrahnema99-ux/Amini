"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const login = async () => {
        try {
            setLoading(true);

            const res = await fetch("http://127.0.0.1:8000/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!data.ok) {
                setError(data.message);
                return;
            }

            localStorage.setItem("admin", JSON.stringify(data.admin));

            router.push("/admin");

        } catch (err) {
            setError("خطا در اتصال به سرور");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <div className="form-wrapper">

                <div className="form-box">

                    <h2 className="title">ورود ادمین</h2>

                    <input
                        className="input"
                        placeholder="ایمیل"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="input"
                        placeholder="رمز عبور"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <div className="error-text">{error}</div>
                    )}

                    <button className="button" onClick={login}>
                        {loading ? "در حال ورود..." : "ورود"}
                    </button>

                </div>

            </div>

        </div>
    );
}