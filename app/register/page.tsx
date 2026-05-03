"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegister() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const register = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch("http://sch-amini.ir/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.message || "خطا در ثبت نام");
                return;
            }

            // ذخیره موقت یا رفتن به لاگین
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

                    <h2 className="title">ثبت نام ادمین</h2>

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

                    <button className="button" onClick={register}>
                        {loading ? "در حال ثبت نام..." : "ثبت نام"}
                    </button>

                </div>

            </div>

        </div>
    );
}