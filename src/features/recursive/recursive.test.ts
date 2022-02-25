import { recursive, recursiveDefault, RecursiveNodeSelector, recursiveToMap, toPathMap } from "./recursive.utils"



describe('[Recursive] utils', () => {
  const TEST_OBJECT = {
    KEY_1: 'TEST_STRING',
    KEY_2: {
      KEY_3: null,
      KEY_4: true,
    },
    KEY_5: [
      undefined,
      {
        KEY_6: 3,
        KEY_7: false,
      },
    ]
  } as const

  describe('[recursive] function', () => {
    const TEST_REPLACE_VALUE = 'TEST_REPLACE'
    const TEST_RESULT = {
      KEY_1: TEST_REPLACE_VALUE,
      KEY_2: {
        KEY_3: TEST_REPLACE_VALUE,
        KEY_4: TEST_REPLACE_VALUE
      },
      KEY_5: [
        TEST_REPLACE_VALUE,
        {
          KEY_6: TEST_REPLACE_VALUE,
          KEY_7: TEST_REPLACE_VALUE,
        }
      ]
    }

    it('should return new object with replaced non-object values', () => {
      const result = recursive(TEST_OBJECT, { nodeSelector: () => TEST_REPLACE_VALUE })

      expect(result).toEqual(TEST_RESULT)
    })

    it('should start replacing from set path', () => {
      const result = recursive(TEST_OBJECT, { nodeSelector: () => TEST_REPLACE_VALUE }, 'KEY_5')

      expect(result).toEqual(TEST_RESULT.KEY_5)
    })
  })

  describe('[toPathMap] function', () => {
    it('should return new object with replaced non-object values into path string', () => {
      const TEST_RESULT = {
        KEY_1: 'KEY_1',
        KEY_2: {
          KEY_3: 'KEY_2.KEY_3',
          KEY_4: 'KEY_2.KEY_4',
        },
        KEY_5: {
          _0: 'KEY_5.0',
          _1: {
            KEY_6: 'KEY_5.1.KEY_6',
            KEY_7: 'KEY_5.1.KEY_7',
          }
        }
      }
      const result = toPathMap(TEST_OBJECT)

      expect(result).toEqual(TEST_RESULT)
    })

    it('should return new object with replaced values into path string', () => {
      const TEST_RESULT = {
        KEY_1$: 'KEY_1',
        KEY_2$: 'KEY_2',
        KEY_2: {
          KEY_3$: 'KEY_2.KEY_3',
          KEY_4$: 'KEY_2.KEY_4',
        },
        KEY_5$: 'KEY_5',
        KEY_5: {
          '_0$': 'KEY_5.0',
          '_1$': 'KEY_5.1',
          '_1': {
            KEY_6$: 'KEY_5.1.KEY_6',
            KEY_7$: 'KEY_5.1.KEY_7',
          },
        },
      }

      const result = toPathMap(TEST_OBJECT, true)

      expect(result).toEqual(TEST_RESULT)
    })
  })

  describe('[recursiveDefault] function', () => {
    const TEST_DEFAULT_VALUE = 'TEST_DEFAULT_VALUE'
    const TEST_RESULT = {
      KEY_1: 'TEST_STRING',
      KEY_2: {
        KEY_3: TEST_DEFAULT_VALUE,
        KEY_4: true,
      },
      KEY_5: [
        TEST_DEFAULT_VALUE,
        {
          KEY_6: 3,
          KEY_7: false,
        },
      ]
    }

    it('should return new object with replaced non-object values into default value', () => {
      const result = recursiveDefault(TEST_OBJECT, TEST_DEFAULT_VALUE)

      expect(result).toEqual(TEST_RESULT)
    })
    
    it('should work with selector', () => {
      const result = recursiveDefault(TEST_OBJECT, () => TEST_DEFAULT_VALUE)

      expect(result).toEqual(TEST_RESULT)
    })
  })

  describe('[recursiveToMap] function', () => {
    it('should convert all objects to maps', () => {
      const TEST_RESULT = {
        KEY_1: 'TEST_STRING',
        KEY_2: {
          KEY_3: null,
          KEY_4: true,
        },
        KEY_5: {
          '_0': undefined,
          '_1': {
            KEY_6: 3,
            KEY_7: false,
          },
        }
      }

      const result = recursiveToMap(TEST_OBJECT)

      expect(result).toEqual(TEST_RESULT)
    })

    it('should convert all objects to maps with selection values', () => {
      const TEST_RESULT = {
        KEY_1: 'KEY_1',
        KEY_2: {
          KEY_3: 'KEY_2.KEY_3',
          KEY_4: 'KEY_2.KEY_4',
        },
        KEY_5: {
          '_0': 'KEY_5.0',
          '_1': {
            KEY_6: 'KEY_5.1.KEY_6',
            KEY_7: 'KEY_5.1.KEY_7',
          },
        }
      }
      const valueSelector: RecursiveNodeSelector<object> = (options) => options.path.join('.')


      const result = recursiveToMap(TEST_OBJECT,  { valueSelector })


      expect(result).toEqual(TEST_RESULT)
    })
  })
})
