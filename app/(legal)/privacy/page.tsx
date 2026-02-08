import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Política de Privacidad — Cusana",
  description:
    "Política de privacidad de Cusana. Conoce cómo recopilamos, usamos y protegemos tus datos.",
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

export default function PrivacyPage() {
  return (
    <article className="space-y-10">
      {/* Header */}
      <header className="space-y-4 pt-8">
        <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          Política de Privacidad
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
              href="#informacion-recopilada"
              className="hover:text-foreground transition-colors"
            >
              Información que recopilamos
            </a>
          </li>
          <li>
            <a
              href="#uso-datos"
              className="hover:text-foreground transition-colors"
            >
              Cómo usamos tu información
            </a>
          </li>
          <li>
            <a
              href="#almacenamiento"
              className="hover:text-foreground transition-colors"
            >
              Almacenamiento y seguridad
            </a>
          </li>
          <li>
            <a
              href="#terceros"
              className="hover:text-foreground transition-colors"
            >
              Compartir con terceros
            </a>
          </li>
          <li>
            <a
              href="#cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookies y tecnologías similares
            </a>
          </li>
          <li>
            <a
              href="#derechos"
              className="hover:text-foreground transition-colors"
            >
              Tus derechos
            </a>
          </li>
          <li>
            <a
              href="#menores"
              className="hover:text-foreground transition-colors"
            >
              Menores de edad
            </a>
          </li>
          <li>
            <a
              href="#retencion"
              className="hover:text-foreground transition-colors"
            >
              Retención de datos
            </a>
          </li>
          <li>
            <a
              href="#cambios-privacidad"
              className="hover:text-foreground transition-colors"
            >
              Cambios a esta política
            </a>
          </li>
          <li>
            <a
              href="#contacto-privacidad"
              className="hover:text-foreground transition-colors"
            >
              Contacto
            </a>
          </li>
        </ol>
      </nav>

      <Separator />

      {/* Sections */}
      <Section
        id="informacion-recopilada"
        title="1. Información que recopilamos"
      >
        <p>Recopilamos la siguiente información cuando usas Cusana:</p>

        <h3 className="text-foreground mt-4 font-medium">
          Información de la cuenta
        </h3>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Nombre</li>
          <li>Dirección de correo electrónico</li>
          <li>
            Contraseña (almacenada de forma cifrada, nunca en texto plano)
          </li>
        </ul>

        <h3 className="text-foreground mt-4 font-medium">
          Información proporcionada por OAuth
        </h3>
        <p>
          Si te registras con Google o GitHub, recibimos tu nombre y email del
          proveedor. No accedemos a tus contactos, archivos ni otra información
          de tu cuenta.
        </p>

        <h3 className="text-foreground mt-4 font-medium">Datos de uso</h3>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>
            Información de suscripciones que registres (nombre del servicio,
            precio, ciclo de cobro, fecha de cobro)
          </li>
          <li>Preferencia de divisa</li>
          <li>Historial de cambios en suscripciones (audit log)</li>
        </ul>

        <h3 className="text-foreground mt-4 font-medium">
          Información que NO recopilamos
        </h3>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Números de tarjeta de crédito o débito</li>
          <li>Datos bancarios o financieros</li>
          <li>Contraseñas de servicios de terceros</li>
          <li>Datos de ubicación</li>
          <li>Información biométrica</li>
        </ul>
      </Section>

      <Section id="uso-datos" title="2. Cómo usamos tu información">
        <p>Utilizamos tu información exclusivamente para:</p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Crear y mantener tu cuenta</li>
          <li>Mostrar y gestionar tus suscripciones</li>
          <li>Generar estadísticas y análisis de tus gastos</li>
          <li>Convertir montos entre divisas usando APIs públicas</li>
          <li>Permitir la exportación de tus datos</li>
          <li>Mejorar el funcionamiento de la Plataforma</li>
        </ul>
        <p>
          <strong>
            No vendemos, alquilamos ni compartimos tu información personal con
            fines publicitarios o de marketing.
          </strong>
        </p>
      </Section>

      <Section id="almacenamiento" title="3. Almacenamiento y seguridad">
        <p>
          Tus datos se almacenan en bases de datos PostgreSQL gestionadas por
          Neon, un proveedor de bases de datos en la nube con estándares de
          seguridad de nivel empresarial.
        </p>
        <p>Medidas de seguridad implementadas:</p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Conexiones cifradas mediante SSL/TLS</li>
          <li>Contraseñas hasheadas (nunca almacenadas en texto plano)</li>
          <li>Autenticación segura con tokens de sesión</li>
          <li>Cabeceras de seguridad HTTP configuradas</li>
        </ul>
        <p>
          Aunque implementamos medidas razonables de seguridad, ningún sistema
          es completamente invulnerable. Te recomendamos usar contraseñas
          seguras y únicas para tu cuenta.
        </p>
      </Section>

      <Section id="terceros" title="4. Compartir con terceros">
        <p>
          Compartimos datos únicamente con los siguientes servicios necesarios
          para el funcionamiento de la Plataforma:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>
            <strong>Neon</strong> — Almacenamiento de base de datos
          </li>
          <li>
            <strong>Vercel</strong> — Hosting y despliegue de la aplicación
          </li>
          <li>
            <strong>Frankfurter API</strong> — Conversión de divisas (no se
            envían datos personales, solo códigos de divisa)
          </li>
          <li>
            <strong>Google / GitHub</strong> — Solo si eliges autenticarte con
            estos proveedores
          </li>
        </ul>
        <p>
          No compartimos tu información con terceros más allá de lo necesario
          para operar el servicio.
        </p>
      </Section>

      <Section id="cookies" title="5. Cookies y tecnologías similares">
        <p>Cusana utiliza cookies estrictamente necesarias para:</p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Mantener tu sesión activa</li>
          <li>Recordar tus preferencias (como la divisa seleccionada)</li>
        </ul>
        <p>
          <strong>
            No usamos cookies de seguimiento, analíticas ni publicitarias.
          </strong>{" "}
          No utilizamos herramientas de rastreo de terceros como Google
          Analytics ni píxeles de seguimiento.
        </p>
      </Section>

      <Section id="derechos" title="6. Tus derechos">
        <p>Tienes derecho a:</p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>
            <strong>Acceder</strong> a toda la información que tenemos sobre ti
          </li>
          <li>
            <strong>Exportar</strong> tus datos en formatos estándar (Excel,
            CSV, JSON)
          </li>
          <li>
            <strong>Rectificar</strong> información incorrecta en tu cuenta
          </li>
          <li>
            <strong>Eliminar</strong> tu cuenta y todos tus datos asociados
          </li>
          <li>
            <strong>Retirar el consentimiento</strong> en cualquier momento
            dejando de usar el servicio
          </li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, puedes hacerlo directamente
          desde la Plataforma o contactarnos a través de GitHub.
        </p>
      </Section>

      <Section id="menores" title="7. Menores de edad">
        <p>
          <strong>Cusana no está dirigido a menores de 16 años.</strong> No
          recopilamos intencionalmente datos de personas menores de esa edad.
        </p>
        <p>
          Los usuarios entre 16 y 18 años pueden utilizar la Plataforma con el
          consentimiento de un padre o tutor legal. Estos usuarios no deben
          ingresar información personal sensible sin supervisión.
        </p>
        <p>
          Si eres padre, madre o tutor y descubres que tu hijo/a menor de 16
          años ha creado una cuenta, contáctanos y eliminaremos la cuenta y
          todos los datos asociados de forma inmediata.
        </p>
      </Section>

      <Section id="retencion" title="8. Retención de datos">
        <p>
          Conservamos tus datos mientras mantengas una cuenta activa. Al
          eliminar tu cuenta:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Tus datos personales se eliminan de forma permanente</li>
          <li>Tus registros de suscripciones se eliminan</li>
          <li>El historial de auditoría asociado se elimina</li>
        </ul>
        <p>
          La eliminación es irreversible. Te recomendamos exportar tus datos
          antes de eliminar tu cuenta.
        </p>
      </Section>

      <Section id="cambios-privacidad" title="9. Cambios a esta política">
        <p>
          Podemos actualizar esta Política de Privacidad periódicamente. La
          fecha de &quot;última actualización&quot; en la parte superior indica
          cuándo se realizó la última modificación.
        </p>
        <p>
          Los cambios significativos serán notificados a través de la
          Plataforma. El uso continuado después de los cambios implica la
          aceptación de la política actualizada.
        </p>
      </Section>

      <Section id="contacto-privacidad" title="10. Contacto">
        <p>
          Para consultas relacionadas con tu privacidad o estos términos, puedes
          contactarnos a través del repositorio del proyecto en GitHub o
          abriendo un issue en nuestra página de soporte.
        </p>
      </Section>
    </article>
  );
}
