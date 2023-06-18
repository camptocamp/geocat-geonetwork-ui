import { getAsUrl } from './atomic-operations'

describe('atomic operations', () => {
  describe('getAsUrl', () => {
    it('parses relative URL', () => {
      expect(getAsUrl('images/abc.png')).toEqual(
        'http://localhost/images/abc.png'
      )
    })
    it('parses absolute URL', () => {
      expect(getAsUrl('/org/images/abc.png')).toEqual(
        'http://localhost/org/images/abc.png'
      )
    })
    it('parses fully qualified URL', () => {
      expect(getAsUrl('https://myorg.net/images/abc.png')).toEqual(
        'https://myorg.net/images/abc.png'
      )
    })
    it('parses www url without protocol, adding HTTPs', () => {
      expect(getAsUrl('www.myorg.net')).toEqual('https://www.myorg.net/')
    })
  })
})
