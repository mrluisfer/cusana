import type { LocalizedLegalDoc } from "./types";

export const privacyDoc: LocalizedLegalDoc = {
  es: {
    title: "Política de Privacidad",
    intro:
      "Esta política explica qué datos recopilamos, cómo los usamos y qué derechos tienes sobre ellos.",
    tocLabel: "Contenido",
    updatedLabel: "Última actualización:",
    sections: [
      {
        id: "responsable",
        title: "1. Responsable del tratamiento",
        blocks: [
          {
            type: "p",
            text: "Cusana es el responsable del tratamiento de los datos personales que recopila a través de la Plataforma. Para cualquier consulta relativa a privacidad, escríbenos a lolesuncrak@gmail.com.",
          },
        ],
      },
      {
        id: "informacion-recopilada",
        title: "2. Información que recopilamos",
        blocks: [
          { type: "p", text: "Recopilamos la siguiente información cuando usas Cusana:" },
          { type: "h3", text: "Información de la cuenta" },
          {
            type: "ul",
            items: [
              "Nombre",
              "Dirección de correo electrónico",
              "Contraseña (almacenada de forma cifrada, nunca en texto plano)",
            ],
          },
          { type: "h3", text: "Información proporcionada por OAuth" },
          {
            type: "p",
            text: "Si te registras con Google o GitHub, recibimos tu nombre y correo del proveedor. No accedemos a tus contactos, archivos ni a otra información de tu cuenta.",
          },
          { type: "h3", text: "Datos de uso" },
          {
            type: "ul",
            items: [
              "Información de las suscripciones que registres (servicio, precio, ciclo y fecha de cobro)",
              "Preferencia de divisa e idioma",
              "Historial de cambios en suscripciones (registro de auditoría)",
            ],
          },
          { type: "h3", text: "Información que NO recopilamos" },
          {
            type: "ul",
            items: [
              "Números de tarjeta de crédito o débito",
              "Datos bancarios o financieros",
              "Contraseñas de servicios de terceros",
              "Datos de ubicación",
              "Información biométrica",
            ],
          },
        ],
      },
      {
        id: "uso-datos",
        title: "3. Cómo usamos tu información",
        blocks: [
          { type: "p", text: "Utilizamos tu información exclusivamente para:" },
          {
            type: "ul",
            items: [
              "Crear y mantener tu cuenta",
              "Mostrar y gestionar tus suscripciones",
              "Generar estadísticas y análisis de tus gastos",
              "Convertir montos entre divisas usando APIs públicas",
              "Permitir la exportación de tus datos",
              "Mejorar el funcionamiento de la Plataforma",
            ],
          },
          {
            type: "p",
            text: "**No vendemos, alquilamos ni compartimos tu información personal con fines publicitarios o de marketing.**",
          },
        ],
      },
      {
        id: "ia",
        title: "4. Asistente de IA y proveedores de modelos",
        blocks: [
          {
            type: "p",
            text: "El asistente de IA es opcional. **Si decides usarlo**, el contenido de tus mensajes y los datos de suscripción pertinentes se envían **directamente desde tu navegador** al proveedor de modelos de IA configurado (actualmente OpenAI) con el único fin de generar una respuesta.",
          },
          {
            type: "p",
            text: "Este tratamiento está sujeto a la política de privacidad y a los términos del proveedor de IA. Nuestros servidores no intermedian ni almacenan el contenido de esas conversaciones.",
          },
          {
            type: "p",
            text: "Si proporcionas una clave de API para el asistente, esta se guarda **únicamente en la sesión de tu navegador** y se utiliza para autenticar las solicitudes al proveedor. No se transmite ni se almacena en nuestros servidores. Trátala como información sensible y no la compartas.",
          },
          {
            type: "p",
            text: "No utilizamos las conversaciones del asistente para entrenar modelos de IA.",
          },
        ],
      },
      {
        id: "almacenamiento",
        title: "5. Almacenamiento y seguridad",
        blocks: [
          {
            type: "p",
            text: "Tus datos se almacenan en bases de datos PostgreSQL gestionadas por Neon, un proveedor de bases de datos en la nube con estándares de seguridad de nivel empresarial.",
          },
          { type: "p", text: "Medidas de seguridad implementadas:" },
          {
            type: "ul",
            items: [
              "Conexiones cifradas mediante SSL/TLS",
              "Contraseñas hasheadas (nunca en texto plano)",
              "Autenticación segura con tokens de sesión",
              "Cabeceras de seguridad HTTP configuradas",
            ],
          },
          {
            type: "p",
            text: "Aunque implementamos medidas razonables, ningún sistema es completamente invulnerable. Te recomendamos usar contraseñas seguras y únicas.",
          },
        ],
      },
      {
        id: "terceros",
        title: "6. Compartir con terceros",
        blocks: [
          {
            type: "p",
            text: "Compartimos datos únicamente con los servicios necesarios para operar la Plataforma:",
          },
          {
            type: "ul",
            items: [
              "**Neon:** almacenamiento de base de datos",
              "**Vercel:** alojamiento y despliegue de la aplicación",
              "**Frankfurter API:** conversión de divisas (solo se envían códigos de divisa, no datos personales)",
              "**OpenAI:** solo si decides usar el asistente de IA, y desde tu propio navegador",
              "**Google / GitHub:** solo si eliges autenticarte con esos proveedores",
            ],
          },
          {
            type: "p",
            text: "No compartimos tu información más allá de lo necesario para operar el Servicio, salvo obligación legal.",
          },
        ],
      },
      {
        id: "transferencias",
        title: "7. Transferencias internacionales",
        blocks: [
          {
            type: "p",
            text: "Algunos de nuestros proveedores procesan datos fuera de tu país de residencia (por ejemplo, en Estados Unidos o la Unión Europea). Al usar la Plataforma, reconoces que tus datos pueden tratarse en esas ubicaciones, con las salvaguardas razonables que ofrezcan dichos proveedores.",
          },
        ],
      },
      {
        id: "cookies",
        title: "8. Cookies y tecnologías similares",
        blocks: [
          { type: "p", text: "Cusana utiliza cookies y almacenamiento local estrictamente necesarios para:" },
          {
            type: "ul",
            items: [
              "Mantener tu sesión activa",
              "Recordar tus preferencias (como la divisa y el idioma seleccionados)",
            ],
          },
          {
            type: "p",
            text: "**No usamos cookies de seguimiento, analíticas ni publicitarias**, ni herramientas de rastreo de terceros como píxeles publicitarios.",
          },
        ],
      },
      {
        id: "derechos",
        title: "9. Tus derechos",
        blocks: [
          { type: "p", text: "Tienes derecho a:" },
          {
            type: "ul",
            items: [
              "**Acceder** a toda la información que tenemos sobre ti",
              "**Exportar** tus datos en formatos estándar (Excel, CSV, JSON)",
              "**Rectificar** información incorrecta en tu cuenta",
              "**Eliminar** tu cuenta y todos tus datos asociados",
              "**Retirar el consentimiento** en cualquier momento dejando de usar el Servicio",
              "**Oponerte o presentar una reclamación** ante la autoridad de protección de datos de tu jurisdicción",
            ],
          },
          {
            type: "p",
            text: "Para ejercer estos derechos, puedes hacerlo desde la Plataforma o escribiéndonos a lolesuncrak@gmail.com.",
          },
        ],
      },
      {
        id: "menores",
        title: "10. Menores de edad",
        blocks: [
          {
            type: "p",
            text: "**Cusana no está dirigido a menores de 16 años.** No recopilamos intencionalmente datos de personas menores de esa edad.",
          },
          {
            type: "p",
            text: "Si eres padre, madre o tutor y descubres que un menor de 16 años ha creado una cuenta, contáctanos y eliminaremos la cuenta y los datos asociados de inmediato.",
          },
        ],
      },
      {
        id: "retencion",
        title: "11. Retención de datos",
        blocks: [
          {
            type: "p",
            text: "Conservamos tus datos mientras mantengas una cuenta activa. Al eliminar tu cuenta:",
          },
          {
            type: "ul",
            items: [
              "Tus datos personales se eliminan de forma permanente",
              "Tus registros de suscripciones se eliminan",
              "El historial de auditoría asociado se elimina",
            ],
          },
          {
            type: "p",
            text: "La eliminación es irreversible. Te recomendamos exportar tus datos antes de eliminar tu cuenta.",
          },
        ],
      },
      {
        id: "cambios",
        title: "12. Cambios a esta política",
        blocks: [
          {
            type: "p",
            text: 'Podemos actualizar esta política periódicamente. La fecha de "última actualización" en la parte superior indica la última modificación. Los cambios significativos se notificarán a través de la Plataforma.',
          },
        ],
      },
      {
        id: "contacto",
        title: "13. Contacto",
        blocks: [
          {
            type: "p",
            text: "Para consultas sobre tu privacidad, escríbenos a lolesuncrak@gmail.com o abre un issue en el repositorio del proyecto en GitHub.",
          },
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    intro:
      "This policy explains what data we collect, how we use it and what rights you have over it.",
    tocLabel: "Contents",
    updatedLabel: "Last updated:",
    sections: [
      {
        id: "responsable",
        title: "1. Data controller",
        blocks: [
          {
            type: "p",
            text: "Cusana is the controller of the personal data it collects through the Platform. For any privacy-related questions, write to us at lolesuncrak@gmail.com.",
          },
        ],
      },
      {
        id: "informacion-recopilada",
        title: "2. Information we collect",
        blocks: [
          { type: "p", text: "We collect the following information when you use Cusana:" },
          { type: "h3", text: "Account information" },
          {
            type: "ul",
            items: [
              "Name",
              "Email address",
              "Password (stored encrypted, never in plain text)",
            ],
          },
          { type: "h3", text: "Information provided via OAuth" },
          {
            type: "p",
            text: "If you sign up with Google or GitHub, we receive your name and email from the provider. We do not access your contacts, files or any other account information.",
          },
          { type: "h3", text: "Usage data" },
          {
            type: "ul",
            items: [
              "Information about the subscriptions you record (service, price, billing cycle and date)",
              "Currency and language preference",
              "History of subscription changes (audit log)",
            ],
          },
          { type: "h3", text: "Information we do NOT collect" },
          {
            type: "ul",
            items: [
              "Credit or debit card numbers",
              "Banking or financial data",
              "Third-party service passwords",
              "Location data",
              "Biometric information",
            ],
          },
        ],
      },
      {
        id: "uso-datos",
        title: "3. How we use your information",
        blocks: [
          { type: "p", text: "We use your information exclusively to:" },
          {
            type: "ul",
            items: [
              "Create and maintain your account",
              "Display and manage your subscriptions",
              "Generate spending statistics and analytics",
              "Convert amounts between currencies using public APIs",
              "Allow you to export your data",
              "Improve how the Platform works",
            ],
          },
          {
            type: "p",
            text: "**We do not sell, rent or share your personal information for advertising or marketing purposes.**",
          },
        ],
      },
      {
        id: "ia",
        title: "4. AI assistant and model providers",
        blocks: [
          {
            type: "p",
            text: "The AI assistant is optional. **If you choose to use it**, the content of your messages and the relevant subscription data are sent **directly from your browser** to the configured AI model provider (currently OpenAI) for the sole purpose of generating a response.",
          },
          {
            type: "p",
            text: "This processing is subject to the AI provider's privacy policy and terms. Our servers do not intermediate or store the content of those conversations.",
          },
          {
            type: "p",
            text: "If you provide an API key for the assistant, it is stored **only in your browser session** and used to authenticate requests to the provider. It is never transmitted to or stored on our servers. Treat it as sensitive information and do not share it.",
          },
          {
            type: "p",
            text: "We do not use assistant conversations to train AI models.",
          },
        ],
      },
      {
        id: "almacenamiento",
        title: "5. Storage and security",
        blocks: [
          {
            type: "p",
            text: "Your data is stored in PostgreSQL databases managed by Neon, a cloud database provider with enterprise-grade security standards.",
          },
          { type: "p", text: "Security measures in place:" },
          {
            type: "ul",
            items: [
              "Encrypted connections via SSL/TLS",
              "Hashed passwords (never stored in plain text)",
              "Secure authentication with session tokens",
              "Configured HTTP security headers",
            ],
          },
          {
            type: "p",
            text: "Although we implement reasonable measures, no system is completely invulnerable. We recommend using strong, unique passwords.",
          },
        ],
      },
      {
        id: "terceros",
        title: "6. Sharing with third parties",
        blocks: [
          {
            type: "p",
            text: "We share data only with the services necessary to operate the Platform:",
          },
          {
            type: "ul",
            items: [
              "**Neon:** database storage",
              "**Vercel:** application hosting and deployment",
              "**Frankfurter API:** currency conversion (only currency codes are sent, no personal data)",
              "**OpenAI:** only if you choose to use the AI assistant, and from your own browser",
              "**Google / GitHub:** only if you choose to authenticate with those providers",
            ],
          },
          {
            type: "p",
            text: "We do not share your information beyond what is necessary to operate the Service, except where legally required.",
          },
        ],
      },
      {
        id: "transferencias",
        title: "7. International transfers",
        blocks: [
          {
            type: "p",
            text: "Some of our providers process data outside your country of residence (for example, in the United States or the European Union). By using the Platform, you acknowledge that your data may be processed in those locations, with the reasonable safeguards those providers offer.",
          },
        ],
      },
      {
        id: "cookies",
        title: "8. Cookies and similar technologies",
        blocks: [
          { type: "p", text: "Cusana uses strictly necessary cookies and local storage to:" },
          {
            type: "ul",
            items: [
              "Keep your session active",
              "Remember your preferences (such as the selected currency and language)",
            ],
          },
          {
            type: "p",
            text: "**We do not use tracking, analytics or advertising cookies**, nor third-party tracking tools such as advertising pixels.",
          },
        ],
      },
      {
        id: "derechos",
        title: "9. Your rights",
        blocks: [
          { type: "p", text: "You have the right to:" },
          {
            type: "ul",
            items: [
              "**Access** all the information we hold about you",
              "**Export** your data in standard formats (Excel, CSV, JSON)",
              "**Rectify** incorrect information in your account",
              "**Delete** your account and all associated data",
              "**Withdraw consent** at any time by ceasing to use the Service",
              "**Object or file a complaint** with the data protection authority in your jurisdiction",
            ],
          },
          {
            type: "p",
            text: "To exercise these rights, you can do so from the Platform or by writing to us at lolesuncrak@gmail.com.",
          },
        ],
      },
      {
        id: "menores",
        title: "10. Minors",
        blocks: [
          {
            type: "p",
            text: "**Cusana is not directed to anyone under 16.** We do not knowingly collect data from people under that age.",
          },
          {
            type: "p",
            text: "If you are a parent or guardian and discover that someone under 16 has created an account, contact us and we will delete the account and associated data immediately.",
          },
        ],
      },
      {
        id: "retencion",
        title: "11. Data retention",
        blocks: [
          {
            type: "p",
            text: "We keep your data while you maintain an active account. When you delete your account:",
          },
          {
            type: "ul",
            items: [
              "Your personal data is permanently deleted",
              "Your subscription records are deleted",
              "The associated audit log is deleted",
            ],
          },
          {
            type: "p",
            text: "Deletion is irreversible. We recommend exporting your data before deleting your account.",
          },
        ],
      },
      {
        id: "cambios",
        title: "12. Changes to this policy",
        blocks: [
          {
            type: "p",
            text: 'We may update this policy periodically. The "last updated" date at the top indicates the latest change. Significant changes will be notified through the Platform.',
          },
        ],
      },
      {
        id: "contacto",
        title: "13. Contact",
        blocks: [
          {
            type: "p",
            text: "For privacy questions, write to us at lolesuncrak@gmail.com or open an issue in the project's GitHub repository.",
          },
        ],
      },
    ],
  },
};
