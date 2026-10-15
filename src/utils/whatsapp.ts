export const PROFESSIONAL_WHATSAPP_NUMBER = "5548991169041";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${PROFESSIONAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
