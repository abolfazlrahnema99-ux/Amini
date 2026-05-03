"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
    const [code, setCode] = useState(["", "", "", "", ""]);
    const [error, setError] = useState("");
    const [phone, setPhone] = useState("");

    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const inputs = useRef<Array<HTMLInputElement | null>>([]);

    // 📱 گرفتن شماره
    useEffect(() => {
        const savedPhone = localStorage.getItem("phone");
        if (savedPhone) {
            setPhone(savedPhone);
        }
    }, []);

    // ⏱ تایمر 120 ثانیه
    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // 🔁 ارسال مجدد کد
    const handleResend = async () => {
        try {
            setTimer(120);
            setCanResend(false);

            await fetch("http://sch-amini.ir/api/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone })
            });

        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 4) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: any, index: number) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    // ✅ VERIFY واقعی
    const handleVerify = async () => {
        const finalCode = code.join("");

        if (finalCode.length !== 5) {
            setError("کد وارد شده نامعتبر است");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("http://127.0.0.1:8000/api/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone,
                    code: finalCode
                })
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.message || "کد اشتباه است");
                return;
            }

            // ✅ موفق → رفتن به فرم ثبت نام
            router.push("/register");

        } catch (err) {
            setError("خطا در ارتباط با سرور");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            {/* LEFT */}
            <div className="left-panel">
                <div className="left-content">

                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={120}
                        height={120}
                        className="logo"
                    />

                    <div className="left-subtitle">
                        سیستم ثبت‌نام دانش‌آموزان
                    </div>

                </div>
            </div>

            {/* FORM */}
            <div className="form-wrapper">

                <div className="form-box">

                    <div className="mobile-header">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={90}
                            height={90}
                            className="logo"
                        />
                    </div>

                    <div className="title">
                        ثبت نام مراحل پذیرش 1405 - 1406
                    </div>

                    <div className="title">
                        تایید شماره موبایل
                    </div>

                    <div className="subtitle">
                        کد تایید برای شماره {phone} پیامک شد
                    </div>

                    {/* OTP */}
                    <div className="otp-container">
                        {code.map((num, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputs.current[index] = el;
                                }}
                                className="otp-box"
                                type="text"
                                maxLength={1}
                                value={num}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="error-text">
                            {error}
                        </div>
                    )}

                    <button className="button" onClick={handleVerify}>
                        {loading ? "در حال بررسی..." : "تایید کد"}
                    </button>

                    {/* ⏱ تایمر */}
                    <div className="login-info" style={{ marginTop: "15px" }}>

                        {!canResend ? (
                            <div className="login-subtitle">
                                ⏳ ارسال مجدد کد تا {timer} ثانیه دیگر
                            </div>
                        ) : (
                            <button
                                className="button"
                                onClick={handleResend}
                            >
                                ارسال مجدد کد
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}