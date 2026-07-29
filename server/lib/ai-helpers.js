import logger from '../logger.js'

export async function runClaudeOrMock(anthropicClient, prompt, mockJson, maxTokens = 800) {
  if (anthropicClient) {
    const response = await anthropicClient.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    })
    return { text: response.content[0].text, model: 'claude-haiku-4-5' }
  }
  return { text: JSON.stringify(mockJson), model: 'mock' }
}

export function parseJsonObject(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  try {
    return JSON.parse(jsonMatch[0])
  } catch {
    return null
  }
}
