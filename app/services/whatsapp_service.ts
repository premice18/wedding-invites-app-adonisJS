// app/services/whatsapp_service.js
import twilio from 'twilio'
import { DateTime } from 'luxon'

export default class WhatsAppService {
  client: any
  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }

  async generateInvitationMessage(
    guest: { firstName?: any; numberOfPeople?: any; tableNumber?: any; backupCode?: any },
    wedding: {
      weddingDate: Date
      coupleName: any
      location: any
      startTime: any
      welcomeMessage: any
    }
  ) {
    const weddingDate = DateTime.fromJSDate(wedding.weddingDate).toFormat('dd/MM/yyyy')

    return `🎉 INVITATION AU MARIAGE 🎉

Cher(e) ${guest.firstName || ''}

Vous êtes cordialement invité(e) au mariage de 
${wedding.coupleName}

📅 ${weddingDate}
📍 ${wedding.location}
⏰ ${wedding.startTime}
👥 ${guest.numberOfPeople || ''} personne(s) attendue(s)
${guest.tableNumber ? `🍽 Table: ${guest.tableNumber}` : ''}

${wedding.welcomeMessage || 'Nous avons hâte de partager ce moment magique avec vous!'}

Présentez votre QR Code à l'entrée.
Code de secours: ${guest.backupCode || ''}

À très vite! 💍`
  }

  async sendInvitation(
    guest: {
      phone?: any
      qrcodeImage?: any
      whatsappSent?: any
      whatsappSentAt?: any
      save?: any
      firstName?: any
      numberOfPeople?: any
      tableNumber?: any
      backupCode?: any
    },
    wedding: {
      weddingDate: Date
      coupleName: any
      location: any
      startTime: any
      welcomeMessage: any
    }
  ) {
    try {
      const message = await this.generateInvitationMessage(guest, wedding)

      // Envoi du message texte
      await this.client.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${guest.phone}`,
      })

      // Envoi de l'image QR Code
      if (guest.qrcodeImage) {
        await this.client.messages.create({
          mediaUrl: [`${process.env.APP_URL}/${guest.qrcodeImage}`],
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${guest.phone}`,
        })
      }

      // Mise à jour du statut d'envoi
      guest.whatsappSent = true
      guest.whatsappSentAt = DateTime.now()
      await guest.save()

      return { success: true, message: 'Invitation envoyée avec succès' }
    } catch (error) {
      console.error('Erreur envoi WhatsApp:', error)
      return { success: false, message: "Erreur lors de l'envoi WhatsApp" }
    }
  }
}
