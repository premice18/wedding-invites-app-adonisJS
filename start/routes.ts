import router from '@adonisjs/core/services/router'
const GuestsController = () => import('#controllers/guests_controller')
const ScannerController = () => import('#controllers/scanners_controller')
const HomeController = () => import('#controllers/home_controller')

router.get('/', [HomeController, 'index'])
router.get('/setup', [HomeController, 'setup'])
router.post('/setup/wedding', [HomeController, 'createWedding']).as('home.create_wedding')
router.get('/dashboard/:weddingId', [HomeController, 'dashboard']).as('home.dashboard')

// Routes Invités
router.get('/admin/wedding/:weddingId/guests', [GuestsController, 'index']).as('guests.index')
router.post('/admin/wedding/:weddingId/guests', [GuestsController, 'store']).as('guests.store')
router
  .post('/admin/guests/:id/send-whatsapp', [GuestsController, 'sendWhatsApp'])
  .as('guests.send_whatsapp')
router
  .post('/admin/guests/:id/verify-manual', [GuestsController, 'verifyManual'])
  .as('guests.verify_manual')
router
  .post('/admin/guests/:id/confirm-people', [GuestsController, 'updateConfirmedPeople'])
  .as('guests.update_confirmed')
router.delete('/admin/guests/:id', [GuestsController, 'destroy']).as('guests.destroy')

// Routes Scanner
router.get('/scanner', [ScannerController, 'scanner'])
router.post('/api/scan/qr', [ScannerController, 'processQRScan'])

// Routes Code de Secours
router.get('/backup', [ScannerController, 'backupCodeInterface'])
router.post('/api/scan/backup', [ScannerController, 'processBackupCode'])
