"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  User,
  Mail,
  Hash,
  GraduationCap,
  MessageCircle,
  Code,
  Palette,
  Brain,
  Gamepad2,
  Smartphone,
  Cpu,
  HelpCircle,
  Trophy,
  Send,
  Sparkles,
} from "lucide-react";

export default function DevSignupForm() {
  const [formData, setFormData] = useState({
    aka: "",
    name: "",
    stuid: "",
    faculty: "",
    email: "",
    disname: "",
    level: "",
    interested: [],
    experience: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to store backend error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage(""); // Reset error message before new submission

    const dataToSend = {
      ...formData,
      interested: formData.interested.join(","),
    };
    console.log("Sending data:", dataToSend); // Log data being sent

    try {
      const response = await axios.post("/api/form", dataToSend);
      console.log("Form submission successful:", response.data);
      setShowSuccess(true);
      // Optional: Reset form data after successful submission
      // setFormData({
      //   aka: "", name: "", stuid: "", faculty: "", email: "",
      //   disname: "", level: "", interested: [], experience: "",
      // });
    } catch (error) {
      console.error("Form submission error:", error);
      // Check if the error has a response from the server with a custom message
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Use backend error message
      } else {
        setErrorMessage("An unexpected error occurred. Please try again."); // Generic fallback
      }
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const programmingLevels = [
    {
      id: "ไม่เคยเลย (แต่อยากเริ่ม)",
      label: "ไม่เคยเลย (แต่อยากเริ่ม)",
      icon: "🌱",
    },
    {
      id: "เคยนิดหน่อย",
      label: "เคยนิดหน่อย (Python, HTML, Scratch ฯลฯ)",
      icon: "🌿",
    },
    { id: "เคยทำโปรเจกต์เล็ก ๆ", label: "เคยทำโปรเจกต์เล็ก ๆ", icon: "🌳" },
    {
      id: "เขียนโค้ดบ่อย ๆ อยู่แล้ว",
      label: "เขียนโค้ดบ่อย ๆ อยู่แล้ว",
      icon: "💻",
    },
    { id: "Dev ตัวพ่อ / ตัวแม่", label: "Dev ตัวพ่อ / ตัวแม่", icon: "👑" },
  ];

  const interests = [
    { id: "web", label: "Web Development", icon: Code, color: "bg-blue-500" },
    {
      id: "mobile",
      label: "Mobile App",
      icon: Smartphone,
      color: "bg-green-500",
    },
    {
      id: "iot",
      label: "IoT / Arduino / Robot",
      icon: Cpu,
      color: "bg-purple-500",
    },
    {
      id: "ai",
      label: "AI / Data Science / ML",
      icon: Brain,
      color: "bg-pink-500",
    },
    {
      id: "game",
      label: "Game Development",
      icon: Gamepad2,
      color: "bg-red-500",
    },
    {
      id: "design",
      label: "UX/UI Design",
      icon: Palette,
      color: "bg-yellow-500",
    },
    {
      id: "explore",
      label: "ยังไม่รู้ แต่สนใจอยากลอง",
      icon: HelpCircle,
      color: "bg-indigo-500",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestChange = (interestId) => {
    setFormData((prev) => ({
      ...prev,
      interested: prev.interested.includes(interestId)
        ? prev.interested.filter((id) => id !== interestId)
        : [...prev.interested, interestId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-pink-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-4xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Dev Behind the Room
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
            สมัครสมาชิกชมรมนักพัฒนา
          </h1>
          <p className="text-gray-600">
            เข้าร่วมชุมชนนักพัฒนาที่มีชีวิตชีวา
            พร้อมเรียนรู้และสร้างสรรค์ไปด้วยกัน
          </p>
        </div>
        {/* Use <form> tag to enable submission by pressing Enter and handle handleSubmit here */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              ข้อมูลส่วนตัว
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="aka"
                  className="block text-sm font-medium text-gray-700"
                >
                  ชื่อเล่น (AKA)
                </label>
                <input
                  type="text"
                  id="aka"
                  name="aka"
                  value={formData.aka}
                  onChange={handleInputChange}
                  // ADDED: text-gray-800 for input text color, placeholder-gray-500 for placeholder color
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-800 placeholder-gray-500"
                  placeholder="ชื่อเล่นที่ใช้ในชมรม"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  // ADDED: text-gray-800 for input text color, placeholder-gray-500 for placeholder color
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-800 placeholder-gray-500"
                  placeholder="ชื่อจริงของคุณ"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="stuid"
                  className="block text-sm font-medium text-gray-700"
                >
                  รหัสนักศึกษา
                </label>
                <input
                  type="text"
                  id="stuid"
                  name="stuid"
                  value={formData.stuid}
                  onChange={handleInputChange}
                  // ADDED: text-gray-800 for input text color, placeholder-gray-500 for placeholder color
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-800 placeholder-gray-500"
                  placeholder="รหัสนักศึกษา"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="faculty"
                  className="block text-sm font-medium text-gray-700"
                >
                  คณะ/สาขา/มหาลัย/ปี
                </label>
                <input
                  type="text"
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  // ADDED: text-gray-800 for input text color, placeholder-gray-500 for placeholder color
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-800 placeholder-gray-500"
                  placeholder="เช่น วิศวกรรมคอมพิวเตอร์ ปี 2"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  อีเมล
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  // ADDED: text-gray-800 for input text color, placeholder-gray-500 for placeholder color
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-800 placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="disname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discord Username
                </label>
                <input
                  type="text"
                  id="disname"
                  name="disname"
                  value={formData.disname}
                  onChange={handleInputChange}
                  // ADDED: text-gray-800 for input text color, placeholder-gray-500 for placeholder color
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-800 placeholder-gray-500"
                  placeholder="username#1234"
                />
              </div>
            </div>
          </div>

          {/* ระดับการเขียนโปรแกรม */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Code className="w-5 h-5 text-orange-500" />
              ระดับการเขียนโปรแกรม
            </h2>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              // ADDED: text-gray-800 for select text color
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 hover:bg-orange-50 hover:border-orange-300 appearance-none"
            >
              <option value="">เลือกระดับของคุณ</option>
              {programmingLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.icon} {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Interests */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-500" />
              สนใจด้านไหนในสาย Dev?
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">
              {interests.map((interest) => {
                const IconComponent = interest.icon;
                const isSelected = formData.interested.includes(interest.id);

                return (
                  <div
                    key={interest.id}
                    className={`relative overflow-hidden border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 bg-white/50 hover:border-gray-300"
                    }`}
                    onClick={() => handleInterestChange(interest.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${interest.color} flex items-center justify-center`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-800">
                        {interest.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-transparent pointer-events-none"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Workshops */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              ประสบการณ์ Workshop
            </h2>

            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              // ADDED: text-gray-800 for textarea text color, placeholder-gray-500 for placeholder color
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/50 resize-none h-32 text-gray-800 placeholder-gray-500"
              placeholder="ประสบการณ์ Workshop/ความถนัดด้านอื่นๆ(ใส่ภาษาโปรแกรมมิ่งที่เคยศึกษาได้)"
            />
          </div>
          <div className="text-gray-700 text-center text-sm leading-relaxed max-w-2xl mx-auto">
            <p className="mb-2">
              ชมรมเดฟหลังห้องของเรา
              เกิดจากความตั้งใจอยากรวมตัวของเหล่าเดฟจากทุกสายงาน ไม่ว่าจะสายเว็บ
              เกม แอป หรือฮาร์ดแวร์ ก็มาเจอกันตรงนี้ได้
              ที่นี่เราจะจัดพื้นที่ไว้สำหรับแลกเปลี่ยนความรู้ ช่วยกันติว
              แชร์โปรเจกต์ และหาเพื่อนลงแข่งฮัคกาธอนหรือเวทีแข่งขันต่าง ๆ
              ทั้งในมหา'ลัยและนอกสถานที่ ไม่ต้องเก่งก็มาได้ แค่มีใจรักในการพัฒนา
              อยากเรียนรู้ และอยากมีเพื่อนร่วมทาง เราเชื่อว่าทุกคนมีของ
              และที่นี่คือที่ที่คุณจะได้ปล่อยของนั้นออกมา
              ถ้าคุณกำลังมองหาชมรมที่เขียนโค้ดไป หัวเราะไป
              แถมยังได้เติบโตไปพร้อมกัน Dev Behind the Room กำลังรอคุณอยู่
            </p>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    กำลังส่งใบสมัคร...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    สมัครสมาชิก
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
        {/* Success Message Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white text-center rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto transform transition-all duration-300 scale-100">
              <div className="p-6 sm:p-8 md:p-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                  🎉 สมัครสมาชิกสำเร็จ!
                </h2>

                <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
                  ยินดีต้อนรับเข้าสู่ชมรม Dev Behind the Room
                  <br />
                  <span className="text-orange-500 font-medium">
                    เราจะติดต่อกลับโดยเร็วที่สุด!
                  </span>
                </p>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message Modal */}
        {showError && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white text-center rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto transform transition-all duration-300 scale-100">
              <div className="p-6 sm:p-8 md:p-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                  ⚠️ เกิดข้อผิดพลาด!
                </h2>

                <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
                  {errorMessage ||
                    "ไม่สามารถส่งใบสมัครได้ กรุณาลองใหม่อีกครั้ง"}
                </p>

                <button
                  onClick={() => setShowError(false)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Start Copyright Section - OUTSIDE the form box */}
        <footer className="w-full max-w-4xl mt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Dev Behind the Room. All rights
            reserved.
          </p>
          <p>Designed and Developed with ❤️ by Jitwisut</p>
          <p className="mt-2 text-xs">For educational purposes only.</p>
        </footer>
        {/* End Copyright Section */}
      </div>
    </div>
  );
}
