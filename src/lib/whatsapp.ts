const WHATSAPP_PHONE_NUMBER = '917276687805'

export const WHATSAPP_MESSAGE = `Hi NIVORA Interiors! 👋

I’m interested in your interior design services and would like to discuss my project.

📍 Project Location:
🏠 Property Type:
📐 Approx. Area:
💰 Budget:
📅 Expected Start Date:

I came across NIVORA Interiors through your website and would love to know more about your services.`

export function getWhatsAppHref() {
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
}