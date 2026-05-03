"use client";

import { ReactNode, useState } from "react";

type Props = {
    children: ReactNode;
};

export default function Layout({ children }: Props) {

    const [open, setOpen] = useState(false);
    const [mathOpen, setMathOpen] = useState(false);
    const [expOpen, setExpOpen] = useState(false);

    return (
        <div className="layout">

            {/* ===== HEADER ===== */}
            <div className="admin-header">


                <div className="header-left">
                    <img src="/logo.png" className="header-logo" alt="logo"/>
                </div>

                <div className="header-title">
                    دبیرستان دوره دوم معلم شهید امینی
                </div>

                <div className="header-right"></div>
                <button
                    className="hamburger"
                    onClick={() => setOpen(!open)}
                >
                    {open ? "✕" : "☰"}
                </button>

            </div>

            {/* ===== BODY (SIDEBAR + CONTENT) ===== */}
            <div className="layout-body">

                {/* MOBILE TOP BAR */}

                {/* MAIN CONTENT */}
                <div className="main">
                    {children}
                </div>

                {/* SIDEBAR */}
                <aside className={`sidebar ${open ? "open" : ""}`}>


                    <nav>

                        <a href="/admin" className="sidebar-link">
                            صفحه اصلی
                        </a>

                        {/* ریاضی */}
                        <div>

                            <button
                                className="sidebar-section-title"
                                onClick={() => setMathOpen(!mathOpen)}
                            >
                                📘 ریاضی
                            </button>

                            <div className={`sidebar-group ${mathOpen ? "show" : ""}`}>
                                <a href="/admin/students/math/tenth" className="sidebar-link">دهم</a>
                                <a href="/admin/students/math/eleventh" className="sidebar-link">یازدهم</a>
                                <a href="/admin/students/math/twelfth" className="sidebar-link">دوازدهم</a>
                            </div>

                        </div>

                        {/* تجربی */}
                        <div>

                            <button
                                className="sidebar-section-title"
                                onClick={() => setExpOpen(!expOpen)}
                            >
                                🧪 تجربی
                            </button>

                            <div className={`sidebar-group ${expOpen ? "show" : ""}`}>
                                <a href="/admin/students/exp/tenth" className="sidebar-link">دهم</a>
                                <a href="/admin/students/exp/eleventh" className="sidebar-link">یازدهم</a>
                                <a href="/admin/students/exp/twelfth" className="sidebar-link">دوازدهم</a>
                            </div>

                        </div>

                    </nav>

                </aside>

            </div>

        </div>
    );
}