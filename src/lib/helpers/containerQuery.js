console.log('hellow')
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('body').classList.add('@container')
})
tailwind.config = {
  plugins: [
    function (obj) {
      console.log('first')
    },
    function containerQueries({ matchUtilities, matchVariant, theme }) {
      let values = theme('containers') ?? {}

      function parseValue(value) {
        let numericValue = value.match(/^(\d+\.\d+|\d+|\.\d+)\D+/)?.[1] ?? null
        if (numericValue === null) return null

        return parseFloat(value)
      }

      matchUtilities(
        {
          '@container': (value, { modifier }) => {
            return {
              'container-type': value,
              'container-name': modifier,
            }
          },
        },
        {
          values: {
            DEFAULT: 'inline-size',
            normal: 'normal',
          },
          modifiers: 'any',
        }
      )

      matchVariant(
        '@',
        (value = '', { modifier }) => {
          let parsed = parseValue(value)

          return parsed !== null ? `@container ${modifier ?? ''} (min-width: ${value})` : []
        },
        {
          values,
          sort(aVariant, zVariant) {
            let a = parseFloat(aVariant.value)
            let z = parseFloat(zVariant.value)

            if (a === null || z === null) return 0

            // Sort values themselves regardless of unit
            if (a - z !== 0) return a - z

            let aLabel = aVariant.modifier ?? ''
            let zLabel = zVariant.modifier ?? ''

            // Explicitly move empty labels to the end
            if (aLabel === '' && zLabel !== '') {
              return 1
            } else if (aLabel !== '' && zLabel === '') {
              return -1
            }

            // Sort labels alphabetically in the English locale
            // We are intentionally overriding the locale because we do not want the sort to
            // be affected by the machine's locale (be it a developer or CI environment)
            return aLabel.localeCompare(zLabel, 'en', { numeric: true })
          },
        }
      )
    },
  ],
  theme: {
    containers: {
      xs: '1rem',
      sm: '24rem',
      md: '32rem',
      lg: '42rem',
      xl: '56rem',
      '2xl': '66rem',
      '3xl': '76rem',
      '4xl': '86rem',
      '5xl': '96rem',
      '6xl': '106rem',
      '7xl': '116rem',
    },
  },
}
