import styled from 'styled-components'

const Demo = styled.div`
  ${({ pointer }) =>
    pointer === 'keyboard'
      ? `
      *:focus {
        outline: 2px solid #61dafb;
        outline-offset: -1px;
      }

      a:focus {
        outline: none;
        color: #61dafb;
        padding: 0.1rem 0.3rem;
        margin: 0 -0.3rem;
      }
      `
      : `
      *:focus {
        outline: none;
      }
  `}
`

const Figure = styled.figure`
  height: ${({ pointer, size }) =>
    pointer === 'mouse'
      ? `${size[0]}px`
      : `${size[0] + size[1]}px` || `${size[0]}px`};
  transition: height 0.3s ease;

  ${({ pointer }) =>
    pointer === 'mouse'
      ? `
      &{
        img {
          transform: translate3d(0, 0, 0);
          transition: transform 0.3s ease;
        }
        figcaption {
          position: absolute;
          bottom: 0;
          left: 0;
          transform: translate3d(0, 144px, 0);
          transition: transform 0.3s ease;
        }

        &:hover {
          figcaption {
            transform: translate3d(0, 0, 0);
            transition: transform 0.3s ease;
          }
          img {
            transform: translate3d(0, -144px, 0);
          }
        }
      }
    `
      : `
      figcaption {
        transform: translate3d(0, 0, 0);
        position: relative;
        bottom: auto;
        left: auto;
        height: auto;
      }
  `}
`

export default {
  Demo,
  Figure,
}
