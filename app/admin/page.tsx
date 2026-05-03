"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function DashboardHeaderInfo() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const date = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(time);

    const clock = new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(time);

    return (
        <div className="dashboard-header-info" style={{ direction: "rtl" }}>
            <div>📅 {date}</div>
            <div>{clock} ⏰</div>
        </div>
    );
}

export default function Page() {

    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 🔐 CHECK LOGIN (اصلاح شده)
    useEffect(() => {
        const admin = localStorage.getItem("admin");

        if (!admin) {
            router.replace("/admin/login");
            return;
        }

        setLoading(false);
    }, [router]);

    // ===== گرفتن دیتا از API =====
    useEffect(() => {

        async function fetchStats() {
            try {
                const res = await fetch("http://sch-amini.ir/api/stats");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.log(err);
            }
        }

        fetchStats();

    }, []);

    // ⛔ جلوگیری از رندر قبل از چک لاگین
    if (loading) return null;

    return (
        <div className="dashboard">

            <h1 className="dashboard-title">
                داشبورد ادمین
            </h1>

            <DashboardHeaderInfo />

            <div className="cards">

                <div className="card">
                    <h2>📊 کل ثبت‌نام‌ها</h2>
                    <p>{stats?.total ?? 0} نفر</p>
                </div>

                <div className="card">
                    <h2>📘 ریاضی</h2>
                    <p>{stats?.math ?? 0} نفر</p>
                </div>

                <div className="card">
                    <h2>🧪 تجربی</h2>
                    <p>{stats?.exp ?? 0} نفر</p>
                </div>

            </div>

            <div className="today-box">

                <h2 className="today-title">
                    ثبت‌نام‌های امروز 📌
                </h2>

                <div className="today-grid">

                    <div className="today-item">
                        <h3>📘 ریاضی</h3>
                        <p>دهم: {stats?.today_math_tenth ?? 0} نفر</p>
                        <p>یازدهم: {stats?.today_math_eleventh ?? 0} نفر</p>
                        <p>دوازدهم: {stats?.today_math_twelfth ?? 0} نفر</p>
                    </div>

                    <div className="today-item">
                        <h3>🧪 تجربی</h3>
                        <p>دهم: {stats?.today_exp_tenth ?? 0} نفر</p>
                        <p>یازدهم: {stats?.today_exp_eleventh ?? 0} نفر</p>
                        <p>دوازدهم: {stats?.today_exp_twelfth ?? 0} نفر</p>
                    </div>

                </div>

            </div>

        </div>
    );
}