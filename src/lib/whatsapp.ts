const WHATSAPP_PHONE_NUMBER = '917276687805'

// Unicode code points keep the message stable even if a deployment tool mishandles literal emoji characters.
export const WHATSAPP_MESSAGE = `Hi NIVORA Interiors! \u{1F44B}

I’m interested in your interior design services and would like to discuss my project.

\u{1F4CD} Project Location:
\u{1F3E0} Property Type:
\u{1F4D0} Approx. Area:
\u{1F4B0} Budget:
\u{1F4C5} Expected Start Date:

I came across NIVORA Interiors through your website and would love to know more about your services.`

export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`