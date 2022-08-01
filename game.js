
kaboom({
  global:true,
  fullscreen: true,
  scale: 1,
  debug: true,
  background: [0,0,1]
});
//load sprites
loadRoot('sprites/')
loadSprite('link-going-left', 'link-left.png')
loadSprite('link-going-right', 'link-right.png')
loadSprite('link-going-up', 'link-up.png')
loadSprite('link-going-down', 'link-down.png')
loadSprite('bg', 'bg.png')
loadSprite('bottom-left-corner', 'corner-LB.png')
loadSprite('bottom-right-corner', 'corner-RB.png')
loadSprite('top-left-corner', 'corner-TL.png')
loadSprite('top-right-corner', 'corner-TR.jpg')
loadSprite('top-door', 'door-top.png')
loadSprite('left-door', 'left-door.png')
loadSprite('bottom-wall', 'wall-bottom.png')
loadSprite('left-wall', 'wall-left.png')
loadSprite('right-wall', 'wall-right.png')
loadSprite('top-wall', 'wall-top.png')
loadSprite('fire-pot', 'fire-pot.png')
loadSprite('lantern', 'lantern.png')
loadSprite('slicer', 'red-thing.png')
loadSprite('skeleton', 'skeleton.png')
loadSprite('stairs', 'stairs.png')
loadSprite('kaboom', 'kaboom.png')

const MOVE_SPEED = 120

scene('game', ({level, score}) => {

  layers(['bg','obj','ui'], 'obj')

  const maps = [
    [
      'ctt!tt%ttd',
      'a        r',
      'a      * r',
      'a    X   r',
      '@        r',
      'a    X   r',
      'a  *     r',
      'a        r',
      'ebb!bb!bbf',

    ],[
      //second level/map
    ]
  ]

  const levelCfg = {
    width: 48,
    height: 48,
    "a": () => [
        sprite("left-wall"),
        area(),
        solid(),
    ],
    "b": () => [
        sprite("bottom-wall"),
        area(),
        solid(),
    ],
    "r": () => [
        sprite("right-wall"),
        area(),
        solid(),
    ],
    "t": () => [
        sprite("top-wall"),
        area(),
        solid(),
    ],
    "c": () => [
        sprite("top-left-corner"),
        area(),
        solid(),
    ],
    "d": () => [
        sprite("top-right-corner"),
        area(),
        solid(),
    ],
    "e": () => [
        sprite("bottom-left-corner"),
        area(),
        solid(),
    ],
    "f": () => [
        sprite("bottom-right-corner"),
        area(),
        solid(),
    ],
    "@": () => [
        sprite("left-door"),
        area(),
    ],
    "%": () => [
        sprite("top-door"),
        area(),
    ],
    "!": () => [
        sprite("lantern"),
        area(),
        solid(),
    ],
    "X": () => [
        sprite("fire-pot"),
        area(),
        solid(),
    ],
    "*": () => [
        sprite("slicer"),
        area(),
    ],
    "S": () => [
        sprite("skeleton"),
        area(),
    ],

  }
  const levelNumber = 0
  addLevel(maps[levelNumber], levelCfg)

  //add background image
  add([sprite('bg'), layer('bg')])

//add score
  add([
    text('0'),
    pos(100,450),
    layer('ui'),
    scale(0.5),
    {
      value: score,
    }
  ])
  //add level text
  add([
    text('level: ' + parseInt(level + 1)),
    pos(100,485),
    scale(0.5)
  ])

  //add the player
  const player = add([
    sprite('link-going-right'),
    pos(50,190),
    area(),
    {
      //goes right by default
      dir: vec2(1,0)
    }
  ])

  //move the player
  onKeyDown('left', () => {
    //change sprite to left
    player.use(sprite('link-going-left'))
    player.move(-MOVE_SPEED,0)
    player.dir = vec2(-1,0)
  })



})

go('game', {level: 0, score: 0})
