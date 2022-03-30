![Imgur](https://imgur.com/rqS9FVr.png)

# sprudel

This is meant to be a nice and flexible Particle System for three.js. In its core it utilizes ```miniplex``` as ECS. 

## Core Concepts

Every particle is represented as entity in an ECS world. It's components holds all the data needed to simulate the particle behaviour.

Systems iterate over sets of particles every frame and advance their values accordingly to their behaviour.

A BufferGeometry reads the values and puts them into its attributes. Vertex and fragment shader uses them to appropriate display each particle.

## Usage
### @react-three/fiber
At the moment sprudel is tested in a react-three-fiber environment to avoid boilerplate.
It's designed to be used in both worlds. Below the r3f examples there's a short hint on plain three.js usage.

First, import `ParticleGeometry` and `ParticleMaterial` and extend them to make sure r3f will know them.

```JavaScript
import {extend} from "@react-three/fiber";
import {
    ParticleGeometry,
    ParticleMaterial
} from "sprudel";

extend({ParticleGeometry, ParticleMaterial})
```
In your Component wrap them in a points object.
```JavaScript
const Particles = () => {
    
    return (
        <points>
            <particleGeometry />
            <particleMaterial />
        </points>
    )
}
```

Since particles will move and change its appearance we need to update a few things and its up to you to do it.
You need to import the systems from the package.
```JavaScript
const Particles = () => {
    
    const ref = useRef()
    
    useFrame((state, delta) => {
        emittingSystem(delta);
        movingSystem(delta);
        livingSystem(delta);
        ref.current.update()
    });
    
    return (
        <points>
            <particleGeometry ref={ref} />
            <particleMaterial />
        </points>
    )
}
```

Now you are ready to add your first particle to your scene. world and validateParticle are imports, too. 
At the moment you will directly add entities to the particles world.
validateParticle is a bad named factory to make sure the entity will hold all components needed to make the particle alive
and you only need to pass in you custom data. This will definitly change.

```JavaScript
useEffect(() => {

        const main = world.createEntity(validateParticle({
            startSize: 3,
            emitting: [
                {
                    sprite: 1,
                    size: 3,
                    rateOverTime: 10,
                    startLifetime: 2,
                    startSpeed: 0.3,
                    startRotation: [1, 1, 0],
                },
            ]
        }));

        return () => world.destroyEntity(main);

    }, []);
```

There are a bunch of examples showing different configurations and behaviours in `/examples`

### three.js
In plain three.js you just create the objects like you are used to.

```JavaScript
const geo = new ParticleGeometry()
const mat = new ParticleMaterial()
const points = new Points(geo, mat)

scene.add(points)
```
You'd call geo.update() and the systems in your render loop and create the particle wherever you want.

## Properties

Your Particle System is defined by a data structure.

### Emitting

Each particle you create or emit can be an emitter too. Emitting can be done by a rate over time, defining how many particles shall be emitted in a second.
Props in an emitting object describe the particles that will be emitted. 

```JavaScript
{
    emitting: [
        {
            rateOverTime: 10,
            startLifetime: 1,
            size: 4,
            // ...
        },
        {
            rateOverTime: 30,
            startLifetime: .5,
            color: [1, 0, 0],
            // ...
        }
    ]
}
```
Or you create bursts which emit an amount of particles at the same time. By setting rateOverTime to zero, particles are only emitted by the burst. 

You can have multiple emitters and bursts on the same particle.

```JavaScript
{
    emitting: [
        {
            // ...
            rateOverTime: 0,
            startLifetime: 2,
            bursts: [
                {
                    count: 80,
                    cycleCount: -1,
                    repeatInterval: 1,
                    time: 0,
                }
            ],
        }
    ]
}
```

### Appearance

Visuals can be static or change over lifetime. It's simple like that.

```JavaScript
const particle = {
    color: [1, 1, 1],
    size: 1,
    opacity: 1,
    // ...
}
```

To change appearance over lifetime, assign a …OverLifetime prop. We use the three.js KeyframeTracks.

```JavaScript
const particle = {
    sizeOverLifetime: new NumberKeyframeTrack('Glowing Smoke Size', [0, 1], [3, 7]),
    opacityOverLifetime: new NumberKeyframeTrack('Glowing Smoke Opacity', [0, .6, 1], [.3, .2, 0]),
    colorOverLifetime: new ColorKeyframeTrack('Glowing Smoke Color', [0, .7], [.6, 0, 2, 0, 0, 0]),
    // ...
}
```

### Behaviour

There are several props influencing particle and emitting behaviour.

| Prop                | Description                             |
|---------------------|-----------------------------------------|
| `startDelay`        | time to wait until animation starts     |
| `startLifetime`     | initial lifetime (maximum age)          |     
| `startSpeed`        | initial speed                           |     
| `startPosition`     | initial position                        |     
| `startRotation`     | initial rotation                        |     
| `randomizeLifetime` | randomize initial lifetime              |     
| `randomizeSpeed`    | randomize initial speed                 |     
| `randomizePosition` | randomize initial position              |     
| `randomizeRotation` | randomize initial rotation              |     
| `speedModifier`     | factor to change speed every frame      |     
| `mass`              | factor to change y-position every frame |     

## Performance

By putting all the data into one BufferGeometry it takes only one drawcall disregarding how many particles you display.

Theres a spritesheet option to put all textures into one file and let each particle use another image.

RibbonRenderer isn't optimized at all.

There's the plan to built in an object pool or ring buffer to reuse entities instead of creating and deleting them over and over again.

## Examples

Go to `/examples` install the packages and run `npm run dev` to show them in your browser.

## Changelog

### v0.0.1 28-3-22
* Refactored particle rendering to plain three.js geometry and material
* Added a lot of documentation

### v0.0.0 24-3-22
* Initial setup 
