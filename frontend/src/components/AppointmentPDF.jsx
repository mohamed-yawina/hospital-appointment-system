// components/AppointmentPDF.jsx
import {
  Page, Text, View, Document, StyleSheet, Svg,
  Path, Rect, Line, Circle, G
} from '@react-pdf/renderer'

/* ─── Palette ─────────────────────────────────────────────────────── */
const C = {
  ink:        '#0d1b2e',
  inkLight:   '#374151',
  muted:      '#6b7d95',
  faint:      '#9ca3af',
  accent:     '#1a5cf6',
  accentDark: '#1346c8',
  purple:     '#7c3aed',
  green:      '#059669',
  greenBg:    '#d1fae5',
  greenText:  '#065f46',
  bg:         '#f0f4f9',
  bgDeep:     '#e8eef9',
  border:     '#dde5f0',
  white:      '#ffffff',
  colLeft:    '#0b1525',
  colAccent:  '#1e3a6e',
}

/* ─── Styles ──────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: C.white,
    fontFamily: 'Helvetica',
  },

  /* Left sidebar */
  sidebar: {
    width: 170,
    backgroundColor: C.colLeft,
    padding: 0,
    flexDirection: 'column',
  },
  sidebarTop: {
    backgroundColor: C.accent,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 28,
  },
  brandName: {
    fontSize: 17,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 7.5,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.5,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  sidebarSection: {
    paddingHorizontal: 20,
    marginBottom: 22,
  },
  sidebarLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sidebarValue: {
    fontSize: 9.5,
    color: C.white,
    lineHeight: 1.55,
  },
  sidebarValueMuted: {
    fontSize: 8.5,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.55,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5,150,105,0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#34d399',
    marginRight: 5,
  },
  statusText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#34d399',
    letterSpacing: 0.5,
  },
  sidebarBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sidebarNote: {
    fontSize: 7.5,
    color: 'rgba(255,255,255,0.3)',
    lineHeight: 1.6,
  },

  /* Main content */
  main: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 32,
    paddingBottom: 32,
    flexDirection: 'column',
  },

  /* Page header strip */
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  mainTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: C.ink,
    letterSpacing: -0.3,
  },
  mainSubtitle: {
    fontSize: 9,
    color: C.muted,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  refBox: {
    backgroundColor: C.bg,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: C.border,
  },
  refLabel: {
    fontSize: 7,
    color: C.faint,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  refValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    letterSpacing: 2,
  },

  /* Info card */
  card: {
    backgroundColor: C.bg,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardAccentBar: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: C.accent,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.ink,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardCell: {
    width: '50%',
    marginBottom: 10,
  },
  cellLabel: {
    fontSize: 7.5,
    color: C.muted,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  cellValue: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: C.ink,
  },
  cellValueAccent: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
  },

  /* Highlight banner (appointment date) */
  dateBanner: {
    backgroundColor: C.accent,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateBannerLeft: {
    flexDirection: 'column',
  },
  dateBannerLabel: {
    fontSize: 7.5,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateBannerDate: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
  },
  dateBannerTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  dateBannerRight: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dateBannerType: {
    fontSize: 7.5,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  dateBannerDuration: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
  },

  /* Confirmation code strip */
  codeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bgDeep,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  codeStripLeft: {
    flex: 1,
  },
  codeStripLabel: {
    fontSize: 7,
    color: C.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  codeStripValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    letterSpacing: 5,
  },
  codeStripRight: {
    width: 48,
    height: 48,
    backgroundColor: C.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Instructions */
  instructionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  instructionBox: {
    flex: 1,
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  instrNum: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  instrNumText: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
  },
  instrText: {
    fontSize: 7.5,
    color: C.inkLight,
    lineHeight: 1.6,
  },

  /* Footer */
  footer: {
    marginTop: 'auto',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flex: 1,
  },
  footerText: {
    fontSize: 7,
    color: C.faint,
    lineHeight: 1.7,
  },
  footerBrand: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.muted,
  },
})

/* ─── Small SVG icons (react-pdf Svg) ───────────────────────────── */
// Calendar icon
const IconCalendar = () => (
  <Svg viewBox="0 0 20 20" width={14} height={14}>
    <Rect x="3" y="4" width="14" height="13" rx="2" stroke="white" strokeWidth="1.4" fill="none"/>
    <Line x1="3" y1="8" x2="17" y2="8" stroke="white" strokeWidth="1.4"/>
    <Line x1="7" y1="2" x2="7" y2="6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
    <Line x1="13" y1="2" x2="13" y2="6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
  </Svg>
)

// Barcode-style placeholder
const BarcodeIcon = () => (
  <Svg viewBox="0 0 40 40" width={32} height={32}>
    {[2,5,8,11,14,17,20,23,26,29,32,35].map((x, i) => (
      <Rect key={i} x={x} y={4} width={i % 3 === 0 ? 2 : 1} height={32}
        fill={C.accent} opacity={i % 2 === 0 ? 1 : 0.4}/>
    ))}
  </Svg>
)

/* ─── Helpers ─────────────────────────────────────────────────────── */
const fmtDate = d =>
  new Date(d).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

const fmtDateShort = d =>
  new Date(d).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })

const fmtTime = d =>
  new Date(d).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })

const padId = id => (id?.toString() || '').padStart(8, '0')

const formatCode = id => {
  const raw = padId(id)
  return raw.match(/.{1,4}/g)?.join(' ') || raw
}

/* ─── Component ───────────────────────────────────────────────────── */
function AppointmentPDF({ appointment, doctor, patient }) {
  const date     = appointment?.date ? new Date(appointment.date) : new Date()
  const refCode  = formatCode(appointment?.id)
  const issuedOn = fmtDateShort(new Date())
  const doctorLabelName = doctor?.name ?? doctor?.user?.name
  const doctorLabelEmail = doctor?.email ?? doctor?.user?.email
  const st = appointment?.status
  const statusFr =
    st === 'CONFIRME'
      ? 'Confirmé'
      : st === 'EN_ATTENTE'
        ? 'En attente de confirmation'
        : st === 'ANNULE'
          ? 'Annulé'
          : st === 'TERMINE'
            ? 'Terminé'
            : 'Enregistré'

  return (
    <Document
      title="Confirmation de rendez-vous — HealthNow"
      author="HealthNow"
      subject="Rendez-vous médical confirmé"
    >
      <Page size="A4" style={s.page}>

        {/* ══════════════ SIDEBAR ══════════════ */}
        <View style={s.sidebar}>

          {/* Brand block */}
          <View style={s.sidebarTop}>
            <Text style={s.brandName}>HealthNow</Text>
            <Text style={s.brandSub}>Plateforme médicale</Text>
          </View>

          <View style={s.sidebarDivider}/>

          {/* Status */}
          <View style={s.sidebarSection}>
            <Text style={s.sidebarLabel}>Statut</Text>
            <View style={s.statusPill}>
              <View style={s.statusDot}/>
              <Text style={s.statusText}>{statusFr}</Text>
            </View>
          </View>

          {/* Issued */}
          <View style={s.sidebarSection}>
            <Text style={s.sidebarLabel}>Émis le</Text>
            <Text style={s.sidebarValue}>{issuedOn}</Text>
          </View>

          {/* Doctor */}
          <View style={s.sidebarSection}>
            <Text style={s.sidebarLabel}>Médecin traitant</Text>
            <Text style={s.sidebarValue}>Dr. {doctorLabelName}</Text>
            <Text style={s.sidebarValueMuted}>{doctor?.specialty?.name || 'Généraliste'}</Text>
          </View>

          {/* Patient */}
          <View style={s.sidebarSection}>
            <Text style={s.sidebarLabel}>Patient</Text>
            <Text style={s.sidebarValue}>{patient?.name}</Text>
            <Text style={s.sidebarValueMuted}>{patient?.email}</Text>
          </View>

          {/* Spacer + bottom note */}
          <View style={s.sidebarBottom}>
            <Text style={s.sidebarNote}>
              Présentez ce document{'\n'}à l'accueil le jour de{'\n'}votre consultation.
            </Text>
          </View>
        </View>

        {/* ══════════════ MAIN ══════════════ */}
        <View style={s.main}>

          {/* Header */}
          <View style={s.mainHeader}>
            <View>
              <Text style={s.mainTitle}>Confirmation de{'\n'}rendez-vous</Text>
              <Text style={s.mainSubtitle}>Document officiel · Ne pas perdre</Text>
            </View>
            <View style={s.refBox}>
              <Text style={s.refLabel}>Référence</Text>
              <Text style={s.refValue}>{refCode}</Text>
            </View>
          </View>

          {/* Date banner */}
          <View style={s.dateBanner}>
            <View style={s.dateBannerLeft}>
              <Text style={s.dateBannerLabel}>Date de consultation</Text>
              <Text style={s.dateBannerDate}>{fmtDate(date)}</Text>
              <Text style={s.dateBannerTime}>Heure : {fmtTime(date)}</Text>
            </View>
            <View style={s.dateBannerRight}>
              <Text style={s.dateBannerType}>Durée</Text>
              <Text style={s.dateBannerDuration}>30 min</Text>
            </View>
          </View>

          {/* Doctor card */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.cardAccentBar}/>
              <Text style={s.cardTitle}>Informations médecin</Text>
            </View>
            <View style={s.cardGrid}>
              <View style={s.cardCell}>
                <Text style={s.cellLabel}>Nom complet</Text>
                <Text style={s.cellValue}>Dr. {doctorLabelName}</Text>
              </View>
              <View style={s.cardCell}>
                <Text style={s.cellLabel}>Spécialité</Text>
                <Text style={s.cellValueAccent}>{doctor?.specialty?.name || 'Généraliste'}</Text>
              </View>
              <View style={s.cardCell}>
                <Text style={s.cellLabel}>Email</Text>
                <Text style={s.cellValue}>{doctorLabelEmail || '—'}</Text>
              </View>
              <View style={s.cardCell}>
                <Text style={s.cellLabel}>Type de consultation</Text>
                <Text style={s.cellValue}>En cabinet</Text>
              </View>
            </View>
          </View>

          {/* Patient card */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={[s.cardAccentBar, {backgroundColor: C.purple}]}/>
              <Text style={s.cardTitle}>Informations patient</Text>
            </View>
            <View style={s.cardGrid}>
              <View style={s.cardCell}>
                <Text style={s.cellLabel}>Nom complet</Text>
                <Text style={s.cellValue}>{patient?.name}</Text>
              </View>
              <View style={s.cardCell}>
                <Text style={s.cellLabel}>Email</Text>
                <Text style={s.cellValue}>{patient?.email}</Text>
              </View>
            </View>
          </View>

          {/* Confirmation code */}
          <View style={s.codeStrip}>
            <View style={s.codeStripLeft}>
              <Text style={s.codeStripLabel}>Code de confirmation</Text>
              <Text style={s.codeStripValue}>{refCode}</Text>
            </View>
            <View style={s.codeStripRight}>
              <BarcodeIcon/>
            </View>
          </View>

          {/* Instructions - CORRIGÉ */}
          <View style={s.instructionsRow}>
            <View style={s.instructionBox}>
              <View style={s.instrNum}>
                <Text style={s.instrNumText}>1</Text>
              </View>
              <Text style={s.instrText}>Arrivez 10 min avant</Text>
              <Text style={[s.instrText, { marginTop: 4, color: C.muted }]}>
                Présentez-vous à l'accueil avec ce document et votre pièce d'identité.
              </Text>
            </View>

            <View style={s.instructionBox}>
              <View style={s.instrNum}>
                <Text style={s.instrNumText}>2</Text>
              </View>
              <Text style={s.instrText}>Prévenez en cas d'annulation</Text>
              <Text style={[s.instrText, { marginTop: 4, color: C.muted }]}>
                Annulez via l'application au moins 24 h à l'avance.
              </Text>
            </View>

            <View style={s.instructionBox}>
              <View style={s.instrNum}>
                <Text style={s.instrNumText}>3</Text>
              </View>
              <Text style={s.instrText}>En cas d'urgence</Text>
              <Text style={[s.instrText, { marginTop: 4, color: C.muted }]}>
                Contactez le 15 (SAMU) ou rendez-vous aux urgences.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <View style={s.footerLeft}>
              <Text style={s.footerText}>
                Ce document est un justificatif officiel émis par la plateforme HealthNow.{'\n'}
                Il atteste de la confirmation de votre rendez-vous médical à la date indiquée ci-dessus.
              </Text>
            </View>
            <View style={{alignItems:'flex-end', marginLeft: 16}}>
              <Text style={s.footerBrand}>HealthNow</Text>
              <Text style={s.footerText}>healthnow.app</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  )
}

export default AppointmentPDF