const TEAM_KEY = 'satohash_org_team'

export function loadOrgTeam() {
  try {
    return JSON.parse(localStorage.getItem(TEAM_KEY) || '{"members":[],"role":"owner"}')
  } catch {
    return { members: [], role: 'owner' }
  }
}

export function saveOrgTeam(team) {
  localStorage.setItem(TEAM_KEY, JSON.stringify(team))
}

export function inviteTeamMember({ email, role = 'signer' }) {
  const team = loadOrgTeam()
  if (team.members.some((m) => m.email === email)) return team
  team.members.push({ email, role, invitedAt: Date.now(), status: 'pending' })
  saveOrgTeam(team)
  return team
}
