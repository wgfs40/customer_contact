import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <main className="text-gray-800">
      <section className="text-center py-16 bg-orange-100">
        <Image
          src="/images/logo_sin_fondo.png"
          alt="Dosis de Marketing"
          className="mx-auto w-40 mb-6"
          width={160}
          height={160}
        />
        <h1 className="text-4xl font-bold mb-4">
          Tu dosis diaria de estrategias de marketing
        </h1>
        <p className="mb-6">
          Aprende, aplica y crece con contenido práctico y actualizado.
        </p>
        <Link
          href="/contact"
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          Suscríbete Gratis
        </Link>
      </section>

      <section className="py-12 px-4 bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">
          ¿Qué obtienes con cada dosis?
        </h2>
        <ul className="max-w-xl mx-auto space-y-4 text-lg">
          <li>📈 Estrategias de marketing digital listas para aplicar</li>
          <li>🧪 Casos reales y análisis de campañas exitosas</li>
          <li>🎯 Tips rápidos y efectivos para redes sociales</li>
        </ul>
      </section>

      <section className="py-12 px-4 bg-orange-50">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Lo que dicen nuestros suscriptores
        </h2>
        <div className="max-w-2xl mx-auto space-y-4 text-center">
          <blockquote>
            “Gracias a Dosis de Marketing, mis campañas ahora tienen el doble de
            impacto.” – Ana M.
          </blockquote>
          <blockquote>
            “Contenido claro, útil y directo al grano. ¡Lo recomiendo!” – Carlos
            R.
          </blockquote>
        </div>
      </section>

      {/* <section id="suscribete" className="py-12 px-4 bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Recibe tu dosis semanal
        </h2>
        <form className="max-w-md mx-auto flex flex-col items-center space-y-4">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            required
            className="border px-4 py-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Suscribirme
          </button>
        </form>
      </section> */}

      <footer className="py-6 text-center bg-orange-100 text-sm">
        <p>&copy; 2025 Dosis de Marketing. Todos los derechos reservados.</p>
        <nav className="space-x-2">
          <a href="#" className="underline">
            Política de privacidad
          </a>
          <a href="#" className="underline">
            Contacto
          </a>
        </nav>
      </footer>
    </main>
  );
}
