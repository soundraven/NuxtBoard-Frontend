/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{vue,js,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
    ],

    darkMode: "class", // 다크 모드 활성화 방법 ('class' 또는 'media')
    theme: {
        extend: {
            // 커스터마이징할 내용 추가
            colors: {
                // TailwindCSS의 기본 색상 팔레트를 확장
                primary: "#1DA1F2",
                secondary: "#14171A",
            },
            spacing: {
                // TailwindCSS의 기본 여백 값을 확장
                128: "32rem",
            },
            borderRadius: {
                // TailwindCSS의 기본 테두리 반경 값을 확장
                "4xl": "2rem",
            },
        },
    },
    variants: {
        extend: {
            // 필요한 경우 TailwindCSS의 변형을 확장
            backgroundColor: ["dark"], // 다크 모드에서 배경색 변형 활성화
            textColor: ["dark"], // 다크 모드에서 텍스트 색상 변형 활성화
        },
    },
    plugins: [
        // 필요한 플러그인 추가
        require("@tailwindcss/forms"), // 예시: TailwindCSS 폼 플러그인
        require("@tailwindcss/typography"), // 예시: TailwindCSS 타이포그래피 플러그인
    ],
}
