    /**
     * Return `response data` value with unit
     * @param size - size of response data returned from the rest service
     * @returns {{unit: string, value: *}}
     */
     export const setDataUnit = (size: number) => {
        let finalSize: {
          value: number;
          unit: string;
        };
  
        if (typeof size === 'number') {
          if (size < 1024)
            finalSize = {
              value: size,
              unit: 'B',
            };
          else if (size < 1048576)
            finalSize = {
              value: size / 1024,
              unit: 'Kb',
            };
          else if (size < 1073741824)
            finalSize = {
              value: size / 1e6,
              unit: 'Mb',
            };
          else
            finalSize = {
              value: size / 1e9,
              unit: 'Gb',
            };
  
          if (finalSize.value) {
            finalSize.value = Number(finalSize.value.toFixed(2) || '');
  
            // TODO: check use-case
            /*  if (
              typeof finalSize.value === 'string' &&
              finalSize.value.includes('.00')
            )
              finalSize.value = finalSize.value.substring(
                0,
                finalSize.value.length - 3
              ); */
          }
        } else {
          size = Number(size);
  
          if (isNaN(size)) finalSize = { value: size, unit: '-' };
          else finalSize = { value: size, unit: 'B' };
        }
  
        return finalSize;
      };