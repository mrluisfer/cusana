import type { LocalizedLegalDoc } from "./types";

export const termsDoc: LocalizedLegalDoc = {
  es: {
    title: "Términos de Servicio",
    intro:
      "Estos Términos rigen el uso de Cusana. Léelos con atención: al usar la Plataforma, los aceptas en su totalidad.",
    tocLabel: "Contenido",
    updatedLabel: "Última actualización:",
    sections: [
      {
        id: "aceptacion",
        title: "1. Aceptación de los términos",
        blocks: [
          {
            type: "p",
            text: 'Al acceder y utilizar Cusana ("la Plataforma", "el Servicio"), aceptas quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguno de ellos, no debes usar la Plataforma.',
          },
          {
            type: "p",
            text: "El uso continuado de la Plataforma después de la publicación de cambios en estos términos constituye tu aceptación de dichos cambios.",
          },
        ],
      },
      {
        id: "descripcion",
        title: "2. Descripción del servicio",
        blocks: [
          {
            type: "p",
            text: "Cusana es una herramienta de seguimiento de suscripciones que permite registrar, organizar y analizar gastos recurrentes. La Plataforma proporciona, entre otras funciones:",
          },
          {
            type: "ul",
            items: [
              "Gestión de suscripciones (agregar, editar, eliminar)",
              "Panel de análisis con estadísticas de gastos",
              "Calendario de cobros y recordatorios",
              "Exportación de datos en múltiples formatos",
              "Soporte multi-divisa",
              "Un asistente conversacional opcional basado en inteligencia artificial",
            ],
          },
          {
            type: "p",
            text: "Cusana es una herramienta informativa y de organización. **No es un servicio financiero, de inversión, fiscal ni de asesoría profesional.** No procesamos pagos ni accedemos a tus cuentas bancarias.",
          },
        ],
      },
      {
        id: "cuenta",
        title: "3. Registro y cuenta",
        blocks: [
          {
            type: "p",
            text: "Para utilizar la Plataforma debes crear una cuenta proporcionando información veraz y completa. Eres responsable de:",
          },
          {
            type: "ul",
            items: [
              "Mantener la confidencialidad de tus credenciales de acceso",
              "Todas las actividades que ocurran bajo tu cuenta",
              "Notificarnos de inmediato cualquier uso no autorizado de tu cuenta",
            ],
          },
          {
            type: "p",
            text: "Puedes registrarte con correo y contraseña o mediante proveedores de autenticación de terceros (Google, GitHub). Al usar esos servicios, también aceptas sus respectivos términos.",
          },
        ],
      },
      {
        id: "edad",
        title: "4. Requisito de edad",
        blocks: [
          {
            type: "p",
            text: "**Debes tener al menos 16 años para usar Cusana.** Si eres menor de 18 años, declaras que cuentas con el consentimiento de tu padre, madre o tutor legal para utilizar la Plataforma.",
          },
          {
            type: "p",
            text: "No recopilamos intencionalmente información de menores de 16 años. Si descubrimos una cuenta de un menor de 16 años sin consentimiento parental, la eliminaremos junto con sus datos asociados.",
          },
        ],
      },
      {
        id: "uso-aceptable",
        title: "5. Uso aceptable",
        blocks: [
          { type: "p", text: "Te comprometes a no utilizar la Plataforma para:" },
          {
            type: "ul",
            items: [
              "Actividades ilegales o no autorizadas",
              "Intentar acceder a cuentas de otros usuarios",
              "Interferir con el funcionamiento normal de la Plataforma o eludir sus medidas de seguridad",
              "Transmitir virus, malware u otro código malicioso",
              "Realizar ingeniería inversa, descompilar o extraer el código del Servicio salvo en la medida permitida por la licencia de código abierto aplicable",
              "Acceder al Servicio de forma automatizada (scraping, bots) sin autorización",
              "Almacenar información sensible como números de tarjeta, contraseñas de terceros o datos bancarios",
            ],
          },
        ],
      },
      {
        id: "ia",
        title: "6. Asistente de inteligencia artificial",
        blocks: [
          {
            type: "p",
            text: "Cusana ofrece un asistente conversacional impulsado por modelos de inteligencia artificial de terceros (actualmente OpenAI). Esta función forma parte del Servicio de Cusana, **con independencia de que seas tú quien proporcione su propia clave de API (API key) del proveedor de IA.**",
          },
          {
            type: "p",
            text: "**Las respuestas generadas por IA pueden ser inexactas, incompletas o erróneas.** El asistente no constituye asesoría financiera, fiscal, legal, contable ni de inversión. Cualquier decisión que tomes con base en sus respuestas es de tu exclusiva responsabilidad y riesgo.",
          },
          {
            type: "p",
            text: "Cuando usas el asistente, el contenido de tus mensajes y los datos de tus suscripciones necesarios para responder se envían directamente desde tu navegador al proveedor de IA configurado. Dicho tratamiento se rige por los términos y la política de privacidad de ese proveedor, que te recomendamos revisar.",
          },
          {
            type: "p",
            text: "Si proporcionas tu propia clave de API, eres el único responsable de su uso, de los costos que genere y del cumplimiento de los términos del proveedor. No respondemos por cargos, límites de uso, bloqueos o suspensiones derivados de tu cuenta con el proveedor de IA. Tu clave se guarda únicamente en la sesión de tu navegador y no se transmite ni almacena en nuestros servidores.",
          },
          {
            type: "p",
            text: "No utilizamos tus conversaciones con el asistente para entrenar modelos. Nos reservamos el derecho de limitar, modificar o descontinuar la función de IA en cualquier momento.",
          },
        ],
      },
      {
        id: "terceros",
        title: "7. Servicios de terceros",
        blocks: [
          {
            type: "p",
            text: "El Servicio se apoya en proveedores externos (por ejemplo, alojamiento, base de datos, autenticación y proveedores de IA). No somos responsables de la disponibilidad, el contenido ni las prácticas de dichos terceros. El uso de funciones que dependen de ellos puede estar sujeto a sus propios términos.",
          },
        ],
      },
      {
        id: "propiedad",
        title: "8. Propiedad intelectual",
        blocks: [
          {
            type: "p",
            text: "Cusana es un proyecto de código abierto bajo la licencia MIT; su código fuente está disponible públicamente. No obstante, la marca, el logotipo, el nombre y el diseño visual son propiedad de sus creadores y no se licencian bajo dicha licencia.",
          },
          {
            type: "p",
            text: "Los datos que ingreses son de tu propiedad. Nos otorgas únicamente la licencia limitada necesaria para alojar, procesar y mostrarte esos datos con el fin de prestarte el Servicio.",
          },
        ],
      },
      {
        id: "garantias",
        title: "9. Exención de garantías",
        blocks: [
          {
            type: "p",
            text: 'La Plataforma se proporciona **"tal cual" y "según disponibilidad"**, sin garantías de ningún tipo, expresas o implícitas, incluidas, entre otras, las garantías de comerciabilidad, idoneidad para un fin determinado, exactitud y no infracción.',
          },
          {
            type: "p",
            text: "No garantizamos que el Servicio sea ininterrumpido, seguro o libre de errores, ni que los cálculos, conversiones de divisa o respuestas de IA sean exactos.",
          },
        ],
      },
      {
        id: "limitacion",
        title: "10. Limitación de responsabilidad",
        blocks: [
          {
            type: "p",
            text: "En la máxima medida permitida por la ley, no seremos responsables por:",
          },
          {
            type: "ul",
            items: [
              "Pérdidas financieras derivadas de decisiones tomadas con base en la información o las respuestas de IA mostradas",
              "Interrupciones del servicio, pérdida de datos o accesos no autorizados",
              "Daños indirectos, incidentales, especiales, punitivos o consecuentes",
              "Inexactitudes en la conversión de divisas o en los cálculos de montos",
            ],
          },
          {
            type: "p",
            text: "**Dado que el Servicio se ofrece de forma gratuita y en fase beta, nuestra responsabilidad total y acumulada frente a ti se limita, en todo caso, a la cantidad que nos hayas pagado por el Servicio (que podría ser cero).**",
          },
        ],
      },
      {
        id: "indemnizacion",
        title: "11. Indemnización",
        blocks: [
          {
            type: "p",
            text: "Aceptas mantenernos indemnes y defendernos frente a cualquier reclamación, daño, pérdida o gasto (incluidos honorarios razonables de abogados) que surja de tu uso de la Plataforma, de tu incumplimiento de estos Términos o de la infracción de derechos de terceros.",
          },
        ],
      },
      {
        id: "disponibilidad",
        title: "12. Disponibilidad y fase beta",
        blocks: [
          {
            type: "p",
            text: "Cusana se encuentra en fase beta y en desarrollo activo. Las funciones pueden cambiar, suspenderse o eliminarse sin previo aviso. Podemos modificar o discontinuar el Servicio, total o parcialmente, en cualquier momento.",
          },
        ],
      },
      {
        id: "terminacion",
        title: "13. Terminación",
        blocks: [
          {
            type: "p",
            text: "Puedes eliminar tu cuenta en cualquier momento. Nos reservamos el derecho de suspender o terminar cuentas que violen estos Términos.",
          },
          {
            type: "p",
            text: "Al eliminar tu cuenta, tus datos personales y registros de suscripciones se eliminarán de forma permanente de nuestros sistemas, sujeto a las obligaciones legales de retención que pudieran aplicar.",
          },
        ],
      },
      {
        id: "ley-aplicable",
        title: "14. Ley aplicable y resolución de disputas",
        blocks: [
          {
            type: "p",
            text: "Estos Términos se rigen por las leyes del país en el que el operador del Servicio reside o está establecido, sin perjuicio de sus normas sobre conflicto de leyes. En la medida permitida por la ley, cualquier disputa se someterá a los tribunales competentes de dicho lugar. Si resides en una jurisdicción cuya legislación de consumo te otorga derechos imperativos, estos no se ven afectados por la presente cláusula.",
          },
        ],
      },
      {
        id: "modificaciones",
        title: "15. Modificaciones",
        blocks: [
          {
            type: "p",
            text: "Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios entran en vigor al publicarse en esta página. Te notificaremos de cambios significativos a través de la Plataforma o por correo.",
          },
        ],
      },
      {
        id: "generales",
        title: "16. Disposiciones generales",
        blocks: [
          {
            type: "ul",
            items: [
              "**Divisibilidad:** si alguna cláusula se considera inválida, las demás seguirán siendo plenamente válidas.",
              "**Acuerdo íntegro:** estos Términos, junto con la Política de Privacidad, constituyen el acuerdo completo entre tú y nosotros respecto del Servicio.",
              "**Cesión:** no puedes ceder tus derechos sin nuestro consentimiento; nosotros podemos cederlos en el marco de una reorganización o transmisión del proyecto.",
              "**No renuncia:** el hecho de no ejercer un derecho no constituye renuncia al mismo.",
            ],
          },
        ],
      },
      {
        id: "contacto",
        title: "17. Contacto",
        blocks: [
          {
            type: "p",
            text: "Si tienes preguntas sobre estos Términos, escríbenos a lolesuncrak@gmail.com o a través del repositorio del proyecto en GitHub.",
          },
        ],
      },
    ],
  },
  en: {
    title: "Terms of Service",
    intro:
      "These Terms govern your use of Cusana. Please read them carefully: by using the Platform, you accept them in full.",
    tocLabel: "Contents",
    updatedLabel: "Last updated:",
    sections: [
      {
        id: "aceptacion",
        title: "1. Acceptance of terms",
        blocks: [
          {
            type: "p",
            text: 'By accessing and using Cusana ("the Platform", "the Service"), you agree to be bound by these Terms of Service. If you do not agree with any of them, you must not use the Platform.',
          },
          {
            type: "p",
            text: "Continued use of the Platform after changes to these terms are posted constitutes your acceptance of those changes.",
          },
        ],
      },
      {
        id: "descripcion",
        title: "2. Description of the service",
        blocks: [
          {
            type: "p",
            text: "Cusana is a subscription-tracking tool that lets you record, organize and analyze recurring expenses. The Platform provides, among other features:",
          },
          {
            type: "ul",
            items: [
              "Subscription management (add, edit, delete)",
              "Analytics dashboard with spending statistics",
              "Billing calendar and reminders",
              "Data export in multiple formats",
              "Multi-currency support",
              "An optional AI-powered conversational assistant",
            ],
          },
          {
            type: "p",
            text: "Cusana is an informational and organizational tool. **It is not a financial, investment, tax or professional advisory service.** We do not process payments or access your bank accounts.",
          },
        ],
      },
      {
        id: "cuenta",
        title: "3. Registration and account",
        blocks: [
          {
            type: "p",
            text: "To use the Platform you must create an account with accurate and complete information. You are responsible for:",
          },
          {
            type: "ul",
            items: [
              "Keeping your login credentials confidential",
              "All activity that occurs under your account",
              "Notifying us immediately of any unauthorized use of your account",
            ],
          },
          {
            type: "p",
            text: "You may sign up with email and password or through third-party authentication providers (Google, GitHub). By using those services, you also accept their respective terms.",
          },
        ],
      },
      {
        id: "edad",
        title: "4. Age requirement",
        blocks: [
          {
            type: "p",
            text: "**You must be at least 16 years old to use Cusana.** If you are under 18, you represent that you have the consent of your parent or legal guardian to use the Platform.",
          },
          {
            type: "p",
            text: "We do not knowingly collect information from anyone under 16. If we discover an account belonging to someone under 16 without parental consent, we will delete it along with its associated data.",
          },
        ],
      },
      {
        id: "uso-aceptable",
        title: "5. Acceptable use",
        blocks: [
          { type: "p", text: "You agree not to use the Platform to:" },
          {
            type: "ul",
            items: [
              "Engage in illegal or unauthorized activities",
              "Attempt to access other users' accounts",
              "Interfere with the normal operation of the Platform or bypass its security measures",
              "Transmit viruses, malware or other malicious code",
              "Reverse engineer, decompile or extract the Service's code except as permitted by the applicable open-source license",
              "Access the Service in an automated way (scraping, bots) without authorization",
              "Store sensitive information such as card numbers, third-party passwords or banking data",
            ],
          },
        ],
      },
      {
        id: "ia",
        title: "6. Artificial intelligence assistant",
        blocks: [
          {
            type: "p",
            text: "Cusana offers a conversational assistant powered by third-party AI models (currently OpenAI). This feature is part of the Cusana Service, **regardless of the fact that you provide your own AI provider API key.**",
          },
          {
            type: "p",
            text: "**AI-generated responses may be inaccurate, incomplete or wrong.** The assistant does not constitute financial, tax, legal, accounting or investment advice. Any decision you make based on its responses is solely your own responsibility and risk.",
          },
          {
            type: "p",
            text: "When you use the assistant, the content of your messages and the subscription data needed to answer are sent directly from your browser to the configured AI provider. That processing is governed by the provider's terms and privacy policy, which we recommend you review.",
          },
          {
            type: "p",
            text: "If you provide your own API key, you are solely responsible for its use, the costs it incurs and compliance with the provider's terms. We are not liable for charges, usage limits, blocks or suspensions arising from your account with the AI provider. Your key is stored only in your browser session and is never transmitted to or stored on our servers.",
          },
          {
            type: "p",
            text: "We do not use your conversations with the assistant to train models. We reserve the right to limit, modify or discontinue the AI feature at any time.",
          },
        ],
      },
      {
        id: "terceros",
        title: "7. Third-party services",
        blocks: [
          {
            type: "p",
            text: "The Service relies on external providers (for example, hosting, database, authentication and AI providers). We are not responsible for the availability, content or practices of those third parties. Use of features that depend on them may be subject to their own terms.",
          },
        ],
      },
      {
        id: "propiedad",
        title: "8. Intellectual property",
        blocks: [
          {
            type: "p",
            text: "Cusana is an open-source project under the MIT license; its source code is publicly available. However, the brand, logo, name and visual design belong to its creators and are not licensed under that license.",
          },
          {
            type: "p",
            text: "The data you enter belongs to you. You grant us only the limited license needed to host, process and display that data in order to provide the Service to you.",
          },
        ],
      },
      {
        id: "garantias",
        title: "9. Disclaimer of warranties",
        blocks: [
          {
            type: "p",
            text: 'The Platform is provided **"as is" and "as available"**, without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, accuracy and non-infringement.',
          },
          {
            type: "p",
            text: "We do not warrant that the Service will be uninterrupted, secure or error-free, nor that calculations, currency conversions or AI responses will be accurate.",
          },
        ],
      },
      {
        id: "limitacion",
        title: "10. Limitation of liability",
        blocks: [
          {
            type: "p",
            text: "To the maximum extent permitted by law, we will not be liable for:",
          },
          {
            type: "ul",
            items: [
              "Financial losses arising from decisions made based on the information or AI responses shown",
              "Service interruptions, data loss or unauthorized access",
              "Indirect, incidental, special, punitive or consequential damages",
              "Inaccuracies in currency conversion or amount calculations",
            ],
          },
          {
            type: "p",
            text: "**Because the Service is offered free of charge and in beta, our total aggregate liability to you is limited, in any case, to the amount you have paid us for the Service (which may be zero).**",
          },
        ],
      },
      {
        id: "indemnizacion",
        title: "11. Indemnification",
        blocks: [
          {
            type: "p",
            text: "You agree to indemnify and defend us against any claim, damage, loss or expense (including reasonable attorneys' fees) arising from your use of the Platform, your breach of these Terms or your infringement of third-party rights.",
          },
        ],
      },
      {
        id: "disponibilidad",
        title: "12. Availability and beta status",
        blocks: [
          {
            type: "p",
            text: "Cusana is in beta and under active development. Features may change, be suspended or be removed without notice. We may modify or discontinue the Service, in whole or in part, at any time.",
          },
        ],
      },
      {
        id: "terminacion",
        title: "13. Termination",
        blocks: [
          {
            type: "p",
            text: "You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these Terms.",
          },
          {
            type: "p",
            text: "When you delete your account, your personal data and subscription records will be permanently removed from our systems, subject to any legal retention obligations that may apply.",
          },
        ],
      },
      {
        id: "ley-aplicable",
        title: "14. Governing law and dispute resolution",
        blocks: [
          {
            type: "p",
            text: "These Terms are governed by the laws of the country where the Service operator resides or is established, without regard to its conflict-of-laws rules. To the extent permitted by law, any dispute will be submitted to the competent courts of that location. If you reside in a jurisdiction whose consumer laws grant you mandatory rights, those rights are not affected by this clause.",
          },
        ],
      },
      {
        id: "modificaciones",
        title: "15. Modifications",
        blocks: [
          {
            type: "p",
            text: "We reserve the right to modify these Terms at any time. Changes take effect when posted on this page. We will notify you of significant changes through the Platform or by email.",
          },
        ],
      },
      {
        id: "generales",
        title: "16. General provisions",
        blocks: [
          {
            type: "ul",
            items: [
              "**Severability:** if any clause is held invalid, the remaining clauses will remain fully effective.",
              "**Entire agreement:** these Terms, together with the Privacy Policy, constitute the entire agreement between you and us regarding the Service.",
              "**Assignment:** you may not assign your rights without our consent; we may assign them as part of a reorganization or transfer of the project.",
              "**No waiver:** failure to exercise a right does not constitute a waiver of it.",
            ],
          },
        ],
      },
      {
        id: "contacto",
        title: "17. Contact",
        blocks: [
          {
            type: "p",
            text: "If you have questions about these Terms, write to us at lolesuncrak@gmail.com or through the project's GitHub repository.",
          },
        ],
      },
    ],
  },
};
