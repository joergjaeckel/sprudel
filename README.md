![Imgur](https://imgur.com/rqS9FVr.png)

# sprudel

This is meant to be a nice and flexible Particle System for three.js. In its core it utilizes ```miniplex``` as ECS. 

## Core Concepts

Every particle is represented as entity in an ECS world. It's components holds all the data needed to simulate the particle behaviour.

Systems iterate over sets of particles every frame and advance their values accordingly to their behaviour.

A BufferGeometry reads the values and puts them into its attributes. Vertex and fragment shader uses them to appropriate display each particle.

## Usage

At the moment sprudel is tested in a react-three-fiber environment. Plain three.js will follow.

First, import `ParticleGeometry` and `ParticleMaterial` and extend them to make sure r3f will know them.

```
import {
    ParticleGeometry,
    ParticleMaterial
} from "sprudel";

extend({ParticleGeometry, ParticleMaterial})
```
In your Component wrap them in a points object.
```
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
```
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

```
useEffect(() => {

        const main = world.createEntity(validateParticle({
            startSize: 3,
            emitting: [
                {
                    sprite: 1,
                    rateOverTime: 10,
                    startLifetime: 2,
                    startSpeed: 0.3,
                    startSize: 3,
                    startRotation: [1, 1, 0],
                },
            ]
        }));

        return () => world.destroyEntity(main);

    }, []);
```

There are a bunch of examples showing different configurations and behaviours in `/examples`

## Performance

By putting all the data into one BufferGeometry it takes only one drawcall disregarding how many particles you display.

Theres a spritesheet option to put all textures into one file and let each particle use another image.

RibbonRenderer isn't optimized at all.

There's the plan to built in an object pool or ring buffer to reuse entities instead of creating and deleting them over and over again.

## Examples

Go to ```/examples``` install the packages and run ```npm run dev``` to show them in your browser.

## Changelog

### v0.0.1 28-3-22
* Refactored particle rendering to plain three.js geometry and material
* Added a lot of documentation

### v0.0.0 24-3-22
* Initial setup 
