import { describe, it, expect, beforeEach } from 'vitest'
import { loadOrgTeam, inviteTeamMember } from './orgTeam'

describe('orgTeam', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('inviteTeamMember persists pending member', () => {
    const team = inviteTeamMember({ email: 'a@firm.com', role: 'signer' })
    expect(team.members).toHaveLength(1)
    expect(team.members[0].email).toBe('a@firm.com')
    expect(loadOrgTeam().members[0].status).toBe('pending')
  })
})
