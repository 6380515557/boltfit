const WHATSAPP_NUMBER = "918778146987";

export function generateWhatsAppMessage(productName, customerName, phone) {
  const message = `Order Details:
Product: ${productName}
Customer: ${customerName}
Phone: ${phone}`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
