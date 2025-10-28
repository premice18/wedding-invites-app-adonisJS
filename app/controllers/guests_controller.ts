// app/controllers/guests_controller.js
// import session from '#config/session'
import Guest from '#models/guest'
import Wedding from '#models/wedding'
import QrcodeService from '#services/qrcode_service'
import WhatsAppService from '#services/whatsapp_service'
import { HttpContext } from '@adonisjs/core/http'

export default class GuestsController {
  async index({ view, params }: HttpContext) {
    const wedding = await Wedding.findOrFail(params.weddingId)
    const guests = await Guest.query()
      .where('wedding_id', params.weddingId)
      .orderBy('last_name', 'asc')
      .orderBy('first_name', 'asc')

    return view.render('guests/index', { wedding, guests })
  }

  async store({ request, response, params }: HttpContext) {
    const data = request.only([
      'firstName',
      'lastName',
      'phone',
      'tableNumber',
      'dietaryRestrictions',
      'numberOfPeople',
    ])

    // Créer le guest mais ne pas sauvegarder encore
    const guest = new Guest()
    guest.fill(data)
    guest.weddingId = params.weddingId

    // Générer QR Code **avant save**
    const qrData = await QrcodeService.generateQRCode(guest.id, params.weddingId)
    guest.qrcodeData = qrData.data
    guest.qrcodeImage = qrData.image

    // Maintenant on peut sauvegarder en une seule fois
    await guest.save()

    // Envoyer par WhatsApp si demandé
    if (request.input('send_whatsapp')) {
      const wedding = await Wedding.findOrFail(params.weddingId)
      const whatsappService = new WhatsAppService()
      await whatsappService.sendInvitation(guest, {
        ...wedding,
        weddingDate: new Date(wedding.weddingDate),
      })
    }

    return response.redirect().back()
  }

  async sendWhatsApp({ params, response, session }: HttpContext) {
    const guest = await Guest.findOrFail(params.id)
    const wedding = await Wedding.findOrFail(guest.weddingId)

    const whatsappService = new WhatsAppService()
    const result = await whatsappService.sendInvitation(guest, {
      ...wedding,
      weddingDate: new Date(wedding.weddingDate),
    })

    if (result.success) {
      session.flash('success', 'Invitation WhatsApp envoyée avec succès')
    } else {
      session.flash('error', result.message)
    }

    return response.redirect().back()
  }

  // Validation manuelle depuis la liste
  async verifyManual({ params, response, session }: HttpContext) {
    const guest = await Guest.findOrFail(params.id)

    try {
      await guest.validateManually()
      session.flash(
        'success',
        `Invitation validée manuellement! ${guest.numberOfPeople} personne(s)`
      )
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().back()
  }

  async updateConfirmedPeople({ params, request, response, session }: HttpContext) {
    const guest = await Guest.findOrFail(params.id)
    const { confirmedPeople } = request.only(['confirmedPeople'])

    try {
      await guest.confirmPeople(confirmedPeople)
      session.flash('success', 'Nombre de personnes confirmées mis à jour')
    } catch (error) {
      session.flash('error', error.message)
    }

    return response.redirect().back()
  }

  async destroy({ params, request, response, session }: HttpContext) {
    const guest = await Guest.findOrFail(params.id)

    // Vérification sécurité pour admin principal
    request.only(['adminEmail', 'adminPassword'])
    // Implémenter la vérification admin ici

    await guest.delete()
    session.flash('success', 'Invitation supprimée avec succès')

    return response.redirect().back()
  }
}
