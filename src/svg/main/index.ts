import { createElement } from 'js-surface'

function f(tagName: string) {
  return createElement.bind(null, tagName)
}

export const
  a = f('a'),
  altGlyph = f('altGlyph'),
  altGlyphDef = f('altGlyphDef'),
  altGlyphItem = f('altGlyphItem'),
  animate = f('animate'),
  animateColor = f('animateColor'),
  animateMotion = f('animateMotion'),
  animateTransform = f('animateTransform'),
  circle = f('circle'),
  clipPath = f('clipPath'),
  colorProfile = f('color-profile'),
  cursor = f('cursor'),
  defs = f('defs'),
  desc = f('desc'),
  ellipse = f('ellipse'),
  feBlend = f('feBlend'),
  feColorMatrix = f('feColorMatrix'),
  feComponentTransfer = f('feComponentTransfer'),
  feComposite = f('feComposite'),
  feConvolveMatrix = f('feConvolveMatrix'),
  feDiffuseLighting = f('feDiffuseLighting'),
  feDisplacementMap = f('feDisplacementMap'),
  feDistantLight = f('feDistantLight'),
  feFlood = f('feFlood'),
  feFuncA = f('feFuncA'),
  feFuncB = f('feFuncB'),
  feFuncG = f('feFuncG'),
  feFuncR = f('feFuncR'),
  feGaussianBlur = f('feGaussianBlur'),
  feImage = f('feImage'),
  feMerge = f('feMerge'),
  feMergeNode = f('feMergeNode'),
  feMorphology = f('feMorphology'),
  feOffset = f('feOffset'),
  fePointLight = f('fePointLight'),
  feSpecularLighting = f('feSpecularLighting'),
  feSpotLight = f('feSpotLight'),
  feTile = f('feTile'),
  feTurbulence = f('feTurbulence'),
  filter = f('filter'),
  font = f('font'),
  foreignObject = f('foreignObject'),
  g = f('g'),
  glyph = f('glyph'),
  glyphRef = f('glyphRef'),
  hkern = f('hkern'),
  image = f('image'),
  line = f('line'),
  linearGradient = f('linearGradient'),
  marker = f('marker'),
  mask = f('mask'),
  metadata = f('metadata'),
  mpath = f('mpath'),
  path = f('path'),
  pattern = f('pattern'),
  polygon = f('polygon'),
  polyline = f('polyline'),
  radialGradient = f('radialGradient'),
  rect = f('rect'),
  script = f('script'),
  set = f('set'),
  stop = f('stop'),
  style = f('style'),
  svg = f('svg'),
  symbol = f('symbol'),
  text = f('text'),
  textPath = f('textPath'),
  title = f('title'),
  tref = f('tref'),
  tspan = f('tspan'),
  use = f('use'),
  view = f('view'),
  vkern = f('vkern')

const switch_ = f('switch')

export { switch_ as switch }

