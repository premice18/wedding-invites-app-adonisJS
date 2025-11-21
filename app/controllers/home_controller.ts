// app/controllers/home_controller.js
import Wedding from '#models/wedding'
import Guest from '#models/guest'
import { HttpContext } from '@adonisjs/core/http'
// import { DateTime } from 'luxon'

export default class HomeController {
  async index({ view }: HttpContext) {
    // Récupérer tous les mariages
    const weddings = await Wedding.query().orderBy('created_at', 'desc')

    // Si aucun mariage, afficher setup vide
    if (weddings.length === 0) {
      return view.render('pages/setup', {
        weddings: [],
        wedding: null,
      })
    }

    // Si plusieurs mariages, afficher setup avec liste complète
    return view.render('pages/setup', {
      weddings: weddings.map((w) => w.toJSON()),
      wedding: null, // null pour nav → liens invités désactivés
    })
  }
  async dashboard({ view, params }: HttpContext) {
    const wedding = await Wedding.find(params.weddingId)
    if (!wedding) {
      return view.render('pages/setup', { weddings: [], wedding: null })
    }

    // Statistiques
    const stats = {
      totalGuests: await Guest.query().where('wedding_id', wedding.id).count('* as total'),
      verifiedGuests: await Guest.query()
        .where('wedding_id', wedding.id)
        .andWhere('is_verified', true)
        .count('* as total'),
      whatsappSent: await Guest.query()
        .where('wedding_id', wedding.id)
        .andWhere('whatsapp_sent', true)
        .count('* as total'),
      pendingGuests: await Guest.query()
        .where('wedding_id', wedding.id)
        .andWhere('is_verified', false)
        .count('* as total'),
    }

    const recentGuests = await Guest.query()
      .where('wedding_id', wedding.id)
      .orderBy('created_at', 'desc')
      .limit(5)

    return view.render('pages/index', {
      wedding,
      stats,
      recentGuests,
    })
  }

  async setup({ view }: HttpContext) {
    // Récupérer tous les mariages existants
    const weddings = await Wedding.query().orderBy('created_at', 'desc')

    return view.render('pages/setup', {
      weddings: weddings.map((w) => w.toJSON()), // ✅ convertir en JSON pour Edge
      wedding: null, // nécessaire pour le layout (nav)
    })
  }

  async createWedding({ request, response, session }: HttpContext) {
    const data = request.only([
      'coupleName',
      'weddingDate',
      'location',
      'startTime',
      'program',
      'welcomeMessage',
    ])

    try {
      await Wedding.create(data)
      session.flash('success', 'Mariage créé avec succès ! 🎉')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la création du mariage.')
    }

    return response.redirect('/setup')
  }
}
