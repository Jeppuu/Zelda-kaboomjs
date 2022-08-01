//init kaboom
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
const SLICER_SPEED = 60
const SKELETON_SPEED = 60

//make the game scene
scene('game', ({level, score}) => {

  layers(['bg','obj','ui'], 'obj')

  const maps = [
    [
      'ctt!tt%%td',
      'a        r',
      'a      * r',
      'a    X   r',
      '@        r',
      'a   X    r',
      'a  *     r',
      'a        r',
      'ebb!bb!bbf',

    ],
    [
      'cttttttttd',
      'a        r',
      'a        r',
      '!        !',
      '@        r',
      '!    =   r',
      'a        !',
      'a   S    r',
      'ebbbbbbbbf',
    ]
  ]
  //add level configuration
  const levelCfg = {
    width: 48,
    height: 48,
    "a": () => [
        sprite("left-wall"),
        area(),
        solid(),
        'wall'
    ],
    "b": () => [
        sprite("bottom-wall"),
        area(),
        solid(),
        'wall'
    ],
    "r": () => [
        sprite("right-wall"),
        area(),
        solid(),
        'wall'
    ],
    "t": () => [
        sprite("top-wall"),
        area(),
        solid(),
        'wall'
    ],
    "c": () => [
        sprite("top-left-corner"),
        area(),
        solid(),
        'wall'
    ],
    "d": () => [
        sprite("top-right-corner"),
        area(),
        solid(),
        'wall'
    ],
    "e": () => [
        sprite("bottom-left-corner"),
        area(),
        solid(),
        'wall'
    ],
    "f": () => [
        sprite("bottom-right-corner"),
        area(),
        solid(),
        'wall'
    ],
    "@": () => [
        sprite("left-door"),
        area(),
    ],
    "%": () => [
        sprite("top-door"),
        area(),
        'next-level'
    ],
    "=": () => [
        sprite("stairs"),
        area(),
        'next-level'
    ],
    "!": () => [
        sprite("lantern"),
        area(),
        solid(),
        'wall'
    ],
    "X": () => [
        sprite("fire-pot"),
        area(),
        solid(),
    ],
    "*": () => [
        sprite("slicer"),
        area(),
        'slicer',
        'dangerous',
        {dir: -1}
    ],
    "S": () => [
        sprite("skeleton"),
        area(),
        'skeleton',
        'dangerous',
        {dir: -1,
        timer: 0}
    ],

  }
  addLevel(maps[level], levelCfg)

  //add background image
  add([sprite('bg'), layer('bg')])

  //add a score
  const scoreLabel = add([
    text('score: ' + 0),
    pos(100,450),
    layer('ui'),
    scale(0.5),
    {
      value: score,
    }
  ])
  //add a level text
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
    solid(),
    {
      //goes right by default
      dir: vec2(1,0)
    }
  ])

  //moving to next level
  player.onCollide('next-level', () => {
    go('game',{
      level: (level + 1) % maps.length,
      score: scoreLabel.value
    })
  })

  //move the player
  onKeyDown('left', () => {
    //change link's sprite according to direction
    player.use(sprite('link-going-left'))
    player.move(-MOVE_SPEED,0)
    player.dir = vec2(-1,0)
  })
  onKeyDown('right', () => {
    player.use(sprite('link-going-right'))
    player.move(MOVE_SPEED,0)
    player.dir = vec2(1,0)
  })
  onKeyDown('up', () => {
    player.use(sprite('link-going-up'))
    player.move(0,-MOVE_SPEED)
    player.dir = vec2(0,-1)
  })
  onKeyDown('down', () => {
    player.use(sprite('link-going-down'))
    player.move(0,MOVE_SPEED)
    player.dir = vec2(0,1)
  })

  //spawn a kaboom to attack with
  function spawnKaboom(p) {
    const obj = add([
      sprite('kaboom'),
      pos(p),
      area(),
      'kaboom'
    ])
    //automatically destroy kaboom after a certain time
    wait(0.6, () => {
      destroy(obj)
    })
  }
  //attack with a kaboom
  onKeyPress('space', () => {
    spawnKaboom(player.pos.add(player.dir.scale(48)))
  })
  //enemies die when hit with a kaboom
  onCollide('kaboom', 'dangerous', (k,d) => {
    shake(4)
    wait(0.6, () => {
      destroy(k)
    })
    destroy(d)
    //score gets added from killing enemies
    scoreLabel.value++
    scoreLabel.text = 'score: ' + scoreLabel.value
  })

  //move enemies
  onUpdate('slicer', (s) => {
    s.move(s.dir * SLICER_SPEED,0)
  })

  onUpdate('skeleton', (s) => {
    s.move(0, s.dir * SKELETON_SPEED)
    s.timer -= dt()
    //skeleton changes direction according to randomized timer
    if(s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(7)
    }
  })

  //enemies change direction when hitting a wall
  onCollide('dangerous','wall', (s) => {
    s.dir = -s.dir
  })

  //game over when enemy cathes link
  player.onCollide('dangerous', () => {
    go('lose', {score: scoreLabel.value})
    //rip link :(
  })
//end of the game scene
})

//writing the lose scene
scene('lose', ({score}) => {
  add([
    text('game over! :(\n\nscore: ' + score),
    pos(150,180),
    scale(0.5)
  ])
})
//start the game 
go('game', {level: 0, score: 0})
