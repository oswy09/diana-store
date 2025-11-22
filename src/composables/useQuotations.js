export const useQuotations = () => {
  const sendToWhatsApp = (formData, cartItems, total) => {
    let message = `*Nuevo Pedido - Di Store*\n\n`
    message += `*Cliente:* ${formData.name}\n`
    message += `*Teléfono:* ${formData.phone}\n`
    if (formData.email) message += `*Email:* ${formData.email}\n`
    if (formData.city) message += `*Ciudad:* ${formData.city}\n`
    if (formData.address) message += `*Dirección:* ${formData.address}\n`
    message += `*Forma de Pago:* ${formData.paymentMethod === '1_cuota' ? '1 Cuota' : '2 Cuotas'}\n\n`
    message += `*Productos:*\n`

    cartItems.forEach(item => {
      message += `• ${item.name}\n`
      message += `  Talla: ${item.size} | Color: ${item.color}\n`
      message += `  Precio: $${item.price.toLocaleString('es-CO')}\n\n`
    })

    message += `*Total: $${total.toLocaleString('es-CO')}*`

    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '573172613957'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    return { success: true }
  }

  return {
    sendToWhatsApp
  }
}