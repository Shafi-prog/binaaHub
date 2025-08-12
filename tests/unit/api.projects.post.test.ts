/**
 * This test verifies POST /api/projects can handle both schemas by building two insert shapes.
 * We isolate the pure logic by importing the handler and mocking supabase client.
 */
import { POST } from '@/app/api/projects/route'
import { setEnv } from './setup/set-env'

// Minimal mock for Request
function makeReq(body: any) {
  return new Request('http://localhost/api/projects', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' }
  })
}

describe('POST /api/projects', () => {
  const realEnv = { ...process.env }
  beforeAll(() => {
    setEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://test')
    setEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon')
  })
  afterAll(() => { process.env = realEnv })

  it('returns 400 when both inserts fail', async () => {
    jest.mock('@supabase/supabase-js', () => ({
      createClient: () => ({
        from: () => ({
          insert: () => ({ select: () => ({ single: () => ({ data: null, error: { message: 'constraint error' } }) }) })
        })
      })
    }))

    const res = await POST(makeReq({ name: 'X' }))
    const json = await (res as Response).json() as any
    expect((res as Response).status).toBe(400)
    expect(json.error).toBeTruthy()
  })
})
