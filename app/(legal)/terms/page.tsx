import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Términos de Servicio",
  description:
    "Términos y condiciones de uso de la plataforma Cusana para el seguimiento de suscripciones.",
  alternates: {
    canonical: "/terms",
  },
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-8">
      <h2
        id={`${id}-heading`}
        className="text-foreground mb-3 text-xl font-semibold"
      >
        {title}
      </h2>
      <div className="text-muted-foreground space-y-3 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <article className="space-y-10">
      {/* Header */}
      <header className="space-y-4 pt-8">
        <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          Términos de Servicio
        </h1>
        <p className="text-muted-foreground text-sm">
          Última actualización: 8 de febrero de 2025
        </p>
        <Separator />
      </header>

      {/* Table of Contents */}
      <nav aria-label="Tabla de contenidos" className="space-y-2">
        <h2 className="text-foreground text-sm font-semibold tracking-wider uppercase">
          Contenido
        </h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
          <li>
            <a
              href="#aceptacion"
              className="hover:text-foreground transition-colors"
            >
              Aceptación de los términos
            </a>
          </li>
          <li>
            <a
              href="#descripcion"
              className="hover:text-foreground transition-colors"
            >
              Descripción del servicio
            </a>
          </li>
          <li>
            <a
              href="#cuenta"
              className="hover:text-foreground transition-colors"
            >
              Registro y cuenta
            </a>
          </li>
          <li>
            <a href="#edad" className="hover:text-foreground transition-colors">
              Requisito de edad
            </a>
          </li>
          <li>
            <a
              href="#uso-aceptable"
              className="hover:text-foreground transition-colors"
            >
              Uso aceptable
            </a>
          </li>
          <li>
            <a
              href="#propiedad"
              className="hover:text-foreground transition-colors"
            >
              Propiedad intelectual
            </a>
          </li>
          <li>
            <a
              href="#limitacion"
              className="hover:text-foreground transition-colors"
            >
              Limitación de responsabilidad
            </a>
          </li>
          <li>
            <a
              href="#terminacion"
              className="hover:text-foreground transition-colors"
            >
              Terminación
            </a>
          </li>
          <li>
            <a
              href="#modificaciones"
              className="hover:text-foreground transition-colors"
            >
              Modificaciones
            </a>
          </li>
          <li>
            <a
              href="#contacto"
              className="hover:text-foreground transition-colors"
            >
              Contacto
            </a>
          </li>
        </ol>
      </nav>

      <Separator />

      {/* Sections */}
      <Section id="aceptacion" title="1. Aceptación de los términos">
        <p>
          Al acceder y utilizar Cusana (&quot;la Plataforma&quot;), aceptas
          quedar vinculado por estos Términos de Servicio. Si no estás de
          acuerdo con alguno de estos términos, no debes usar la Plataforma.
        </p>
        <p>
          El uso continuado de la Plataforma después de la publicación de
          cambios en estos términos constituye tu aceptación de dichos cambios.
        </p>
      </Section>

      <Section id="descripcion" title="2. Descripción del servicio">
        <p>
          Cusana es una herramienta de seguimiento de suscripciones que permite
          a los usuarios registrar, organizar y analizar sus gastos recurrentes.
          La Plataforma proporciona:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Gestión de suscripciones (agregar, editar, eliminar)</li>
          <li>Panel de análisis con estadísticas de gastos</li>
          <li>Calendario de cobros</li>
          <li>Exportación de datos en múltiples formatos</li>
          <li>Soporte multi-divisa</li>
        </ul>
        <p>
          Cusana es una herramienta informativa y de organización.{" "}
          <strong>
            No es un servicio financiero, de inversión ni de asesoría.
          </strong>{" "}
          No procesamos pagos ni accedemos a tus cuentas bancarias.
        </p>
      </Section>

      <Section id="cuenta" title="3. Registro y cuenta">
        <p>
          Para utilizar la Plataforma, debes crear una cuenta proporcionando
          información veraz y completa. Eres responsable de:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Mantener la confidencialidad de tus credenciales de acceso</li>
          <li>Todas las actividades que ocurran bajo tu cuenta</li>
          <li>
            Notificarnos inmediatamente cualquier uso no autorizado de tu cuenta
          </li>
        </ul>
        <p>
          Puedes registrarte con email y contraseña o mediante proveedores de
          autenticación de terceros (Google, GitHub). Al usar estos servicios,
          también aceptas sus respectivos términos.
        </p>
      </Section>

      <Section id="edad" title="4. Requisito de edad">
        <p>
          <strong>Debes tener al menos 16 años para usar Cusana.</strong> Si
          eres menor de 18 años, declaras que cuentas con el consentimiento de
          tu padre, madre o tutor legal para utilizar la Plataforma.
        </p>
        <p>
          No recopilamos intencionalmente información de menores de 16 años. Si
          descubrimos que un usuario menor de 16 años ha creado una cuenta sin
          consentimiento parental, eliminaremos esa cuenta y los datos
          asociados.
        </p>
        <p>
          Si eres padre o tutor y crees que tu hijo/a ha proporcionado datos
          personales sin tu consentimiento, contáctanos para que podamos tomar
          las medidas necesarias.
        </p>
      </Section>

      <Section id="uso-aceptable" title="5. Uso aceptable">
        <p>Te comprometes a no utilizar la Plataforma para:</p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Actividades ilegales o no autorizadas</li>
          <li>Intentar acceder a cuentas de otros usuarios</li>
          <li>Interferir con el funcionamiento normal de la Plataforma</li>
          <li>Transmitir virus, malware u otro código malicioso</li>
          <li>Realizar ingeniería inversa del software</li>
          <li>
            Usar la Plataforma para almacenar información sensible como números
            de tarjetas de crédito, contraseñas de terceros o datos bancarios
          </li>
        </ul>
      </Section>

      <Section id="propiedad" title="6. Propiedad intelectual">
        <p>
          Cusana es un proyecto de código abierto bajo la licencia MIT. El
          código fuente está disponible públicamente. Sin embargo, la marca, el
          logotipo y el diseño visual son propiedad de sus creadores.
        </p>
        <p>
          Los datos que ingreses en la Plataforma son de tu propiedad. Cusana no
          reclama ningún derecho sobre tus datos personales ni la información de
          tus suscripciones.
        </p>
      </Section>

      <Section id="limitacion" title="7. Limitación de responsabilidad">
        <p>
          La Plataforma se proporciona{" "}
          <strong>
            &quot;tal cual&quot; y &quot;según disponibilidad&quot;
          </strong>
          , sin garantías de ningún tipo, expresas o implícitas.
        </p>
        <p>En ningún caso seremos responsables por:</p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>
            Pérdidas financieras derivadas de decisiones tomadas con base en la
            información mostrada
          </li>
          <li>Interrupciones del servicio o pérdida de datos</li>
          <li>Daños indirectos, incidentales o consecuentes</li>
          <li>
            Inexactitudes en la conversión de divisas o cálculos de montos
          </li>
        </ul>
      </Section>

      <Section id="terminacion" title="8. Terminación">
        <p>
          Puedes eliminar tu cuenta en cualquier momento. Nos reservamos el
          derecho de suspender o terminar cuentas que violen estos términos.
        </p>
        <p>
          Al eliminar tu cuenta, tus datos personales y registros de
          suscripciones serán eliminados permanentemente de nuestros sistemas,
          sujeto a las obligaciones legales de retención que pudieran aplicar.
        </p>
      </Section>

      <Section id="modificaciones" title="9. Modificaciones">
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier
          momento. Los cambios entrarán en vigor al publicarse en esta página.
          Te notificaremos de cambios significativos a través de la Plataforma o
          por email.
        </p>
      </Section>

      <Section id="contacto" title="10. Contacto">
        <p>
          Si tienes preguntas sobre estos Términos de Servicio, puedes
          contactarnos a través del repositorio del proyecto en GitHub.
        </p>
      </Section>
    </article>
  );
}
