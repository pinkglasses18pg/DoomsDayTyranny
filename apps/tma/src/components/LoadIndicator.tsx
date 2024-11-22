import { useState, useEffect } from "react";
import loadIndicator from "@/assets/icons/loadder.svg";

export const LoadIndicator = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Симуляция этапов загрузки
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 10 : 100));
        }, 100); // Увеличиваем прогресс каждые 500 мс

        return () => clearInterval(interval); // Чистим интервал при размонтировании
    }, []);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-darkM space-y-6">
            {/* Статичное изображение */}
            <img
                src={loadIndicator}
                alt="Loading..."
                className="w-64 h-64 mb-6 object-contain"
            />

            {/* Прогресс-бар */}
            <div className="w-3/4 h-6 relative bg-grayBGM overflow-hidden">
                {/* Внутренний прогресс */}
                <div
                    className="h-full"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: "#C6C7C6", // Цвет из Tailwind (primaryM)
                        border: "none",
                    }}
                />

                {/* Текст внутри прогресс-бара */}
                <span
                    className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold uppercase"
                    style={{
                        letterSpacing: "0.1em",
                        color: "#ffffff",
                    }}
                >
          {progress < 100 ? "loading..." : "complete"}
        </span>
            </div>
        </div>
    );
};


