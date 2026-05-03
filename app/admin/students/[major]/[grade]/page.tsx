"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

    const params = useParams();

    const major = Array.isArray(params.major) ? params.major[0] : params.major;
    const grade = Array.isArray(params.grade) ? params.grade[0] : params.grade;

    const majorMap: any = {
        math: "ریاضی",
        exp: "تجربی"
    };

    const gradeMap: any = {
        tenth: "دهم",
        eleventh: "یازدهم",
        twelfth: "دوازدهم"
    };

    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [search, setSearch] = useState("");

    // فقط برای کنترل رفرش
    const [refresh, setRefresh] = useState(0);

    // ===== FETCH =====
    useEffect(() => {

        async function fetchStudents(isInitial = false) {
            try {

                // فقط بار اول loading
                if (isInitial) setLoading(true);

                const res = await fetch(
                    `http://127.0.0.1:8000/api/students/${major}/${grade}`
                );

                const data = await res.json();

                setStudents(data);

            } catch (err) {
                console.log(err);
            } finally {

                if (isInitial) setLoading(false);
            }
        }

        // اولین بار
        if (major && grade) {
            fetchStudents(true);
        }

        // 🔥 رفرش لایو بدون loading
        const interval = setInterval(() => {
            fetchStudents(false);
        }, 5000);

        return () => clearInterval(interval);

    }, [major, grade]);



    // ===== SEARCH FILTER =====
    const filteredStudents = students.filter((s) => {
        const fullName = `${s.first_name} ${s.last_name}`;

        return (
            fullName.includes(search) ||
            s.national_code?.includes(search)
        );
    });

    return (
        <div className="students-page">

            {/* ===== HEADER ===== */}
            <div className="students-header">

                <h1 className="students-title">
                    📚 لیست دانش‌آموزان
                </h1>

                <p className="students-subtitle">
                    رشته: {majorMap[major as string] ?? major}
                    {" | "}
                    پایه: {gradeMap[grade as string] ?? grade}
                </p>

            </div>

            {/* ===== SEARCH BOX ===== */}
            <div className="search-box">
                <input
                    className="search-input"
                    placeholder="جستجو بر اساس نام یا کد ملی..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* ===== LIST ===== */}
            <div className="students-grid">

                {loading ? (
                    <p>در حال بارگذاری...</p>
                ) : filteredStudents.length === 0 ? (
                    <p>هیچ دانش‌آموزی ثبت نشده</p>
                ) : (

                    filteredStudents.map((s, i) => (
                        <div
                            key={i}
                            className="student-card"
                            onClick={() => setSelectedStudent(s)}
                        >
                            <div className="student-name">
                                {s.first_name} {s.last_name}
                            </div>

                            <div className="student-info">
                                📄 کد ملی: {s.national_code}
                            </div>

                            <div className="student-info">
                                📊 معدل: {s.gpa}
                            </div>
                        </div>
                    ))

                )}

            </div>

            {/* ===== MODAL ===== */}
            {selectedStudent && (
                <div className="modal fade-in">

                    <div className="modal-dialog-centered">

                        <div className="modal-content-box">

                            <div className="modal-header">
                                <h2>اطلاعات دانش‌آموز</h2>
                                <button onClick={() => setSelectedStudent(null)}>✕</button>
                            </div>

                            <div className="modal-body">

                                <div className="success-item"><span>👤</span> {selectedStudent.first_name} {selectedStudent.last_name}</div>
                                <div className="success-item"><span>👨</span> نام پدر: {selectedStudent.father_name}</div>
                                <div className="success-item"><span>🎂</span> تاریخ تولد: {selectedStudent.birth_date}</div>
                                <div className="success-item"><span>🎓</span> {selectedStudent.grade}</div>
                                <div className="success-item"><span>🏫</span> {selectedStudent.school}</div>
                                <div className="success-item"><span>🆔</span> {selectedStudent.national_code}</div>
                                <div className="success-item"><span>📱</span> مادر: {selectedStudent.mother_phone}</div>
                                <div className="success-item"><span>📱</span> پدر: {selectedStudent.father_phone}</div>
                                <div className="success-item"><span>🏠</span> {selectedStudent.home_phone}</div>
                                <div className="success-item"><span>📌</span> {selectedStudent.address}</div>
                                <div className="success-item"><span>📘</span> رشته: {selectedStudent.major}</div>
                                <div className="success-item"><span>📊</span> معدل: {selectedStudent.gpa}</div>

                            </div>

                            <div className="modal-footer">
                                <button onClick={() => setSelectedStudent(null)}>
                                    بستن
                                </button>
                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}