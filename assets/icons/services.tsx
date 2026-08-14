import { ReceiptText } from "lucide-react";
import type { SVGProps } from "react";

/**
 * Genérico para servicios del hogar sin marca propia en el catálogo:
 * internet, cable, telefonía, luz, agua (Megacable, Totalplay, CFE…).
 * Usa un icono de lucide en vez de un SVG de marca porque no representa
 * a una empresa en particular.
 */
const Services = (props: SVGProps<SVGSVGElement>) => <ReceiptText {...props} />;

export { Services };
