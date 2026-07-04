/**
 * Tailwind config — CG Premier Builders (Deep Premium redesign)
 *
 * Paleta:
 *  - "charcoal" es la base oscura (fondos, header, formulario) en vez del
 *    blanco plano del sitio original: transmite materiales premium (pizarra,
 *    metal, asfalto) y hace que las fotos de tejados "salten" del fondo.
 *  - "ember" es el acento de marca (naranja-rojo tipo teja/ladrillo) reservado
 *    casi en exclusiva para CTAs, así el ojo va directo al botón de conversión.
 *  - "steel" es un azul-gris frío para detalles secundarios (checks, links,
 *    badges) que evoca metal y cielo de Colorado sin competir con el ember.
 */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0b0d10",
          900: "#111418",
          800: "#171b21",
          700: "#20252d",
          600: "#2b313b",
          500: "#3a4250",
        },
        ember: {
          400: "#ff8a4c",
          500: "#f2621c",
          600: "#d94f10",
          700: "#b33d0a",
        },
        steel: {
          300: "#9db4c9",
          400: "#7594ad",
          500: "#4d7390",
          600: "#375974",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
      },
      boxShadow: {
        deep: "0 20px 60px -15px rgba(0,0,0,0.65)",
        "deep-lg": "0 30px 90px -20px rgba(0,0,0,0.75)",
        "inner-line": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
        glow: "0 0 0 1px rgba(242,98,28,0.35), 0 8px 30px -6px rgba(242,98,28,0.45)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/></svg>\")",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fadeIn 1s ease both",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
