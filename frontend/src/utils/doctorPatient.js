/** Noms/emails après héritage JOINED User (champs au niveau Doctor/Patient). */

export function doctorName(d) {
  return d?.name ?? d?.user?.name ?? ''
}

export function doctorEmail(d) {
  return d?.email ?? d?.user?.email ?? ''
}

export function patientName(p) {
  return p?.name ?? p?.user?.name ?? ''
}

export function patientEmail(p) {
  return p?.email ?? p?.user?.email ?? ''
}
