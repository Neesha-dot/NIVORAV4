const WHATSAPP_PHONE_NUMBER = '917276687805'

const wave = String.fromCodePoint(0x1F44B)
const pin = String.fromCodePoint(0x1F4CD)
const house = String.fromCodePoint(0x1F3E0)
const ruler = String.fromCodePoint(0x1F4D0)
const money = String.fromCodePoint(0x1F4B0)
const calendar = String.fromCodePoint(0x1F4C5)

export const WHATSAPP_MESSAGE =
  `Hi NIVORA Interiors! ${wave}

I’m interested in your interior design services and would like to discuss my project.

${pin} Project Location:
${house} Property Type:
${ruler} Approx. Area:
${money} Budget:
${calendar} Expected Start Date:

I came across NIVORA Interiors through your website and would love to know more about your services.`

export function getWhatsAppHref() {
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
}