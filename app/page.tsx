"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // 📱 validate
    const validatePhone = (value: string) => {
        const isValid = /^09\d{9}$/.test(value.trim());

        if (!isValid) {
            setError("شماره موبایل معتبر نیست");
            return false;
        }

        setError("");
        return true;
    };

    // 🚀 ارسال OTP + رفتن به verify
    const handleSubmit = async () => {
        if (!validatePhone(phone)) return;

        try {
            setLoading(true);

            const res = await fetch("http://sch-amini.ir/api/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone: phone
                })
            });

            const data = await res.json();

            console.log("OTP RESPONSE:", data);

            // ذخیره شماره برای صفحه verify
            localStorage.setItem("phone", phone);

            router.push("/verify");

        } catch (err) {
            console.log(err);
            setError("خطا در ارسال کد");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            {/* 💻 سمت چپ */}
            <div className="left-panel">
                <div className="left-content">

                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={120}
                        height={120}
                        className="logo"
                    />

                    <div className="left-subtitle" style={{ direction: "rtl"}}>
                        اینجا تنها یک مدرسه نیست ، تجربه یک زندگی است!
                    </div>

                </div>
            </div>

            {/* 🧾 فرم */}
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
                        پذیرش سال تحصیلی 1405 - 1406
                    </div>

                    <div className="subtitle-1">
                        به پنل ثبت نام دبیرستان دوره دوم معلم شهید امینی خوش آمدید!
                    </div>

                    <div className="subtitle">
                        .شماره موبایل خود را وارد کنید
                    </div>

                    <input
                        className="input"
                        type="text"
                        placeholder="شماره موبایل"
                        value={phone}
                        maxLength={11}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (!/^\d*$/.test(value)) return;

                            setPhone(value);

                            if (/^09\d{0,9}$/.test(value)) {
                                setError("");
                            }
                        }}
                    />

                    {/* 🚨 خطا */}
                    {error && (
                        <div className="error-text">
                            {error}
                        </div>
                    )}

                    <button className="button" onClick={handleSubmit}>
                        {loading ? "در حال ارسال..." : "ورود"}
                    </button>

                    <div className="login-info">

                        <div className="login-title">
                            ورود به حساب کاربری
                        </div>

                        <div className="login-subtitle">
                            توجه بفرمایید پس از ثبت نام در مراحل پذیرش، کلیه مراحل مصاحبه، ارزیابی‌ها، آزمون و ثبت نام
                            به صورت حضوری یا مجازی انجام می‌گردد.
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}